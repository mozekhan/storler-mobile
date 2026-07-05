import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';

const EmptyState = ({ icon, title, subtitle, children }) => {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.gray900,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});

export default EmptyState;