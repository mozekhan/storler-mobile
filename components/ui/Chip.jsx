import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const Chip = ({
  children,
  variant = 'default',
  size = 'md',
  selected = false,
  onPress,
  style,
  textStyle,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'default': return styles.defaultChip;
      case 'primary': return styles.primaryChip;
      case 'success': return styles.successChip;
      case 'warning': return styles.warningChip;
      case 'error': return styles.errorChip;
      default: return styles.defaultChip;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return styles.sm;
      case 'md': return styles.md;
      case 'lg': return styles.lg;
      default: return styles.md;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'default': return styles.defaultText;
      case 'primary': return styles.primaryText;
      case 'success': return styles.successText;
      case 'warning': return styles.warningText;
      case 'error': return styles.errorText;
      default: return styles.defaultText;
    }
  };

  const ChipContent = (
    <View style={[
      styles.chip,
      getVariantStyles(),
      getSizeStyles(),
      selected && styles.selected,
      style
    ]}>
      <Text style={[styles.text, getTextStyles(), textStyle]}>
        {children}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} {...props}>
        {ChipContent}
      </TouchableOpacity>
    );
  }

  return ChipContent;
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: Typography.sm,
    fontWeight: '500',
  },
  sm: { paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  md: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  lg: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  selected: { borderWidth: 2, borderColor: Colors.primary },
  defaultChip: { backgroundColor: Colors.gray200 },
  defaultText: { color: Colors.gray700 },
  primaryChip: { backgroundColor: Colors.primary + '20' },
  primaryText: { color: Colors.primary },
  successChip: { backgroundColor: Colors.success + '20' },
  successText: { color: Colors.success },
  warningChip: { backgroundColor: Colors.warning + '20' },
  warningText: { color: Colors.warning },
  errorChip: { backgroundColor: Colors.error + '20' },
  errorText: { color: Colors.error },
});

export default Chip;