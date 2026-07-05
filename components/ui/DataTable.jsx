import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const DataTable = ({
  columns,
  data,
  onRowPress,
  loading = false,
  emptyMessage = 'No data available',
  style,
  headerStyle,
  rowStyle,
  cellStyle,
}) => {
  const renderHeader = () => (
    <View style={[styles.header, headerStyle]}>
      {columns.map((column, index) => (
        <View
          key={column.key || index}
          style={[
            styles.headerCell,
            { flex: column.flex || 1 },
            column.align && { alignItems: column.align === 'right' ? 'flex-end' : 'flex-start' },
          ]}
        >
          <Text style={[styles.headerText, column.headerStyle]}>
            {column.label}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderRow = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.row,
        index % 2 === 0 ? styles.rowEven : styles.rowOdd,
        onRowPress && styles.rowPressable,
        rowStyle,
      ]}
      onPress={() => onRowPress && onRowPress(item, index)}
      disabled={!onRowPress}
    >
      {columns.map((column, colIndex) => (
        <View
          key={column.key || colIndex}
          style={[
            styles.rowCell,
            { flex: column.flex || 1 },
            column.align && { alignItems: column.align === 'right' ? 'flex-end' : 'flex-start' },
          ]}
        >
          {column.render ? (
            column.render(item, index)
          ) : (
            <Text style={[styles.rowText, column.cellStyle]}>
              {item[column.key] ?? '-'}
            </Text>
          )}
        </View>
      ))}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, style]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, style]}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}
      <FlatList
        data={data}
        renderItem={renderRow}
        keyExtractor={(item, index) => item.id || index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: Colors.gray100,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerCell: {
    justifyContent: 'center',
  },
  headerText: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.gray700,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  rowEven: {
    backgroundColor: Colors.white,
  },
  rowOdd: {
    backgroundColor: Colors.gray50,
  },
  rowPressable: {
    activeOpacity: 0.7,
  },
  rowCell: {
    justifyContent: 'center',
  },
  rowText: {
    fontSize: Typography.sm,
    color: Colors.gray900,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  loadingText: {
    fontSize: Typography.md,
    color: Colors.gray500,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  emptyText: {
    fontSize: Typography.md,
    color: Colors.gray500,
  },
});

export default DataTable;