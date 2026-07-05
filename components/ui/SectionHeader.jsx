import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';

const SectionHeader = ({ title, onPress, showViewAll = false, viewAllText = 'View All' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showViewAll && onPress && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.viewAllText}>{viewAllText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.gray900,
  },
  viewAllText: {
    color: Colors.primary,
    fontSize: Typography.sm,
  },
});

export default SectionHeader;