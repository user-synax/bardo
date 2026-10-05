/**
 * App theme, resolved through Settings (system / cream / cocoa override).
 */

import { useSettingsStore } from '@/store/settings-context';

export function useTheme() {
  return useSettingsStore().theme;
}

export function useResolvedScheme() {
  return useSettingsStore().mode;
}
