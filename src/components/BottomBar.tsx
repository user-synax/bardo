import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Theme } from '@/constants/theme';

type Props = {
  theme: Theme;
  onPlus: () => void;
};

function BottomBarInner({ theme, onPlus }: Props) {
  return (
    <View style={[styles.bar, { backgroundColor: theme.backgroundSelected }]}>
      <View style={styles.item}>
        <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
          <MaterialIcons name="description" size={26} color={theme.accent} />
        </View>
        <Text style={[styles.label, { color: theme.accent }]}>Notes</Text>
      </View>

      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPlus();
        }}
        style={[styles.fab, { backgroundColor: theme.fab }]}>
        <MaterialIcons name="add" size={40} color={theme.fabText} />
      </Pressable>

      {/* Spacer keeps the FAB optically centered like the 3-slot bar. */}
      <View style={styles.spacer} />
    </View>
  );
}

export const BottomBar = memo(BottomBarInner);

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    elevation: 6,
    shadowColor: '#3D2C17',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  item: {
    alignItems: 'center',
    gap: 2,
    minWidth: 72,
  },
  iconWrap: {
    width: 56,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  spacer: {
    minWidth: 72,
  },
  fab: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -44,
    elevation: 8,
    shadowColor: '#3D2C17',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
});
