import { View } from 'react-native';

import { Button } from 'components/ui/Button/Button';
import { Dropdown } from 'components/ui/Dropdown/Dropdown';
import { MultiSelect } from 'components/ui/MultiSelect/MultiSelect';
import { Text } from 'components/ui/Text/Text';
import { TextInput } from 'components/ui/TextInput/TextInput';

import { useJobFilters } from './hooks/useJobFilters';
import { useJobFiltersTheme } from './theme/useJobFiltersTheme';

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
  const { styles } = useJobFiltersTheme();

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={onChangeSearch}
        placeholder="Search by title or company"
        icon="search"
        onClear={onClearSearch}
        clearLabel="Clear search"
      />
      <View style={styles.section}>
        <Text color="font-secondary" size="font-size-sm" weight="font-weight-semibold">
          Category
        </Text>
        <Dropdown
          options={categoryOptions}
          selectedValue={selectedCategory}
          onChange={onChangeCategory}
          placeholder="All categories"
          testID="category-dropdown"
        />
      </View>
      <View style={styles.section}>
        <Text color="font-secondary" size="font-size-sm" weight="font-weight-semibold">
          Job type
        </Text>
        <MultiSelect options={jobTypeOptions} selectedValues={selectedJobTypes} onChange={onChangeJobTypes} />
      </View>
      <Button label="Clear filters" fullWidth variant="ghost" onPress={onReset} disabled={!hasActiveFilters} />
    </View>
  );
};
