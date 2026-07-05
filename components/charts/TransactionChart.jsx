import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const { width } = Dimensions.get('window');

const TransactionChart = ({ data, labels, title = 'Transaction Overview', height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transaction data available</Text>
      </View>
    );
  }

  const chartData = {
    labels: labels || data.map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        data: data,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: Colors.white,
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        data={chartData}
        width={width - 48}
        height={height}
        chartConfig={chartConfig}
        style={styles.chart}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
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

export default TransactionChart;