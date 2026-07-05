import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Users, Package, ShoppingBag, DollarSign } from "lucide-react-native";
import AdminService from "../../../../../services/adminService";
import { formatCurrency } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../../../../constants/theme";

export default function StoreStats() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [id]);

  const fetchStats = async () => {
    try {
      const data = await AdminService.getStoreStats(id);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch store stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardContent}>
        <View>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={styles.statCardValue}>
            {typeof value === "number" && value > 999
              ? `${(value / 1000).toFixed(1)}K`
              : value}
          </Text>
        </View>
        <View style={[styles.statCardIcon, { backgroundColor: color + "15" }]}>
          <Icon size={20} color={color} />
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No statistics available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statsContainer}>
        <StatCard
          title="Users"
          value={stats.users}
          icon={Users}
          color={Colors.primary}
        />
        <StatCard
          title="Products"
          value={stats.products}
          icon={Package}
          color={Colors.success}
        />
        <StatCard
          title="Transactions"
          value={stats.transactions?.total || 0}
          icon={ShoppingBag}
          color={Colors.warning}
        />
        <StatCard
          title="Revenue"
          value={stats.revenue?.total || 0}
          icon={DollarSign}
          color={Colors.primary}
        />
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Completed</Text>
          <Text style={styles.detailValue}>
            {stats.transactions?.completed || 0}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Pending</Text>
          <Text style={styles.detailValue}>
            {stats.transactions?.pending || 0}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>
            {stats.transactions?.total || 0}
          </Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Today</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(stats.revenue?.today || 0)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>This Month</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(stats.revenue?.thisMonth || 0)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>All Time</Text>
          <Text style={[styles.detailValue, styles.totalValue]}>
            {formatCurrency(stats.revenue?.total || 0)}
          </Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Inventory Status</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Items</Text>
          <Text style={styles.detailValue}>
            {stats.inventory?.totalItems || 0}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Low Stock</Text>
          <Text style={[styles.detailValue, styles.warningValue]}>
            {stats.inventory?.lowStockCount || 0}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Out of Stock</Text>
          <Text style={[styles.detailValue, styles.errorValue]}>
            {stats.inventory?.outOfStockCount || 0}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: Colors.gray500 },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.md,
  },
  statCard: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
  },
  statCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statCardTitle: { fontSize: Typography.xs, color: Colors.gray500 },
  statCardValue: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.xs,
  },
  statCardIcon: { padding: Spacing.sm, borderRadius: BorderRadius.full },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  totalValue: { color: Colors.primary },
  warningValue: { color: Colors.warning },
  errorValue: { color: Colors.error },
});
