import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const { width } = Dimensions.get('window');

const RevenueChart = ({ data, labels, title = 'Revenue Overview', height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No revenue data available</Text>
      </View>
    );
  }

  const chartData = {
    labels: labels || data.map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        data: data,
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: Colors.white,
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.primary,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={width - 48}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        formatYLabel={(value) => `$${parseInt(value)}`}
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
  chart: {
    marginVertical: Spacing.sm,
    borderRadius: 16,
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

export default RevenueChart;