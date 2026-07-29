import React from 'react';
import { View } from 'react-native';

import { Icon } from 'components/Icon/Icon';
import { Text } from 'components/Text/Text';

import { useJobsEmptyStateTheme } from './theme/useJobsEmptyStateTheme';

interface JobsEmptyStateProps {
  title: string;
  message: string;
}

export const JobsEmptyState = ({ title, message }: JobsEmptyStateProps) => {
  const { styles } = useJobsEmptyStateTheme();

  return (
    <View style={styles.container}>
      <Icon name="search" size="icon-size-xxl" color="font-secondary" />
      <Text weight="font-weight-semibold">{title}</Text>
      <Text color="font-secondary" align="center">
        {message}
      </Text>
    </View>
  );
};
