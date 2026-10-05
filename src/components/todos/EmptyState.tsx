import { StyleSheet, Text, View } from 'react-native';

import type { Theme } from '@/constants/theme';

export function EmptyState({ theme, filter }: { theme: Theme; filter: string }) {
  const message =
    filter === 'done'
      ? 'Nothing completed yet. Tick something off.'
      : filter === 'active'
        ? 'All clear. Enjoy the calm.'
        : 'Your list is empty. Add your first task below.';

  return (
    <View style={styles.wrap}>
      <View style={[styles.ring, { borderColor: theme.border, backgroundColor: theme.backgroundSelected }]}>
        <View style={[styles.inner, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.glyph, { color: theme.accent }]}>✓</Text>
        </View>
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Calm and creamy</Text>
      <Text style={[styles.sub, { color: theme.textSecondary }]}>{message}</Text>
      <Text style={[styles.hint, { color: theme.textSecondary }]}>Swipe a task left to delete it.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 6,
    paddingHorizontal: 32,
  },
  ring: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  inner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#3D2C17',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  glyph: {
    fontSize: 32,
    fontWeight: '800',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  sub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
  },
});
