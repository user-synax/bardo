import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Theme } from '@/constants/theme';

export type HomeTab = 'notes' | 'lists';

type Props = {
  tab: HomeTab;
  theme: Theme;
  onTab: (t: HomeTab) => void;
  onPlus: () => void;
};

function BottomBarInner({ tab, theme, onTab, onPlus }: Props) {
  const pick = (t: HomeTab) => {
    if (tab !== t) {
      void Haptics.selectionAsync();
      onTab(t);
    }
  };

  return (
    <View style={[styles.bar, { backgroundColor: theme.backgroundSelected }]}>
      <Pressable onPress={() => pick('notes')} style={styles.item}>
        <View
          style={[
            styles.iconWrap,
            tab === 'notes' && { backgroundColor: theme.accentSoft },
          ]}>
          <MaterialIcons
            name="description"
            size={26}
            color={tab === 'notes' ? theme.accent : theme.textSecondary}
          />
        </View>
        <Text
          style={[
            styles.label,
            { color: tab === 'notes' ? theme.accent : theme.textSecondary },
          ]}>
          Notes
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPlus();
        }}
        style={[styles.fab, { backgroundColor: theme.fab }]}>
        <MaterialIcons name="add" size={40} color={theme.fabText} />
      </Pressable>

      <Pressable onPress={() => pick('lists')} style={styles.item}>
        <View
          style={[
            styles.iconWrap,
            tab === 'lists' && { backgroundColor: theme.accentSoft },
          ]}>
          <MaterialIcons
            name="checklist"
            size={26}
            color={tab === 'lists' ? theme.accent : theme.textSecondary}
          />
        </View>
        <Text
          style={[
            styles.label,
            { color: tab === 'lists' ? theme.accent : theme.textSecondary },
          ]}>
          Lists
        </Text>
      </Pressable>
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
