/**
 * `Picker` requires `selectedValue` to match one of its items, so "nothing
 * selected" is modeled as a sentinel first item carrying this value — the
 * hook maps it back to `null` for the caller.
 */
export const PLACEHOLDER_VALUE = '';

interface UseDropdownParams {
  onChange: (value: string | null) => void;
}

export const useDropdown = ({ onChange }: UseDropdownParams) => {
  const handleValueChange = (value: string) => {
    onChange(value === PLACEHOLDER_VALUE ? null : value);
  };

  return { handleValueChange };
};
