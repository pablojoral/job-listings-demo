import { memo } from 'react';

import { Host, Picker } from '@expo/ui';

import { PLACEHOLDER_VALUE, useDropdown } from './hooks/useDropdown';
import { useDropdownTheme } from './theme/useDropdownTheme';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  testID?: string;
}

/**
 * The app's single-select dropdown, backed by the native picker from
 * `@expo/ui` (`menu` appearance — a compact button opening a native popup).
 * The placeholder doubles as the "no selection" option: choosing it reports
 * `null` to `onChange`.
 *
 * Memoized: rebuilding the native `Host`/`Picker` subtree (one item per
 * option) is disproportionately expensive for a re-render where nothing
 * changed — e.g. a sibling search input echoing each keystroke. Only holds if
 * `options` and `onChange` are referentially stable.
 */
export const Dropdown = memo(({ options, selectedValue, onChange, placeholder, testID }: DropdownProps) => {
  const { handleValueChange } = useDropdown({ onChange });
  const { theme } = useDropdownTheme();

  return (
    <Host matchContents colorScheme={theme.isDark ? 'dark' : 'light'}>
      <Picker selectedValue={selectedValue ?? PLACEHOLDER_VALUE} onValueChange={handleValueChange} testID={testID}>
        <Picker.Item label={placeholder} value={PLACEHOLDER_VALUE} />
        {options.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </Host>
  );
});

Dropdown.displayName = 'Dropdown';
