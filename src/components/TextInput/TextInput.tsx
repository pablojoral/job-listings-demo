import React from 'react';
import { Pressable, TextInput as RNTextInput, View } from 'react-native';

import { Icon } from 'components/Icon/Icon';
import type { IconName } from 'components/Icon/icons';

import { useTextInputTheme } from './theme/useTextInputTheme';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: IconName;
  onClear?: () => void;
  clearLabel?: string;
}

/**
 * The app's Text input primitive. Always use this instead of `TextInput` from
 * `react-native`. `icon` renders a leading glyph; `onClear` renders a trailing
 * clear button (only while `value` is non-empty).
 */
export const TextInput = ({ value, onChangeText, placeholder, icon, onClear, clearLabel }: TextInputProps) => {
  const { styles, theme } = useTextInputTheme();

  return (
    <View style={styles.container}>
      {icon ? <Icon name={icon} size="icon-size-sm" color="font-secondary" /> : null}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.fontColor['font-secondary']}
        style={styles.input}
        accessibilityLabel={placeholder}
        autoCorrect={false}
      />
      {onClear && value ? (
        <Pressable onPress={onClear} accessibilityRole="button" accessibilityLabel={clearLabel}>
          <Icon name="close" size="icon-size-sm" color="font-secondary" />
        </Pressable>
      ) : null}
    </View>
  );
};
