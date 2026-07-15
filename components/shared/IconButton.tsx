import { Colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type IconButtonVariant = 'primary' | 'dark' | 'light';

interface IconButtonProps {
  icon?: any;
  iconBlack?: any;
  iconComponent?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  variant?: IconButtonVariant;
  size?: number;
  disabled?: boolean;
}

const variantStyles = {
  primary: {
    backgroundColor: Colors.orange[400],
    iconColor: Colors.white,
  },
  dark: {
    backgroundColor: Colors.grey[700],
    iconColor: Colors.white,
  },
  light: {
    backgroundColor: Colors.white,
    iconColor: Colors.grey[900],
  },
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  iconBlack,
  iconComponent,
  onPress,
  variant = 'primary',
  size = 40,
  disabled = false,
  accessibilityLabel,
}) => {
  const { backgroundColor, iconColor } = variantStyles[variant];
  const iconSource = variant === 'light' && iconBlack ? iconBlack : icon;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: disabled ? Colors.grey[200] : backgroundColor,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {iconComponent ? (
        iconComponent
      ) : (
        <MaterialIcons
          name="arrow-outward"
          size={size * 0.4}
          color={iconColor}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    resizeMode: 'contain',
  },
});
