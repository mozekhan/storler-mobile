import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  style,
  inputStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <Search size={20} color={Colors.gray400} />
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={Colors.gray400}
        {...props}
      />
      {value && value.length > 0 && (
        <TouchableOpacity onPress={onClear || (() => onChangeText(''))}>
          <X size={20} color={Colors.gray400} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.md,
    color: Colors.gray900,
  },
});

export default SearchBar;