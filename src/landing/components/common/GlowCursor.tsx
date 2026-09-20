import React, { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import './GlowCursor.css';

const MAX_POINTS = 40;

const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

#define MAX_POINTS 40

uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uHotspot;
uniform float uBrightness;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uNormalBlend;
uniform float uTime;
uniform float uFade;

varying vec2 vUv;

float sRGB(float x) {
  if (x <= 0.00031308) return 12.92 * x;
  return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

void main() {
  if (uFade < 0.003) discard;

  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float strongestCore = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float falloff = max(width * (0.8 + uGlowSpread * 1.4), 0.5);
    float beam = min(1.0, (falloff * falloff) / (distanceToTrail * distanceToTrail + falloff * falloff));
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.5);
    float pulseAmount = min(abs(uPulseSpeed), 1.0);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 3.0 - progress * 11.0) * 0.16 * pulseAmount;
    float intensity = (core + beam * uGlowIntensity * 0.55) * life * pulse * active;
    vec3 segmentColor = mix(uColor, uSecondaryColor, progress);

    strongest = max(strongest, intensity);
    strongestCore = max(strongestCore, core * life * active);
    colorSum += segmentColor * intensity;
    colorWeight += intensity;
  }

  float alpha = clamp(strongest * uOpacity * uFade, 0.0, 1.0);
  if (alpha < 0.001) discard;

  vec3 color = colorSum / max(colorWeight, 0.0001);
  color = mix(color, vec3(1.0), smoothstep(0.25, 0.95, strongestCore) * uHotspot);
  float luminance = sRGB(clamp(strongest * uBrightness, 0.0, 1.0));
  vec3 additiveColor = color * luminance;
  float normalAlpha = clamp(strongest * uBrightness * uOpacity * uFade, 0.0, 1.0);
  vec3 normalColor = mix(color, vec3(1.0), smoothstep(0.45, 1.0, strongestCore) * uHotspot * 0.35);
  gl_FragColor = vec4(mix(additiveColor, normalColor, uNormalBlend), mix(alpha, normalAlpha, uNormalBlend));
}
`;

const hexToRgb = (hex?: string): [number, number, number] => {
  let value = (hex || '').replace('#', '').trim();
  if (value.length === 3)
    value = value
      .split('')
      .map(char => char + char)
      .join('');
  const parsed = Number.parseInt(value || '000000', 16);
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255];
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export interface GlowCursorProps {
  color?: string;
  secondaryColor?: string;
  trailLength?: number;
  trailWidth?: number;
  trailTaper?: number;
  followSpeed?: number;
  glowIntensity?: number;
  glowSpread?: number;
  hotspot?: number;
  brightness?: number;
  opacity?: number;
  pulseSpeed?: number;
  noiseStrength?: number;
  idleFade?: boolean;
  idleTimeout?: number;
  fadeDuration?: number;
  blendMode?: 'normal' | 'screen' | 'plus-lighter';
  maxDevicePixelRatio?: number;
  enabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const GlowCursor: React.FC<GlowCursorProps> = ({
  color = '#67E8F9',
  secondaryColor = '#A78BFA',
  trailLength = 32,
  trailWidth = 8,
  trailTaper = 0.8,
  followSpeed = 0.88,
  glowIntensity = 1.35,
  glowSpread = 1.0,
  hotspot = 0.6,
  brightness = 1.15,
  opacity = 0.88,
  pulseSpeed = 1.0,
  idleFade = true,
  idleTimeout = 600,
  fadeDuration = 600,
  blendMode = 'screen',
  maxDevicePixelRatio = 1.0,
  enabled = true,
  children,
  className = '',
  contentClassName = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const propsRef = useRef<any>({});

  propsRef.current = {
    color,
    secondaryColor,
    trailLength: Math.min(trailLength, MAX_POINTS),
    trailWidth,
    trailTaper,
    followSpeed,
    glowIntensity,
    glowSpread,
    hotspot,
    brightness,
    opacity,
    pulseSpeed,
    idleFade,
    idleTimeout,
    fadeDuration,
    maxDevicePixelRatio,
    blendMode,
    enabled
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip on touch-only small screens
    const isTouchOnly = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 768;
    if (isTouchOnly) return;

    const initialConfig = propsRef.current;
    const renderer = new Renderer({
      canvas,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.0)
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const pointData = Array(MAX_POINTS * 2).fill(0);
    const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }));
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uResolution: { value: [1, 1] },
        uPoints: { value: pointData },
        uPointCount: { value: initialConfig.trailLength },
        uColor: { value: hexToRgb(initialConfig.color) },
        uSecondaryColor: { value: hexToRgb(initialConfig.secondaryColor) },
        uTrailWidth: { value: initialConfig.trailWidth },
        uTaper: { value: initialConfig.trailTaper },
        uGlowIntensity: { value: initialConfig.glowIntensity },
        uGlowSpread: { value: initialConfig.glowSpread },
        uHotspot: { value: initialConfig.hotspot },
        uBrightness: { value: initialConfig.brightness },
        uOpacity: { value: initialConfig.opacity },
        uPulseSpeed: { value: initialConfig.pulseSpeed },
        uNormalBlend: { value: initialConfig.blendMode === 'normal' ? 1 : 0 },
        uTime: { value: 0 },
        uFade: { value: 0 }
      },
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let width = window.innerWidth;
    let height = window.innerHeight;
    let initialized = false;
    let pointerInside = false;
    let fade = 0;
    let lastInputTime = performance.now();
    let lastFrameTime = performance.now();
    let raf = 0;
    let isLoopRunning = false;
    let destroyed = false;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    const initializeTrail = (x: number, y: number) => {
      target.x = x;
      target.y = y;
      head.x = x;
      head.y = y;
      for (const point of points) {
        point.x = x;
        point.y = y;
      }
      initialized = true;
      fade = 1;
    };

    const startLoop = () => {
      if (!isLoopRunning && !destroyed) {
        isLoopRunning = true;
        lastFrameTime = performance.now();
        raf = requestAnimationFrame(render);
      }
    };

    const updatePointer = (event: PointerEvent | MouseEvent) => {
      const x = clamp(event.clientX, 0, width);
      const y = clamp(height - event.clientY, 0, height);
      if (!initialized) initializeTrail(x, y);
      target.x = x;
      target.y = y;
      pointerInside = true;
      lastInputTime = performance.now();
      startLoop();
    };

    const onPointerLeave = () => {
      pointerInside = false;
      lastInputTime = performance.now();
      startLoop();
    };

    const render = (now: number) => {
      if (destroyed) {
        isLoopRunning = false;
        return;
      }
      const config = propsRef.current;
      const delta = Math.min((now - lastFrameTime) / 16.667, 3);
      lastFrameTime = now;

      if (initialized) {
        const headEase = clamp(config.followSpeed ?? 0.88, 0.4, 0.95);
        head.x += (target.x - head.x) * headEase;
        head.y += (target.y - head.y) * headEase;
        points[0].x = head.x;
        points[0].y = head.y;

        const chainEase = 0.58;
        for (let i = 1; i < MAX_POINTS; i++) {
          points[i].x += (points[i - 1].x - points[i].x) * chainEase;
          points[i].y += (points[i - 1].y - points[i].y) * chainEase;
        }

        for (let i = 0; i < MAX_POINTS; i++) {
          pointData[i * 2] = points[i].x;
          pointData[i * 2 + 1] = points[i].y;
        }
      }

      const idleFor = now - lastInputTime;
      const shouldFade = config.idleFade && (!pointerInside || idleFor > config.idleTimeout);
      const fadeStep = (16.667 * delta) / Math.max(config.fadeDuration, 16);
      const fadeTarget = initialized && config.enabled && !shouldFade ? 1 : 0;
      fade += (fadeTarget - fade) * Math.min(1, fadeStep * 7);

      // Sleep animation loop when cursor is idle & faded -> 0% CPU & GPU!
      const distToTarget = Math.hypot(target.x - head.x, target.y - head.y);
      if (shouldFade && fade < 0.003 && distToTarget < 1.5) {
        fade = 0;
        program.uniforms.uFade.value = 0;
        renderer.render({ scene: mesh });
        isLoopRunning = false;
        return;
      }

      program.uniforms.uPointCount.value = clamp(Math.round(config.trailLength), 2, MAX_POINTS);
      program.uniforms.uColor.value = hexToRgb(config.color);
      program.uniforms.uSecondaryColor.value = hexToRgb(config.secondaryColor);
      program.uniforms.uTrailWidth.value = Math.max(config.trailWidth, 0.1);
      program.uniforms.uTaper.value = clamp(config.trailTaper, 0, 1);
      program.uniforms.uGlowIntensity.value = Math.max(config.glowIntensity, 0);
      program.uniforms.uGlowSpread.value = Math.max(config.glowSpread, 0);
      program.uniforms.uHotspot.value = clamp(config.hotspot, 0, 1);
      program.uniforms.uBrightness.value = Math.max(config.brightness, 0);
      program.uniforms.uOpacity.value = clamp(config.opacity, 0, 1);
      program.uniforms.uPulseSpeed.value = config.pulseSpeed;
      program.uniforms.uNormalBlend.value = config.blendMode === 'normal' ? 1 : 0;
      program.uniforms.uTime.value = now * 0.001;
      program.uniforms.uFade.value = fade;

      renderer.render({ scene: mesh });
      if (!destroyed) raf = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', updatePointer as EventListener, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    resize();
    startLoop();

    return () => {
      destroyed = true;
      isLoopRunning = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointer as EventListener);
      window.removeEventListener('pointerleave', onPointerLeave);
      mesh.geometry.remove();
      program.remove();
    };
  }, [maxDevicePixelRatio]);

  return (
    <div ref={containerRef} className={`glow-cursor${className ? ` ${className}` : ''}`} style={style} {...rest}>
      <canvas ref={canvasRef} className="glow-cursor__canvas" style={{ mixBlendMode: blendMode }} aria-hidden="true" />
      {children && (
        <div className={`glow-cursor__content${contentClassName ? ` ${contentClassName}` : ''}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default GlowCursor;
