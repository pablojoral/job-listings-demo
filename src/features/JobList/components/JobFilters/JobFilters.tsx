/** @format */

import { View } from "react-native";

import { Button } from "components/Button/Button";
import { Dropdown } from "components/Dropdown/Dropdown";
import { MultiSelect } from "components/MultiSelect/MultiSelect";
import { Text } from "components/Text/Text";
import { TextInput } from "components/TextInput/TextInput";

import { useJobFilters } from "./hooks/useJobFilters";
import { useJobFiltersStrings } from "./hooks/useJobFiltersStrings";
import { useJobFiltersTheme } from "./theme/useJobFiltersTheme";

export const JobFilters = () => {
  const {
    search,
    onChangeSearch,
    onClearSearch,
    categoryOptions,
    selectedCategory,
    onChangeCategory,
    jobTypeOptions,
    selectedJobTypes,
    onChangeJobTypes,
    hasActiveFilters,
    onReset,
  } = useJobFilters();
  const strings = useJobFiltersStrings();
  const { styles } = useJobFiltersTheme();

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={onChangeSearch}
        placeholder={strings.searchPlaceholder}
        icon="search"
        onClear={onClearSearch}
        clearLabel={strings.searchClearLabel}
      />
      <View style={styles.section}>
        <Text
          color="font-secondary"
          size="font-size-sm"
          weight="font-weight-semibold"
        >
          {strings.categoryLabel}
        </Text>
        <Dropdown
          options={categoryOptions}
          selectedValue={selectedCategory}
          onChange={onChangeCategory}
          placeholder={strings.categoryPlaceholder}
          testID="category-dropdown"
        />
      </View>
      <View style={styles.section}>
        <Text
          color="font-secondary"
          size="font-size-sm"
          weight="font-weight-semibold"
        >
          {strings.jobTypeLabel}
        </Text>
        <MultiSelect
          options={jobTypeOptions}
          selectedValues={selectedJobTypes}
          onChange={onChangeJobTypes}
        />
      </View>
      <Button
        label={strings.clearLabel}
        fullWidth
        variant="ghost"
        onPress={onReset}
        disabled={!hasActiveFilters}
      />
    </View>
  );
};
