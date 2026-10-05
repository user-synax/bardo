import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, type Theme } from '@/constants/theme';
import type { TodoFilter } from '@/types/todo';

const TABS: { key: TodoFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'done', label: 'Done' },
];

type Props = {
  filter: TodoFilter;
  counts: { total: number; done: number; open: number };
  theme: Theme;
  onChange: (f: TodoFilter) => void;
};

function FilterTabsInner({ filter, counts, theme, onChange }: Props) {
  const countFor = (key: TodoFilter) =>
    key === 'all' ? counts.total : key === 'active' ? counts.open : counts.done;

  return (
    <View style={[styles.row, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
      {TABS.map((t) => {
        const active = filter === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => {
              if (filter !== t.key) {
                void Haptics.selectionAsync();
                onChange(t.key);
              }
            }}
            style={[
              styles.tab,
              active && { backgroundColor: theme.backgroundElement, ...styles.activeShadow },
            ]}>
            <Text style={[styles.label, { color: active ? theme.text : theme.textSecondary }]}>
              {t.label}
            </Text>
            <Text style={[styles.count, { color: active ? theme.accent : theme.textSecondary }]}>
              {countFor(t.key)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const FilterTabs = memo(FilterTabsInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: Radius.pill,
    borderWidth: 1,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: Radius.pill,
  },
  activeShadow: {
    elevation: 2,
    shadowColor: '#3D2C17',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  count: {
    fontSize: 12,
    fontWeight: '800',
  },
});
