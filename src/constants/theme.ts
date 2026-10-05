/**
 * Cream + dark cocoa theme tokens.
 * Android-first: warm, high-contrast, fast to parse.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2B2118',
    background: '#F7F1E6',
    backgroundElement: '#FFFDF7',
    backgroundSelected: '#EFE2CC',
    textSecondary: '#8C7B66',
    border: '#E7D8BE',
    primary: '#2B2118',
    primaryText: '#FFF8EC',
    accent: '#C97E2C',
    accentSoft: '#F3E2C2',
    danger: '#C14A3A',
    dangerSoft: '#F7DDD6',
    success: '#5F7A5A',
  },
  dark: {
    text: '#F5EBDD',
    background: '#161009',
    backgroundElement: '#221A12',
    backgroundSelected: '#33271B',
    textSecondary: '#A89885',
    border: '#3A2E22',
    primary: '#F5EBDD',
    primaryText: '#221A12',
    accent: '#E0A458',
    accentSoft: '#3A2C1C',
    danger: '#E07864',
    dangerSoft: '#3E211B',
    success: '#9DB89A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type Theme = (typeof Colors)[keyof typeof Colors];

export const PriorityColors: Record<'low' | 'medium' | 'high', { light: string; dark: string }> = {
  low: { light: '#6B8E6B', dark: '#9DB89A' },
  medium: { light: '#C98A1B', dark: '#E0A458' },
  high: { light: '#C14A3A', dark: '#E07864' },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 10,
  medium: 16,
  large: 22,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
