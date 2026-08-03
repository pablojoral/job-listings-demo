import { View } from 'react-native';

import { Icon } from 'components/ui/Icon/Icon';
import type { IconName } from 'components/ui/Icon/icons';
import { Text } from 'components/ui/Text/Text';
import type { FontColorToken } from 'theme/tokens';

import { useEmptyStateTheme } from './theme/useEmptyStateTheme';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  message: string;
  iconColor?: FontColorToken;
}

/** A centered icon + title + message block for empty, error, and not-found states. */
export const EmptyState = ({ icon, title, message, iconColor = 'font-secondary' }: EmptyStateProps) => {
  const { styles } = useEmptyStateTheme();

  return (
    <View style={styles.container}>
      <Icon name={icon} size="icon-size-xxl" color={iconColor} />
      <Text weight="font-weight-semibold">{title}</Text>
      <Text color="font-secondary" align="center">
        {message}
      </Text>
    </View>
  );
};
