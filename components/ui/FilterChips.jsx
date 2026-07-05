import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const FilterChips = ({
  options,
  selectedValue,
  onSelect,
  labelKey = 'label',
  valueKey = 'value',
  style,
  chipStyle,
  ...props
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
      {...props}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option[valueKey];
        return (
          <TouchableOpacity
            key={option[valueKey]}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
              chipStyle
            ]}
            onPress={() => onSelect(option[valueKey])}
          >
            <Text style={[styles.text, isSelected && styles.textSelected]}>
              {option[labelKey]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray200,
    marginRight: Spacing.sm,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: Typography.sm,
    color: Colors.gray700,
  },
  textSelected: {
    color: Colors.white,
  },
});

export default FilterChips;