import React from 'react';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import { Text } from 'components/ui/Text/Text';
import { ActivityIndicator } from 'components/ui/ActivityIndicator/ActivityIndicator';
import { Icon } from 'components/ui/Icon/Icon';
import type { IconName } from 'components/ui/Icon/icons';

import { useButtonTheme, type ButtonVariant } from './theme/useButtonTheme';

interface ButtonProps extends Omit<TouchableOpacityProps, 'disabled' | 'style'> {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: IconName;
}

/**
 * The app's labelled action. Always use this instead of a bare
 * `TouchableOpacity` for anything with a label.
 */
export const Button = ({
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  onPress,
  ...rest
}: ButtonProps) => {
  const { containerStyle, labelColor } = useButtonTheme(variant, disabled || loading, fullWidth);

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <>
          {icon ? <Icon name={icon} size="icon-size-sm" color={labelColor} testID="button-icon" /> : null}
          <Text color={labelColor} weight="font-weight-semibold">
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
