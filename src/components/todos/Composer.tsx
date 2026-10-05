import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Radius, type Theme } from '@/constants/theme';

type Props = {
  theme: Theme;
  onAdd: (title: string) => void;
};

export function Composer({ theme, onAdd }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    const title = value.trim();
    if (!title) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAdd(title);
    setValue('');
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}>
      <TextInput
        value={value}
        onChangeText={setValue}
        onSubmitEditing={submit}
        returnKeyType="done"
        placeholder="Add a task…"
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text }]}
        maxLength={200}
      />
      <Pressable
        onPress={submit}
        disabled={!value.trim()}
        style={({ pressed }) => [
          styles.add,
          {
            backgroundColor: value.trim() ? theme.primary : theme.backgroundSelected,
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}>
        <Text
          style={[
            styles.addText,
            { color: value.trim() ? theme.primaryText : theme.textSecondary },
          ]}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    paddingLeft: 16,
    borderRadius: Radius.large,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#3D2C17',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  add: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 26,
    fontWeight: '400',
    marginTop: -3,
  },
});
