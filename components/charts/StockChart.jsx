import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const { width } = Dimensions.get('window');

const StockChart = ({ data, title = 'Stock Distribution', height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No stock data available</Text>
      </View>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.label || `Category ${index + 1}`,
    count: item.value || 0,
    color: item.color || ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6],
    legendFontColor: Colors.gray700,
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <PieChart
        data={chartData}
        width={width - 48}
        height={height}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
});

export default StockChart;