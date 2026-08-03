import { useState } from 'react';

import type { DropdownOption } from '../Dropdown';

interface UseDropdownParams {
  options: DropdownOption[];
  selectedValue: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
}

export const useDropdown = ({ options, selectedValue, onChange, placeholder }: UseDropdownParams) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleSelect = (value: string | null) => {
    setIsOpen(false);
    onChange(value);
  };

  // The placeholder doubles as the "no selection" option: picking it reports
  // `null` to `onChange`, mirroring how the trigger shows it while nothing is
  // selected.
  const items = [
    {
      key: '__placeholder__',
      label: placeholder,
      selected: selectedValue === null,
      handlePress: () => handleSelect(null),
    },
    ...options.map((option) => ({
      key: option.value,
      label: option.label,
      selected: option.value === selectedValue,
      handlePress: () => handleSelect(option.value),
    })),
  ];

  const selectedOption = options.find((option) => option.value === selectedValue);

  return {
    isOpen,
    open,
    close,
    items,
    triggerLabel: selectedOption?.label ?? placeholder,
    isPlaceholder: !selectedOption,
  };
};
