import type { MultiSelectOption } from '../MultiSelect';

interface UseMultiSelectParams {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export const useMultiSelect = ({ options, selectedValues, onChange }: UseMultiSelectParams) => {
  const handleToggle = (value: string) => {
    const next = selectedValues.includes(value)
      ? selectedValues.filter((selected) => selected !== value)
      : [...selectedValues, value];
    onChange(next);
  };

  const items = options.map((option) => ({
    value: option.value,
    label: option.label,
    selected: selectedValues.includes(option.value),
    handlePress: () => handleToggle(option.value),
  }));

  return { items };
};
