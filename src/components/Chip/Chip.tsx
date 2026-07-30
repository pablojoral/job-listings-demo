import React from 'react';
import { Pressable } from 'react-native';

import { Text } from 'components/Text/Text';

import { useChipTheme } from './theme/useChipTheme';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** A small selectable tag — the compact counterpart to `Button` for toggleable options. */
export const Chip = ({ label, selected, onPress }: ChipProps) => {
  const { containerStyle, labelColor } = useChipTheme(selected);

  return (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text color={labelColor} size="font-size-sm" weight="font-weight-medium">
        {label}
      </Text>
    </Pressable>
  );
};
