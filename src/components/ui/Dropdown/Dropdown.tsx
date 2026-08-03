import { memo } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { Icon } from 'components/ui/Icon/Icon';
import { Text } from 'components/ui/Text/Text';

import { useDropdown } from './hooks/useDropdown';
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
 * The app's single-select dropdown: a trigger styled like `TextInput` that
 * opens the options in a bottom sheet. Fully theme-driven — it replaced an
 * `@expo/ui` native picker whose Material anchor couldn't be styled to match
 * the app. The placeholder doubles as the "no selection" option: choosing it
 * reports `null` to `onChange`.
 *
 * Memoized: skips re-rendering the trigger and sheet when a parent re-renders
 * without touching the selection — e.g. a sibling search input echoing each
 * keystroke. Only holds if `options` and `onChange` are referentially stable.
 */
export const Dropdown = memo(({ options, selectedValue, onChange, placeholder, testID }: DropdownProps) => {
  const { isOpen, open, close, items, triggerLabel, isPlaceholder } = useDropdown({
    options,
    selectedValue,
    onChange,
    placeholder,
  });
  const { styles } = useDropdownTheme();

  return (
    <>
      <Pressable
        style={styles.trigger}
        onPress={open}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        testID={testID}
      >
        <View style={styles.triggerLabel}>
          <Text color={isPlaceholder ? 'font-secondary' : 'font-primary'} numberOfLines={1}>
            {triggerLabel}
          </Text>
        </View>
        <Icon name="chevron-down" size="icon-size-sm" color="font-secondary" />
      </Pressable>

      <Modal visible={isOpen} animationType="slide" transparent onRequestClose={close}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={close} testID={testID ? `${testID}-backdrop` : undefined} />
          <View style={styles.sheet}>
            <ScrollView>
              {items.map((item) => (
                <Pressable
                  key={item.key}
                  style={styles.option}
                  onPress={item.handlePress}
                  accessibilityRole="button"
                  accessibilityState={{ selected: item.selected }}
                >
                  <Text
                    color={item.selected ? 'font-brand' : 'font-primary'}
                    weight={item.selected ? 'font-weight-semibold' : 'font-weight-regular'}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
});

Dropdown.displayName = 'Dropdown';
