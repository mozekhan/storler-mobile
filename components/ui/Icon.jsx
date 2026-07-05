import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

const Icon = ({
  name,
  size = 24,
  color = Colors.gray500,
  style,
  ...props
}) => {
  // This is a wrapper component for Lucide icons
  // Actual icons are imported directly from lucide-react-native
  // This component provides consistent styling
  return (
    <View style={[styles.container, style]} {...props}>
      {/* Icon will be rendered by the parent using lucide-react-native */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Icon;