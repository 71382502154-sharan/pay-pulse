'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useDesign } from '@/context/DesignContext';
import { RotateCcw, ShieldCheck, Zap, Sparkles, CreditCard, Compass, Lock } from 'lucide-react';

export interface PayrollEcosystemCanvasProps {
  className?: string;
  onSelectFeature?: (featureName: string) => void;
  onNodeSelect?: (node?: any) => void;
  selectedNodeId?: string | null;
}

export const PayrollEcosystemCanvas: React.FC<PayrollEcosystemCanvasProps> = ({
  className = '',
  onSelectFeature,
  onNodeSelect,
  selectedNodeId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { config } = useDesign();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeTelemetry, setActiveTelemetry] = useState<string>('0.00% CALCULATION DRIFT ASSERTED');
  const flipCardRef = useRef<(() => void) | null>(null);
  const resetCameraRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current || config.threeDIntensity === 'none') return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const isLight = config.theme === 'light';

    // 1. THREE.JS SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(new THREE.Color(isLight ? '#faf8ff' : '#0b0f19'), 0.025);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const defaultCameraPos = new THREE.Vector3(0, 0.8, 10.5);
    camera.position.copy(defaultCameraPos);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.15 : 1.35;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 2. CREATE SHARP HIGH-RES CANVAS TEXTURES FOR 3D FIDUCIARY CARD
    // FRONT TEXTURE
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 1024;
    frontCanvas.height = 640;
    const fCtx = frontCanvas.getContext('2d')!;

    // Card background gradient (PayPulse corporate identity: #001815 -> #000f3f -> #003e39)
    const cardGrad = fCtx.createLinearGradient(0, 0, 1024, 640);
    cardGrad.addColorStop(0, '#001815');
    cardGrad.addColorStop(0.45, '#000f3f');
    cardGrad.addColorStop(1, '#003e39');
    fCtx.fillStyle = cardGrad;
    fCtx.fillRect(0, 0, 1024, 640);

    // Circuit grid line accents
    fCtx.strokeStyle = 'rgba(113, 248, 228, 0.15)';
    fCtx.lineWidth = 1.5;
    for (let x = 80; x < 1024; x += 120) {
      fCtx.beginPath();
      fCtx.moveTo(x, 0);
      fCtx.lineTo(x, 640);
      fCtx.stroke();
    }
    for (let y = 60; y < 640; y += 100) {
      fCtx.beginPath();
      fCtx.moveTo(0, y);
      fCtx.lineTo(1024, y);
      fCtx.stroke();
    }

    // Holographic rainbow accent band
    const holoGrad = fCtx.createLinearGradient(0, 0, 1024, 0);
    holoGrad.addColorStop(0, 'rgba(113, 248, 228, 0.4)');
    holoGrad.addColorStop(0.3, 'rgba(79, 219, 200, 0.4)');
    holoGrad.addColorStop(0.6, 'rgba(0, 106, 99, 0.4)');
    holoGrad.addColorStop(1, 'rgba(128, 141, 194, 0.4)');
    fCtx.fillStyle = holoGrad;
    fCtx.fillRect(0, 620, 1024, 20);

    // Brand Logo & System Tag
    fCtx.fillStyle = '#ffffff';
    fCtx.font = 'bold 36px monospace';
    fCtx.fillText('PAYPULSE', 80, 95);

    fCtx.fillStyle = '#71f8e4';
    fCtx.font = 'bold 22px monospace';
    fCtx.fillText('ENTERPRISE FIDUCIARY CORE', 280, 92);

    fCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    fCtx.font = '16px monospace';
    fCtx.fillText('ZERO-DRIFT PROTOCOL // 256-BIT CMS', 80, 130);

    // Live Escrow Balance
    fCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    fCtx.font = '16px monospace';
    fCtx.fillText('LIQUID ESCROW RESERVE:', 80, 360);

    fCtx.fillStyle = '#10b981';
    fCtx.font = 'black 54px monospace';
    fCtx.fillText('₹ 12,40,00,000.00', 80, 420);

    // Card Details
    fCtx.fillStyle = '#ffffff';
    fCtx.font = 'bold 22px monospace';
    fCtx.fillText('DIRECTOR & CONTROLLER AUTHORIZED', 80, 540);

    fCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    fCtx.font = '16px monospace';
    fCtx.fillText('ID: 0x7F2A...9C1D', 80, 575);

    fCtx.fillStyle = '#00f0ff';
    fCtx.font = 'bold 18px monospace';
    fCtx.fillText('100% CENT-PRECISION', 740, 540);

    fCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    fCtx.font = '16px monospace';
    fCtx.fillText('0.00% DRIFT VERIFIED', 740, 575);

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.anisotropy = 8;

    // BACK TEXTURE
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 1024;
    backCanvas.height = 640;
    const bCtx = backCanvas.getContext('2d')!;

    // Dark titanium back
    bCtx.fillStyle = '#070b14';
    bCtx.fillRect(0, 0, 1024, 640);

    // Magnetic Strip
    bCtx.fillStyle = '#020408';
    bCtx.fillRect(0, 80, 1024, 110);

    // Signature Panel
    bCtx.fillStyle = '#1e293b';
    bCtx.fillRect(80, 240, 600, 70);
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    bCtx.font = 'italic 20px sans-serif';
    bCtx.fillText('Audited by Fiduciary Controller • 1,428 Enrolled Staff', 100, 285);

    // Security CVV / Token Box
    bCtx.fillStyle = '#00f0ff';
    bCtx.fillRect(700, 240, 160, 70);
    bCtx.fillStyle = '#000000';
    bCtx.font = 'bold 24px monospace';
    bCtx.fillText('SHA-256', 730, 285);

    // Cryptographic Barcode / Telemetry
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    bCtx.font = '14px monospace';
    bCtx.fillText('ISO-27001 CERTIFIED • INSTITUTIONAL BANKING ESCROW CMS GATEWAY', 80, 420);
    bCtx.fillText('EPFO ECR UNIFIED PORTAL TEXT FORMAT COMPLIANT // FORM 24Q TDS', 80, 450);
    bCtx.fillText('BLOCK HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 80, 480);

    // Holographic Seal Emblem
    bCtx.beginPath();
    bCtx.arc(880, 450, 50, 0, Math.PI * 2);
    bCtx.fillStyle = holoGrad;
    bCtx.fill();
    bCtx.fillStyle = '#000000';
    bCtx.font = 'bold 12px monospace';
    bCtx.fillText('VERIFIED', 855, 455);

    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.anisotropy = 8;

    // 3. CREATE 3D BEVELED ROUNDED CARD GEOMETRY
    const cardWidth = 5.2;
    const cardHeight = 3.25;
    const cardRadius = 0.22;
    const cardDepth = 0.08;

    const cardShape = new THREE.Shape();
    cardShape.moveTo(-cardWidth / 2 + cardRadius, -cardHeight / 2);
    cardShape.lineTo(cardWidth / 2 - cardRadius, -cardHeight / 2);
    cardShape.quadraticCurveTo(cardWidth / 2, -cardHeight / 2, cardWidth / 2, -cardHeight / 2 + cardRadius);
    cardShape.lineTo(cardWidth / 2, cardHeight / 2 - cardRadius);
    cardShape.quadraticCurveTo(cardWidth / 2, cardHeight / 2, cardWidth / 2 - cardRadius, cardHeight / 2);
    cardShape.lineTo(-cardWidth / 2 + cardRadius, cardHeight / 2);
    cardShape.quadraticCurveTo(-cardWidth / 2, cardHeight / 2, -cardWidth / 2, cardHeight / 2 - cardRadius);
    cardShape.lineTo(-cardWidth / 2, -cardHeight / 2 + cardRadius);
    cardShape.quadraticCurveTo(-cardWidth / 2, -cardHeight / 2, -cardWidth / 2 + cardRadius, -cardHeight / 2);

    const extrudeSettings = {
      depth: cardDepth,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    };

    const cardGeo = new THREE.ExtrudeGeometry(cardShape, extrudeSettings);
    cardGeo.center();

    // Materials: Front texture, Back texture, Titanium side edges
    const rimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(isLight ? '#94a3b8' : '#334155'),
      metalness: 0.95,
      roughness: 0.18,
    });

    const frontMat = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      roughness: 0.15,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
    });

    // The ExtrudeGeometry creates 2 materials: [0: front/back caps, 1: sides]
    // To support front vs back textures, we create a composite card mesh
    const cardGroup = new THREE.Group();
    rootGroup.add(cardGroup);

    // Front Face Plate
    const frontPlaneGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const frontMesh = new THREE.Mesh(frontPlaneGeo, frontMat);
    frontMesh.position.z = cardDepth / 2 + 0.04;
    cardGroup.add(frontMesh);

    // Back Face Plate (rotated 180 on Y)
    const backPlaneGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);
    const backMesh = new THREE.Mesh(backPlaneGeo, backMat);
    backMesh.rotation.y = Math.PI;
    backMesh.position.z = -(cardDepth / 2 + 0.04);
    cardGroup.add(backMesh);

    // Beveled Titanium Outer Chassis Rim
    const rimMesh = new THREE.Mesh(cardGeo, rimMat);
    cardGroup.add(rimMesh);

    // 4. EMBEDDED 3D METALLIC GOLD CONTACT CHIP
    const chipGroup = new THREE.Group();
    chipGroup.position.set(-1.6, 0.45, cardDepth / 2 + 0.05);

    const chipBodyGeo = new THREE.BoxGeometry(0.72, 0.6, 0.03);
    const chipBodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#d97706'),
      emissive: new THREE.Color('#f59e0b'),
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.95,
    });
    const chipMesh = new THREE.Mesh(chipBodyGeo, chipBodyMat);
    chipGroup.add(chipMesh);

    // Chip contact division lines (etched grooves)
    const lineGeo1 = new THREE.BoxGeometry(0.68, 0.015, 0.035);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const lineMesh1 = new THREE.Mesh(lineGeo1, lineMat);
    chipGroup.add(lineMesh1);

    const lineGeo2 = new THREE.BoxGeometry(0.015, 0.54, 0.035);
    const lineMesh2 = new THREE.Mesh(lineGeo2, lineMat);
    chipGroup.add(lineMesh2);

    cardGroup.add(chipGroup);

    // 5. FLOATING HOLOGRAPHIC DATA SLABS IN 3D SPACE
    interface HologramSlab {
      mesh: THREE.Group;
      initialPos: THREE.Vector3;
      phase: number;
      speed: number;
    }

    const slabs: HologramSlab[] = [];

    const createSlab = (
      title: string,
      metric: string,
      color: string,
      pos: THREE.Vector3,
      phase: number
    ) => {
      const slabGroup = new THREE.Group();

      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 200;
      const ctx = canvas.getContext('2d')!;

      // Glass slab background
      ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(15, 23, 42, 0.9)';
      ctx.roundRect(0, 0, 512, 200, 24);
      ctx.fill();

      // Border glow
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.roundRect(2, 2, 508, 196, 24);
      ctx.stroke();

      // Title & Metric
      ctx.fillStyle = isLight ? '#475569' : '#94a3b8';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(title, 36, 65);

      ctx.fillStyle = color;
      ctx.font = 'black 46px monospace';
      ctx.fillText(metric, 36, 135);

      // Status indicator dot
      ctx.beginPath();
      ctx.arc(460, 60, 10, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 4;

      const slabGeo = new THREE.PlaneGeometry(2.1, 0.82);
      const slabMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      });
      const slabPlane = new THREE.Mesh(slabGeo, slabMat);
      slabGroup.add(slabPlane);

      slabGroup.position.copy(pos);
      rootGroup.add(slabGroup);

      slabs.push({
        mesh: slabGroup,
        initialPos: pos.clone(),
        phase,
        speed: 1.6 + Math.random() * 0.4,
      });
    };

    createSlab('ESCROW CMS DISBURSAL', '₹6.94 Cr Payout', '#10b981', new THREE.Vector3(3.2, 1.4, 0.8), 0);
    createSlab('CALCULATION DRIFT', '0.000% Asserted', '#00f0ff', new THREE.Vector3(-3.2, -1.2, 0.6), 1.5);
    createSlab('ZK-TECO BIOMETRIC', '21,480 Punches', '#38bdf8', new THREE.Vector3(-3.1, 1.5, -0.4), 3.0);
    createSlab('EPFO ECR CHALLAN', '100% Validated', '#f59e0b', new THREE.Vector3(3.1, -1.3, -0.2), 4.5);

    // 6. UNDULATING MATHEMATICAL KINETIC WAVEFORM (Beneath the card)
    const waveGeo = new THREE.PlaneGeometry(22, 16, 36, 28);
    waveGeo.rotateX(-Math.PI / 2.3);
    const waveMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(isLight ? '#0284c7' : '#00f0ff'),
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.22 : 0.16,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.y = -2.8;
    rootGroup.add(waveMesh);

    // Cache initial positions for wave animation
    const wavePosAttr = waveGeo.attributes.position;
    const waveInitialZ = new Float32Array(wavePosAttr.count);
    for (let i = 0; i < wavePosAttr.count; i++) {
      waveInitialZ[i] = wavePosAttr.getY(i);
    }

    // 7. AMBIENT PARTICLES (Micro Stardust)
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 18;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 18;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: new THREE.Color(isLight ? '#0284c7' : '#00f0ff'),
      transparent: true,
      opacity: isLight ? 0.35 : 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 8. DYNAMIC CURSOR LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1.4 : 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isLight ? 1.2 : 1.6);
    keyLight.position.set(5, 6, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(new THREE.Color('#00f0ff'), 1.2);
    rimLight.position.set(-6, -3, -5);
    scene.add(rimLight);

    const cursorPointLight = new THREE.PointLight(
      new THREE.Color(isLight ? '#00bba7' : '#71f8e4'),
      isLight ? 3.2 : 2.8,
      16
    );
    cursorPointLight.position.set(0, 0, 5);
    scene.add(cursorPointLight);

    // 9. INTERACTIVE CONTROLS & PARALLAX PHYSICS
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetCardRotY = 0;
    let targetCardRotX = 0.08;
    let currentCardRotY = 0;
    let currentCardRotX = 0.08;
    let cardFlipAngle = 0;
    let targetCardFlipAngle = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      container.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Dynamic cursor light position tracking
      cursorPointLight.position.x = normX * 4;
      cursorPointLight.position.y = normY * 3;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        targetCardRotY += deltaX * 0.006;
        targetCardRotX += deltaY * 0.004;
        targetCardRotX = Math.max(-0.45, Math.min(0.45, targetCardRotX));
      } else {
        // Smooth parallax gyroscopic tilt
        targetCardRotY = normX * 0.28 + targetCardFlipAngle;
        targetCardRotX = -normY * 0.22 + 0.06;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.005;
      camera.position.z = Math.max(6.5, Math.min(15.0, camera.position.z));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.style.cursor = 'grab';

    // Flip card trigger
    flipCardRef.current = () => {
      targetCardFlipAngle = targetCardFlipAngle === 0 ? Math.PI : 0;
      setIsFlipped(targetCardFlipAngle !== 0);
      setActiveTelemetry(
        targetCardFlipAngle !== 0 ? 'ISO-27001 AUDIT CIPHER VERIFIED' : 'LIQUID ESCROW RESERVE: ₹12.40 CR'
      );
    };

    // Reset Camera trigger
    resetCameraRef.current = () => {
      targetCardFlipAngle = 0;
      targetCardRotX = 0.08;
      targetCardRotY = 0;
      camera.position.copy(defaultCameraPos);
      setIsFlipped(false);
      setActiveTelemetry('PERSPECTIVE CALIBRATED • 0.00% DRIFT');
    };

    // 10. ANIMATION LOOP with Visibility Observer
    let animationFrameId = 0;
    let isVisible = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damping rotation with gyroscopic inertia
      currentCardRotY += (targetCardRotY - currentCardRotY) * 0.07;
      currentCardRotX += (targetCardRotX - currentCardRotX) * 0.07;

      // Subtle levitation sine wave for the card
      cardGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
      cardGroup.rotation.y = currentCardRotY;
      cardGroup.rotation.x = currentCardRotX;

      // Animate floating holographic telemetry slabs
      slabs.forEach(({ mesh, initialPos, phase, speed }) => {
        mesh.position.y = initialPos.y + Math.sin(elapsedTime * speed + phase) * 0.15;
        // Make slabs face forward slightly tilted with card
        mesh.rotation.y = currentCardRotY * 0.35;
        mesh.rotation.x = currentCardRotX * 0.35;
      });

      // Animate mathematical kinetic waveform
      const pos = waveGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getZ(i);
        const waveHeight =
          Math.sin(u * 0.4 + elapsedTime * 1.2) * Math.cos(v * 0.35 + elapsedTime * 1.0) * 0.32;
        pos.setY(i, waveInitialZ[i] + waveHeight);
      }
      pos.needsUpdate = true;

      // Drift micro-stardust particles
      particleSystem.rotation.y = elapsedTime * 0.012;

      renderer.render(scene, camera);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !animationFrameId) {
          clock.start();
          animate();
        }
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(container);

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [config]);

  const handleFlipCard = useCallback(() => {
    if (flipCardRef.current) {
      flipCardRef.current();
    }
  }, []);

  const handleResetCamera = useCallback(() => {
    if (resetCameraRef.current) {
      resetCameraRef.current();
    }
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[460px] overflow-hidden select-none font-['Inter'] ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Top-Left Telemetry Status Pill */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface/80 border border-primary/30 backdrop-blur-md text-[11px] font-mono text-content-primary shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wide">PAYPULSE FIDUCIARY VAULT</span>
          <span className="text-content-dim">•</span>
          <span className="text-primary font-bold">256-BIT CMS</span>
        </div>
        <div className="text-[10px] font-mono text-content-dim px-1 tracking-wider opacity-80">
          {activeTelemetry}
        </div>
      </div>

      {/* Top-Right Interactive Flip & Action Pill */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={handleFlipCard}
          className="px-3.5 py-1.5 rounded-xl bg-surface/90 border border-primary/40 hover:border-primary text-content-primary hover:text-primary transition-all backdrop-blur-md text-xs font-mono font-bold shadow-glow flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          title="Flip 3D Card 180°"
        >
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          <span>{isFlipped ? 'View Front Face' : 'Inspect Security Back'}</span>
        </button>
      </div>

      {/* Bottom Controls & Navigation Hint */}
      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[10px] font-mono text-content-dim pointer-events-none">
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCamera}
            className="pointer-events-auto p-1.5 rounded-lg bg-surface/80 border border-border/80 text-content-secondary hover:text-primary hover:border-primary/50 transition-all backdrop-blur-md cursor-pointer shadow-sm flex items-center gap-1.5"
            title="Reset Perspective"
          >
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline text-[10px] font-bold">Calibrate View</span>
          </button>
          <span className="hidden md:inline px-2 py-0.5 rounded bg-surface/60 border border-border/40">
            Interactive Parallax Gyroscope
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-surface/70 px-3 py-1 rounded-full border border-border/60 backdrop-blur-md">
          <RotateCcw className="w-3 h-3 text-primary animate-spin" style={{ animationDuration: '14s' }} />
          <span>Drag to Orbit • Move Mouse to Tilt • Click Flip Button</span>
        </div>
      </div>
    </div>
  );
};

export default PayrollEcosystemCanvas;
