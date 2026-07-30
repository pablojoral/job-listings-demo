import React from 'react';
import { View } from 'react-native';

import { Text } from 'components/Text/Text';

import { useTagTheme } from './theme/useTagTheme';

interface TagProps {
  label: string;
}

/** A small display-only pill for labels like a job's category or type. For a pressable variant, use `Chip`. */
export const Tag = ({ label }: TagProps) => {
  const { styles } = useTagTheme();

  return (
    <View style={styles.container}>
      <Text color="font-brand" size="font-size-xs" weight="font-weight-medium">
        {label}
      </Text>
    </View>
  );
};
