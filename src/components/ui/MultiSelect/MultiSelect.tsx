import React, { memo } from 'react';
import { View } from 'react-native';

import { Chip } from 'components/ui/Chip/Chip';

import { useMultiSelect } from './hooks/useMultiSelect';
import { useMultiSelectTheme } from './theme/useMultiSelectTheme';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

/**
 * The app's multi-select. Renders each option as an independently toggleable
 * tag chip.
 *
 * Memoized: skips re-rendering the whole chip row when a parent re-renders
 * without touching the selection — e.g. a sibling search input echoing each
 * keystroke. Only holds if `options` and `onChange` are referentially stable.
 */
export const MultiSelect = memo(({ options, selectedValues, onChange }: MultiSelectProps) => {
  const { items } = useMultiSelect({ options, selectedValues, onChange });
  const { styles } = useMultiSelectTheme();

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <Chip key={item.value} label={item.label} selected={item.selected} onPress={item.handlePress} />
      ))}
    </View>
  );
});

MultiSelect.displayName = 'MultiSelect';
