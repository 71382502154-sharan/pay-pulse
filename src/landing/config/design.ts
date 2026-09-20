export type ThemeMode = 'dark' | 'light' | 'custom';
export type ColorMode = 'fintech' | 'professional' | 'corporate' | 'monochrome' | 'custom';
export type AnimationIntensity = 'minimal' | 'balanced' | 'cinematic' | 'extreme';
export type ThreeDIntensity = 'none' | 'subtle' | 'medium' | 'heavy';
export type GlowIntensity = 'off' | 'subtle' | 'strong';
export type MotionSpeed = 'calm' | 'smooth' | 'dynamic';
export type BorderRadiusSize = 'sm' | 'md' | 'lg' | 'full';

export interface ColorPalette {
  primary: string;
  primaryHover: string;
  primaryMuted: string;
  primaryGlow: string;
  secondary: string;
  secondaryHover: string;
  secondaryMuted: string;
  accent: string;
  accentHover: string;
  accentMuted: string;
  bgPrimary: string;
  bgSurface: string;
  bgSurfaceElevated: string;
  bgGlass: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDim: string;
  borderColor: string;
  borderSubtle: string;
  borderStrong: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  error: string;
  errorMuted: string;
}

export interface DesignConfig {
  theme: ThemeMode;
  colorMode: ColorMode;
  animationIntensity: AnimationIntensity;
  threeDIntensity: ThreeDIntensity;
  glowIntensity: GlowIntensity;
  motionSpeed: MotionSpeed;
  borderRadius: BorderRadiusSize;
  colors: ColorPalette;
}

export const COLOR_PALETTES: Record<ColorMode, { dark: ColorPalette; light: ColorPalette }> = {
  fintech: {
    dark: {
      primary: '#71f8e4', // web app tertiary-fixed luminous teal
      primaryHover: '#4fdbc8',
      primaryMuted: 'rgba(0, 106, 99, 0.25)',
      primaryGlow: 'rgba(113, 248, 228, 0.35)',
      secondary: '#808dc2', // web app on-primary-container lavender navy
      secondaryHover: '#9ba7d8',
      secondaryMuted: 'rgba(128, 141, 194, 0.15)',
      accent: '#006a63', // web app secondary fiduciary teal
      accentHover: '#007a72',
      accentMuted: 'rgba(0, 106, 99, 0.2)',
      bgPrimary: '#0b0f19', // web app dark body background
      bgSurface: '#111827', // web app dark card surface
      bgSurfaceElevated: '#1e293b', // web app dark elevated surface
      bgGlass: 'rgba(17, 24, 39, 0.85)',
      textPrimary: '#f8fafc', // web app dark text
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textDim: '#64748b',
      borderColor: '#1e293b', // web app dark border
      borderSubtle: '#1e293b',
      borderStrong: '#2e3d5a',
      success: '#5eead4',
      successMuted: 'rgba(0, 106, 99, 0.25)',
      warning: '#f59e0b',
      warningMuted: 'rgba(245, 158, 11, 0.15)',
      error: '#fca5a5',
      errorMuted: 'rgba(186, 26, 26, 0.25)',
    },
    light: {
      primary: '#007a72', // web app primary action teal
      primaryHover: '#006059',
      primaryMuted: 'rgba(0, 122, 114, 0.12)',
      primaryGlow: 'rgba(0, 122, 114, 0.3)',
      secondary: '#001c6e', // web app primary deep corporate navy
      secondaryHover: '#172554',
      secondaryMuted: 'rgba(0, 28, 110, 0.12)',
      accent: '#020617', // web app primary container
      accentHover: '#0f172a',
      accentMuted: 'rgba(2, 6, 23, 0.1)',
      bgPrimary: '#faf8ff', // web app light body background
      bgSurface: '#ffffff', // web app white card surface
      bgSurfaceElevated: '#f2f3ff', // web app container-low
      bgGlass: 'rgba(255, 255, 255, 0.96)',
      textPrimary: '#020617', // deepest dark ink
      textSecondary: '#0f172a', // dark charcoal slate-900
      textMuted: '#1e293b', // dark slate-800
      textDim: '#334155', // dark slate-700
      borderColor: '#eaedff', // web app container border
      borderSubtle: '#f2f3ff',
      borderStrong: '#64748b', // web app outline-variant
      success: '#007a72',
      successMuted: 'rgba(0, 122, 114, 0.12)',
      warning: '#d97706',
      warningMuted: 'rgba(217, 119, 6, 0.1)',
      error: '#ba1a1a', // web app error
      errorMuted: 'rgba(186, 26, 26, 0.1)',
    },
  },
  professional: {
    dark: {
      primary: '#71f8e4', // web app tertiary-fixed luminous teal
      primaryHover: '#4fdbc8',
      primaryMuted: 'rgba(0, 106, 99, 0.25)',
      primaryGlow: 'rgba(113, 248, 228, 0.35)',
      secondary: '#808dc2', // web app on-primary-container lavender navy
      secondaryHover: '#9ba7d8',
      secondaryMuted: 'rgba(128, 141, 194, 0.15)',
      accent: '#006a63', // web app secondary fiduciary teal
      accentHover: '#007a72',
      accentMuted: 'rgba(0, 106, 99, 0.2)',
      bgPrimary: '#0b0f19', // web app dark body background
      bgSurface: '#111827', // web app dark card surface
      bgSurfaceElevated: '#1e293b', // web app dark elevated surface
      bgGlass: 'rgba(17, 24, 39, 0.85)',
      textPrimary: '#f8fafc', // web app dark text
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textDim: '#64748b',
      borderColor: '#1e293b', // web app dark border
      borderSubtle: '#1e293b',
      borderStrong: '#2e3d5a',
      success: '#5eead4',
      successMuted: 'rgba(0, 106, 99, 0.25)',
      warning: '#f59e0b',
      warningMuted: 'rgba(245, 158, 11, 0.15)',
      error: '#fca5a5',
      errorMuted: 'rgba(186, 26, 26, 0.25)',
    },
    light: {
      primary: '#007a72', // web app primary action teal
      primaryHover: '#006059',
      primaryMuted: 'rgba(0, 122, 114, 0.12)',
      primaryGlow: 'rgba(0, 122, 114, 0.3)',
      secondary: '#001c6e', // web app primary deep corporate navy
      secondaryHover: '#172554',
      secondaryMuted: 'rgba(0, 28, 110, 0.12)',
      accent: '#020617', // web app primary container
      accentHover: '#0f172a',
      accentMuted: 'rgba(2, 6, 23, 0.1)',
      bgPrimary: '#faf8ff', // web app light body background
      bgSurface: '#ffffff', // web app white card surface
      bgSurfaceElevated: '#f2f3ff', // web app container-low
      bgGlass: 'rgba(255, 255, 255, 0.96)',
      textPrimary: '#020617', // deepest dark ink
      textSecondary: '#0f172a', // dark charcoal slate-900
      textMuted: '#1e293b', // dark slate-800
      textDim: '#334155', // dark slate-700
      borderColor: '#eaedff', // web app container border
      borderSubtle: '#f2f3ff',
      borderStrong: '#64748b', // web app outline-variant
      success: '#007a72',
      successMuted: 'rgba(0, 122, 114, 0.12)',
      warning: '#d97706',
      warningMuted: 'rgba(217, 119, 6, 0.1)',
      error: '#ba1a1a', // web app error
      errorMuted: 'rgba(186, 26, 26, 0.1)',
    },
  },
  corporate: {
    dark: {
      primary: '#71f8e4',
      primaryHover: '#4fdbc8',
      primaryMuted: 'rgba(0, 106, 99, 0.25)',
      primaryGlow: 'rgba(113, 248, 228, 0.35)',
      secondary: '#808dc2',
      secondaryHover: '#9ba7d8',
      secondaryMuted: 'rgba(128, 141, 194, 0.15)',
      accent: '#006a63',
      accentHover: '#007a72',
      accentMuted: 'rgba(0, 106, 99, 0.2)',
      bgPrimary: '#0b0f19',
      bgSurface: '#111827',
      bgSurfaceElevated: '#1e293b',
      bgGlass: 'rgba(17, 24, 39, 0.85)',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textDim: '#64748b',
      borderColor: '#1e293b',
      borderSubtle: '#1e293b',
      borderStrong: '#2e3d5a',
      success: '#5eead4',
      successMuted: 'rgba(0, 106, 99, 0.25)',
      warning: '#f59e0b',
      warningMuted: 'rgba(245, 158, 11, 0.15)',
      error: '#fca5a5',
      errorMuted: 'rgba(186, 26, 26, 0.25)',
    },
    light: {
      primary: '#007a72',
      primaryHover: '#006059',
      primaryMuted: 'rgba(0, 122, 114, 0.12)',
      primaryGlow: 'rgba(0, 122, 114, 0.3)',
      secondary: '#001c6e',
      secondaryHover: '#172554',
      secondaryMuted: 'rgba(0, 28, 110, 0.12)',
      accent: '#020617',
      accentHover: '#0f172a',
      accentMuted: 'rgba(2, 6, 23, 0.1)',
      bgPrimary: '#faf8ff',
      bgSurface: '#ffffff',
      bgSurfaceElevated: '#f2f3ff',
      bgGlass: 'rgba(255, 255, 255, 0.96)',
      textPrimary: '#020617',
      textSecondary: '#0f172a',
      textMuted: '#1e293b',
      textDim: '#334155',
      borderColor: '#eaedff',
      borderSubtle: '#f2f3ff',
      borderStrong: '#64748b',
      success: '#007a72',
      successMuted: 'rgba(0, 122, 114, 0.12)',
      warning: '#d97706',
      warningMuted: 'rgba(217, 119, 6, 0.1)',
      error: '#ba1a1a',
      errorMuted: 'rgba(186, 26, 26, 0.1)',
    },
  },
  monochrome: {
    dark: {
      primary: '#71f8e4',
      primaryHover: '#4fdbc8',
      primaryMuted: 'rgba(0, 106, 99, 0.25)',
      primaryGlow: 'rgba(113, 248, 228, 0.35)',
      secondary: '#808dc2',
      secondaryHover: '#cbd5e1',
      secondaryMuted: 'rgba(128, 141, 194, 0.15)',
      accent: '#006a63',
      accentHover: '#007a72',
      accentMuted: 'rgba(0, 106, 99, 0.2)',
      bgPrimary: '#0b0f19',
      bgSurface: '#111827',
      bgSurfaceElevated: '#1e293b',
      bgGlass: 'rgba(17, 24, 39, 0.85)',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textDim: '#64748b',
      borderColor: '#1e293b',
      borderSubtle: '#1e293b',
      borderStrong: '#2e3d5a',
      success: '#5eead4',
      successMuted: 'rgba(0, 106, 99, 0.25)',
      warning: '#f59e0b',
      warningMuted: 'rgba(245, 158, 11, 0.15)',
      error: '#fca5a5',
      errorMuted: 'rgba(186, 26, 26, 0.25)',
    },
    light: {
      primary: '#007a72',
      primaryHover: '#006059',
      primaryMuted: 'rgba(0, 122, 114, 0.12)',
      primaryGlow: 'rgba(0, 122, 114, 0.3)',
      secondary: '#001c6e',
      secondaryHover: '#172554',
      secondaryMuted: 'rgba(0, 28, 110, 0.12)',
      accent: '#020617',
      accentHover: '#0f172a',
      accentMuted: 'rgba(2, 6, 23, 0.1)',
      bgPrimary: '#faf8ff',
      bgSurface: '#ffffff',
      bgSurfaceElevated: '#f2f3ff',
      bgGlass: 'rgba(255, 255, 255, 0.96)',
      textPrimary: '#020617',
      textSecondary: '#0f172a',
      textMuted: '#1e293b',
      textDim: '#334155',
      borderColor: '#eaedff',
      borderSubtle: '#f2f3ff',
      borderStrong: '#64748b',
      success: '#007a72',
      successMuted: 'rgba(0, 122, 114, 0.12)',
      warning: '#d97706',
      warningMuted: 'rgba(217, 119, 6, 0.1)',
      error: '#ba1a1a',
      errorMuted: 'rgba(186, 26, 26, 0.1)',
    },
  },
  custom: {
    dark: {
      primary: '#71f8e4',
      primaryHover: '#4fdbc8',
      primaryMuted: 'rgba(0, 106, 99, 0.25)',
      primaryGlow: 'rgba(113, 248, 228, 0.35)',
      secondary: '#808dc2',
      secondaryHover: '#9ba7d8',
      secondaryMuted: 'rgba(128, 141, 194, 0.15)',
      accent: '#006a63',
      accentHover: '#007a72',
      accentMuted: 'rgba(0, 106, 99, 0.2)',
      bgPrimary: '#0b0f19',
      bgSurface: '#111827',
      bgSurfaceElevated: '#1e293b',
      bgGlass: 'rgba(17, 24, 39, 0.85)',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      textDim: '#64748b',
      borderColor: '#1e293b',
      borderSubtle: '#1e293b',
      borderStrong: '#2e3d5a',
      success: '#5eead4',
      successMuted: 'rgba(0, 106, 99, 0.25)',
      warning: '#f59e0b',
      warningMuted: 'rgba(245, 158, 11, 0.15)',
      error: '#fca5a5',
      errorMuted: 'rgba(186, 26, 26, 0.25)',
    },
    light: {
      primary: '#007a72',
      primaryHover: '#006059',
      primaryMuted: 'rgba(0, 122, 114, 0.12)',
      primaryGlow: 'rgba(0, 122, 114, 0.3)',
      secondary: '#001c6e',
      secondaryHover: '#172554',
      secondaryMuted: 'rgba(0, 28, 110, 0.12)',
      accent: '#020617',
      accentHover: '#0f172a',
      accentMuted: 'rgba(2, 6, 23, 0.1)',
      bgPrimary: '#faf8ff',
      bgSurface: '#ffffff',
      bgSurfaceElevated: '#f2f3ff',
      bgGlass: 'rgba(255, 255, 255, 0.96)',
      textPrimary: '#020617',
      textSecondary: '#0f172a',
      textMuted: '#1e293b',
      textDim: '#334155',
      borderColor: '#eaedff',
      borderSubtle: '#f2f3ff',
      borderStrong: '#64748b',
      success: '#007a72',
      successMuted: 'rgba(0, 122, 114, 0.12)',
      warning: '#d97706',
      warningMuted: 'rgba(217, 119, 6, 0.1)',
      error: '#ba1a1a',
      errorMuted: 'rgba(186, 26, 26, 0.1)',
    },
  },
};

export const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  theme: 'light',
  colorMode: 'professional',
  animationIntensity: 'balanced',
  threeDIntensity: 'medium',
  glowIntensity: 'subtle',
  motionSpeed: 'smooth',
  borderRadius: 'md',
  colors: COLOR_PALETTES.professional.light,
};

export const RADIUS_VALUES: Record<BorderRadiusSize, { sm: string; md: string; lg: string; xl: string; '2xl': string }> = {
  sm: { sm: '2px', md: '4px', lg: '6px', xl: '8px', '2xl': '12px' },
  md: { sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px' },
  lg: { sm: '8px', md: '12px', lg: '18px', xl: '24px', '2xl': '32px' },
  full: { sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px' },
};
