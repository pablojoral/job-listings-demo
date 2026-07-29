import React from 'react';
import { View } from 'react-native';

import { Icon } from 'components/Icon/Icon';
import { Text } from 'components/Text/Text';

import { useJobsErrorStateTheme } from './theme/useJobsErrorStateTheme';

interface JobsErrorStateProps {
  title: string;
  message: string;
}

export const JobsErrorState = ({ title, message }: JobsErrorStateProps) => {
  const { styles } = useJobsErrorStateTheme();

  return (
    <View style={styles.container}>
      <Icon name="close" size="icon-size-xxl" color="font-danger" />
      <Text weight="font-weight-semibold">{title}</Text>
      <Text color="font-secondary" align="center">
        {message}
      </Text>
    </View>
  );
};
