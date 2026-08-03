import { View } from 'react-native';

import { Icon } from 'components/ui/Icon/Icon';
import type { IconName } from 'components/ui/Icon/icons';
import { Text } from 'components/ui/Text/Text';

import { useIconLabelTheme } from './theme/useIconLabelTheme';

interface IconLabelProps {
  icon: IconName;
  label: string;
}

/** A small secondary icon + text row, for metadata lines like company or location. */
export const IconLabel = ({ icon, label }: IconLabelProps) => {
  const { styles } = useIconLabelTheme();

  return (
    <View style={styles.container}>
      <Icon name={icon} size="icon-size-xs" color="font-secondary" />
      <Text color="font-secondary" size="font-size-sm">
        {label}
      </Text>
    </View>
  );
};
