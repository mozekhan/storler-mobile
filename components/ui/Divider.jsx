import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

const Divider = ({ style, ...props }) => {
  return <View style={[styles.divider, style]} {...props} />;
};

const styles = StyleSheet.create({
  divider: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    marginVertical: Spacing.md,
  },
});

export default Divider;