import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from 'components/ui/Icon/Icon';
import type { IconName } from 'components/ui/Icon/icons';
import { Text } from 'components/ui/Text/Text';
import type { FontColorToken } from 'theme/tokens';

import { useIconButtonTheme, type IconButtonVariant } from './theme/useIconButtonTheme';

interface IconButtonProps {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  color?: FontColorToken;
  filled?: boolean;
  badgeCount?: number;
  testID?: string;
}

/**
 * An icon-only pressable with an optional count badge. The compact counterpart
 * to `Button` for actions that are conveyed by a glyph rather than a label.
 */
export const IconButton = ({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'outlined',
  color,
  filled = false,
  badgeCount = 0,
  testID,
}: IconButtonProps) => {
  const { containerStyle, styles } = useIconButtonTheme(variant);

  return (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <Icon name={icon} size="icon-size-sm" color={color} filled={filled} />
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
