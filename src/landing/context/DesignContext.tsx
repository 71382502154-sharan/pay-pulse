'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DesignConfig,
  ThemeMode,
  ColorMode,
  AnimationIntensity,
  ThreeDIntensity,
  GlowIntensity,
  MotionSpeed,
  BorderRadiusSize,
  ColorPalette,
  DEFAULT_DESIGN_CONFIG,
  COLOR_PALETTES,
  RADIUS_VALUES,
} from '@/config/design';

interface DesignContextType {
  config: DesignConfig;
  setTheme: (theme: ThemeMode) => void;
  setColorMode: (mode: ColorMode) => void;
  setAnimationIntensity: (intensity: AnimationIntensity) => void;
  setThreeDIntensity: (intensity: ThreeDIntensity) => void;
  setGlowIntensity: (intensity: GlowIntensity) => void;
  setMotionSpeed: (speed: MotionSpeed) => void;
  setBorderRadius: (radius: BorderRadiusSize) => void;
  updateCustomColor: (key: keyof ColorPalette, value: string) => void;
  resetConfig: () => void;
  exportConfigJSON: () => string;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

const STORAGE_KEY = 'paypulse_design_config_v5';

export interface DesignProviderProps {
  children: React.ReactNode;
  forcedTheme?: 'dark' | 'light';
}

export const DesignProvider: React.FC<DesignProviderProps> = ({ children, forcedTheme }) => {
  const [config, setConfig] = useState<DesignConfig>(() => {
    // Synchronize initial theme directly with the web application's paypulse_theme
    let initialTheme: ThemeMode = DEFAULT_DESIGN_CONFIG.theme;
    if (forcedTheme) {
      initialTheme = forcedTheme;
    } else {
      try {
        const savedWebTheme = localStorage.getItem('paypulse_theme');
        if (savedWebTheme === 'dark' || savedWebTheme === 'light') {
          initialTheme = savedWebTheme;
        } else if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
          initialTheme = 'dark';
        }
      } catch {}
    }
    const palette = initialTheme === 'dark' ? COLOR_PALETTES.professional.dark : COLOR_PALETTES.professional.light;
    return {
      ...DEFAULT_DESIGN_CONFIG,
      theme: initialTheme,
      colors: palette,
    };
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load configuration from local storage, keeping web theme in sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedWebTheme = localStorage.getItem('paypulse_theme');
      const activeTheme: ThemeMode = forcedTheme || (savedWebTheme === 'dark' || savedWebTheme === 'light' ? savedWebTheme : config.theme);

      if (saved) {
        const parsed = JSON.parse(saved);
        const palette = activeTheme === 'dark' ? COLOR_PALETTES.professional.dark : COLOR_PALETTES.professional.light;
        setConfig((prev) => ({
          ...prev,
          ...parsed,
          theme: activeTheme,
          colorMode: 'professional',
          colors: palette,
        }));
      } else {
        const palette = activeTheme === 'dark' ? COLOR_PALETTES.professional.dark : COLOR_PALETTES.professional.light;
        setConfig((prev) => ({
          ...prev,
          theme: activeTheme,
          colorMode: 'professional',
          colors: palette,
        }));
      }
    } catch (e) {
      console.warn('Failed to load saved design config', e);
    }
    setIsHydrated(true);
  }, [forcedTheme]);

  // Listen for paypulse-theme-change events from Header/LoginPage/App
  useEffect(() => {
    const handleSync = () => {
      try {
        const currentTheme = localStorage.getItem('paypulse_theme');
        if (currentTheme === 'dark' || currentTheme === 'light') {
          setConfig((prev) => {
            if (prev.theme === currentTheme) return prev;
            const palette = currentTheme === 'dark' ? COLOR_PALETTES.professional.dark : COLOR_PALETTES.professional.light;
            return {
              ...prev,
              theme: currentTheme,
              colors: palette,
            };
          });
        }
      } catch {}
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('paypulse-theme-change', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('paypulse-theme-change', handleSync);
    };
  }, []);

  // Save to local storage & inject CSS variables
  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      localStorage.setItem('paypulse_theme', config.theme);
    } catch (e) {
      console.warn('Failed to save design config', e);
    }

    const root = document.documentElement;
    const colors = config.colors;
    const radius = RADIUS_VALUES[config.borderRadius] || RADIUS_VALUES.md;

    // Set dataset attributes and classes for conditional Tailwind / CSS
    root.setAttribute('data-theme', config.theme);
    root.setAttribute('data-color-mode', config.colorMode);
    root.setAttribute('data-glow', config.glowIntensity);
    root.setAttribute('data-motion', config.motionSpeed);
    root.setAttribute('data-animation', config.animationIntensity);

    if (config.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }

    // Inject CSS variables
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-primary-muted', colors.primaryMuted);
    root.style.setProperty('--color-primary-glow', colors.primaryGlow);

    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-secondary-hover', colors.secondaryHover);
    root.style.setProperty('--color-secondary-muted', colors.secondaryMuted);

    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-accent-hover', colors.accentHover);
    root.style.setProperty('--color-accent-muted', colors.accentMuted);

    root.style.setProperty('--bg-primary', colors.bgPrimary);
    root.style.setProperty('--bg-surface', colors.bgSurface);
    root.style.setProperty('--bg-surface-elevated', colors.bgSurfaceElevated);
    root.style.setProperty('--bg-glass', colors.bgGlass);

    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-muted', colors.textMuted);
    root.style.setProperty('--text-dim', colors.textDim);

    root.style.setProperty('--border-color', colors.borderColor);
    root.style.setProperty('--border-subtle', colors.borderSubtle);
    root.style.setProperty('--border-strong', colors.borderStrong);

    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-success-muted', colors.successMuted);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-warning-muted', colors.warningMuted);
    root.style.setProperty('--color-error', colors.error);
    root.style.setProperty('--color-error-muted', colors.errorMuted);

    root.style.setProperty('--radius-sm', radius.sm);
    root.style.setProperty('--radius-md', radius.md);
    root.style.setProperty('--radius-lg', radius.lg);
    root.style.setProperty('--radius-xl', radius.xl);
    root.style.setProperty('--radius-2xl', radius['2xl']);

    // Dynamic glow box-shadow variable
    if (config.glowIntensity === 'off') {
      root.style.setProperty('--glow-box-shadow', 'none');
    } else if (config.glowIntensity === 'subtle') {
      root.style.setProperty('--glow-box-shadow', `0 0 15px ${colors.primaryMuted}`);
    } else {
      root.style.setProperty('--glow-box-shadow', `0 0 25px ${colors.primaryGlow}, 0 0 50px ${colors.primaryMuted}`);
    }

    // Dynamic animation speed factor
    const speedMultiplier = config.motionSpeed === 'calm' ? '1.5' : config.motionSpeed === 'dynamic' ? '0.7' : '1.0';
    root.style.setProperty('--motion-speed-factor', speedMultiplier);
  }, [config, isHydrated]);

  const setTheme = (theme: ThemeMode) => {
    try {
      localStorage.setItem('paypulse_theme', theme);
      window.dispatchEvent(new Event('paypulse-theme-change'));
    } catch {}

    setConfig((prev) => {
      const modeKey = 'professional';
      const palette = theme === 'light' ? COLOR_PALETTES[modeKey].light : COLOR_PALETTES[modeKey].dark;
      return {
        ...prev,
        theme,
        colors: palette,
      };
    });
  };

  const setColorMode = (mode: ColorMode) => {
    setConfig((prev) => {
      const themeKey = prev.theme === 'light' ? 'light' : 'dark';
      const palette = COLOR_PALETTES[mode][themeKey];
      return {
        ...prev,
        colorMode: mode,
        colors: palette,
      };
    });
  };

  const setAnimationIntensity = (animationIntensity: AnimationIntensity) => {
    setConfig((prev) => ({ ...prev, animationIntensity }));
  };

  const setThreeDIntensity = (threeDIntensity: ThreeDIntensity) => {
    setConfig((prev) => ({ ...prev, threeDIntensity }));
  };

  const setGlowIntensity = (glowIntensity: GlowIntensity) => {
    setConfig((prev) => ({ ...prev, glowIntensity }));
  };

  const setMotionSpeed = (motionSpeed: MotionSpeed) => {
    setConfig((prev) => ({ ...prev, motionSpeed }));
  };

  const setBorderRadius = (borderRadius: BorderRadiusSize) => {
    setConfig((prev) => ({ ...prev, borderRadius }));
  };

  const updateCustomColor = (key: keyof ColorPalette, value: string) => {
    setConfig((prev) => ({
      ...prev,
      colorMode: 'custom',
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_DESIGN_CONFIG);
  };

  const exportConfigJSON = () => {
    return JSON.stringify(config, null, 2);
  };

  return (
    <DesignContext.Provider
      value={{
        config,
        setTheme,
        setColorMode,
        setAnimationIntensity,
        setThreeDIntensity,
        setGlowIntensity,
        setMotionSpeed,
        setBorderRadius,
        updateCustomColor,
        resetConfig,
        exportConfigJSON,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};
