import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import {
  TrendingUp,
  Package,
  DollarSign,
  Shield,
  Store,
  BarChart3,
  Users,
  FileText,
  ChevronRight,
} from "lucide-react-native";
import ReportService from "../../../../services/reportService";
import { formatCurrency } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

export default function ReportsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalProducts: 0,
    lowStock: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const endDate = new Date().toISOString().split("T")[0];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const start = startDate.toISOString().split("T")[0];

      const [sales, inventory] = await Promise.all([
        ReportService.getSalesReport({
          startDate: start,
          endDate,
        }),
        ReportService.getInventoryReport(),
      ]);

      setSummary({
        totalRevenue: sales?.summary?.totalRevenue || 0,
        totalTransactions: sales?.summary?.totalTransactions || 0,
        totalProducts: inventory?.summary?.totalProducts || 0,
        lowStock: inventory?.summary?.lowStock || 0,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSummary();
  }, []);

  const ReportCard = ({
    title,
    icon: Icon,
    onPress,
    color,
    description,
    badge,
    badgeColor = Colors.primary,
  }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.reportCardContent}>
        <View style={[styles.reportCardIcon, { backgroundColor: color }]}>
          <Icon size={24} color={Colors.white} />
        </View>
        <View style={styles.reportCardInfo}>
          <Text style={styles.reportCardTitle}>{title}</Text>
          {description && (
            <Text style={styles.reportCardDescription} numberOfLines={1}>
              {description}
            </Text>
          )}
        </View>
        {badge && (
          <View
            style={[styles.reportCardBadge, { backgroundColor: badgeColor }]}
          >
            <Text style={styles.reportCardBadgeText}>{badge}</Text>
          </View>
        )}
        <ChevronRight size={20} color={Colors.gray400} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <CustomHeader title="Reports" showBack={true} />

        <View style={styles.headerSubtitleContainer}>
          <Text style={styles.pageSubtitle}>
            Analytics and insights for your business
          </Text>
        </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >

       

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardLeft]}>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={[styles.statValue, styles.revenueValue]}>
              {formatCurrency(summary.totalRevenue)}
            </Text>
            <Text style={styles.statPeriod}>Last 30 days</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRight]}>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statValue}>{summary.totalTransactions}</Text>
            <Text style={styles.statPeriod}>Last 30 days</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardLeft]}>
            <Text style={styles.statLabel}>Total Products</Text>
            <Text style={styles.statValue}>{summary.totalProducts}</Text>
            <Text style={styles.statPeriod}>Inventory</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRight]}>
            <Text style={styles.statLabel}>Low Stock</Text>
            <Text style={[styles.statValue, styles.warningValue]}>
              {summary.lowStock}
            </Text>
            <Text style={styles.statPeriod}>Items need reorder</Text>
          </View>
        </View>

        {/* Report Cards */}
        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Sales & Revenue</Text>

          <ReportCard
            title="Sales Report"
            icon={TrendingUp}
            color={Colors.primary}
            description={`${summary.totalTransactions} transactions, ${formatCurrency(summary.totalRevenue)}`}
            badge="Detailed"
            onPress={() => router.push("/reports/sales")}
          />

          <ReportCard
            title="Financial Report"
            icon={DollarSign}
            color="#8B5CF6"
            description="Profitability, ratios, cash flow analysis"
            badge="Advanced"
            onPress={() => router.push("/reports/financial")}
          />
        </View>

        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Inventory & Products</Text>

          <ReportCard
            title="Inventory Report"
            icon={Package}
            color={Colors.success}
            description={`${summary.totalProducts} products, ${summary.lowStock} low stock`}
            badge={`${summary.lowStock} low`}
            badgeColor={summary.lowStock > 0 ? Colors.warning : Colors.success}
            onPress={() => router.push("/reports/inventory")}
          />

          <ReportCard
            title="Product Performance"
            icon={BarChart3}
            color="#F59E0B"
            description="Top products, sales trends, categories"
            badge="Analytics"
            onPress={() => router.push("/reports/product-performance")}
          />
        </View>

        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>People & Operations</Text>

          <ReportCard
            title="Staff Performance"
            icon={Users}
            color="#EF4444"
            description="Individual performance, team metrics"
            badge="HR"
            onPress={() => router.push("/reports/user-performance")}
          />

          <ReportCard
            title="Audit Report"
            icon={Shield}
            color="#6366F1"
            description="Security, compliance, activity tracking"
            badge="Security"
            onPress={() => router.push("/reports/audit")}
          />
        </View>

        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Multi-Store</Text>

          <ReportCard
            title="Store Comparison"
            icon={Store}
            color="#EC4899"
            description="Compare performance across stores"
            badge="Multi-Store"
            onPress={() => router.push("/reports/store-comparison")}
          />
        </View>

        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.md },

  // Header
  header: { marginBottom: Spacing.sm },
  pageTitle: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.gray900,
  },
  pageSubtitle: {
    fontSize: Typography.md,
    color: Colors.gray500,
    // marginTop: 2,
  },

  headerSubtitleContainer: {
  paddingHorizontal: Spacing.md,
  paddingTop: Spacing.sm,
  paddingBottom: Spacing.sm,
},

  // Stats
  statsRow: { flexDirection: "row", marginBottom: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statCardLeft: { marginRight: Spacing.sm },
  statCardRight: { marginLeft: Spacing.sm },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: 2,
  },
  statPeriod: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 2 },
  revenueValue: { color: Colors.success },
  warningValue: { color: Colors.warning },

  // Report Section
  reportSection: { marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  reportCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  reportCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
  reportCardIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  reportCardInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  reportCardTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
  },
  reportCardDescription: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 1,
  },
  reportCardBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  reportCardBadgeText: {
    fontSize: Typography.xs,
    color: Colors.white,
    fontWeight: "500",
  },
  footerSpace: { height: Spacing["2xl"] },
});
