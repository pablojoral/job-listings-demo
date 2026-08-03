import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from 'components/ui/Icon/Icon';
import type { IconName } from 'components/ui/Icon/icons';
import { Text } from 'components/ui/Text/Text';

import { useIconButtonTheme } from './theme/useIconButtonTheme';

interface IconButtonProps {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  badgeCount?: number;
}

/**
 * An icon-only pressable with an optional count badge. The compact counterpart
 * to `Button` for actions that are conveyed by a glyph rather than a label.
 */
export const IconButton = ({ icon, onPress, accessibilityLabel, badgeCount = 0 }: IconButtonProps) => {
  const { styles } = useIconButtonTheme();

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Icon name={icon} size="icon-size-sm" />
      {badgeCount > 0 ? (
        <View style={styles.badge}>
          <Text color="font-on-brand" size="font-size-xxs" weight="font-weight-semibold">
            {badgeCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};
