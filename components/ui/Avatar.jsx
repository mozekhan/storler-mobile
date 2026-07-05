import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const Avatar = ({
  firstName,
  lastName,
  imageUrl,
  size = 'md',
  variant = 'circle',
  style,
  textStyle,
  ...props
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { width: 32, height: 32, fontSize: Typography.sm };
      case 'md': return { width: 48, height: 48, fontSize: Typography.lg };
      case 'lg': return { width: 64, height: 64, fontSize: Typography['2xl'] };
      case 'xl': return { width: 96, height: 96, fontSize: Typography['4xl'] };
      default: return { width: 48, height: 48, fontSize: Typography.lg };
    }
  };

  const sizeStyles = getSizeStyles();
  const borderRadius = variant === 'circle' ? BorderRadius.full : BorderRadius.lg;

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          { width: sizeStyles.width, height: sizeStyles.height, borderRadius },
          style
        ]}
        {...props}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: sizeStyles.width,
          height: sizeStyles.height,
          borderRadius,
          backgroundColor: Colors.primary + '15',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style
      ]}
      {...props}
    >
      <Text
        style={[
          {
            fontSize: sizeStyles.fontSize,
            fontWeight: '600',
            color: Colors.primary,
          },
          textStyle
        ]}
      >
        {initials || '?'}
      </Text>
    </View>
  );
};

export default Avatar;