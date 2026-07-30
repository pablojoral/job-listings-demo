import React from 'react';
import { View } from 'react-native';

import { IconButton } from 'components/IconButton/IconButton';
import { Text } from 'components/Text/Text';

import { useJobListHeaderTheme } from './theme/useJobListHeaderTheme';

interface JobListHeaderProps {
  title: string;
  filtersLabel: string;
  activeFiltersCount: number;
  onOpenFilters: () => void;
}

export const JobListHeader = ({ title, filtersLabel, activeFiltersCount, onOpenFilters }: JobListHeaderProps) => {
  const { styles } = useJobListHeaderTheme();

  return (
    <View style={styles.container}>
      <Text size="font-size-xxl" weight="font-weight-bold">
        {title}
      </Text>
      <IconButton icon="filter" accessibilityLabel={filtersLabel} onPress={onOpenFilters} badgeCount={activeFiltersCount} />
    </View>
  );
};
