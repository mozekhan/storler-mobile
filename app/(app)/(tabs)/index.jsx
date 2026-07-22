import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import { useRole } from "../../../hooks/useRole";
import AdminService from "../../../services/adminService";
import InventoryService from "../../../services/inventoryService";
import StoreService from "../../../services/storeService";
import {
  ShoppingBag,
  CreditCard,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  Settings,
  Store,
  FileText,
  Boxes,
  BarChart3,
  ReceiptText,
  ShieldUser,
  LogOut,
  QrCode,
  PlusCircle,
  List,
  Eye,
  ChevronRight,
} from "lucide-react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../constants/theme";
import { Permissions } from "../../../constants/roles";
import { formatCurrency } from "../../../utils/formatters";

export default function Home() {
  const { user, logout, currentStore, storeVersion } = useAuth();
  const {
    isSuperAdmin,
    isAdmin,
    isSalesRole,
    isFinanceRole,
    isWarehouseRole,
    can,
  } = useRole();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    pendingTasks: 0,
    totalRevenue: 0,
    monthRevenue: 0,
    lowStockItems: 0,
    recentTransactions: [],
    users: 0,
    stores: 0,
    products: 0,
  });

  const fetchStats = async () => {
  try {
    if (!currentStore?._id) {
      setLoading(false);
      return;
    }

    const [systemStats, lowStock] = await Promise.all([
      StoreService.getStoreStats(currentStore._id),
      InventoryService.getLowStockItems(),
    ]);

    const { transactions = {}, revenue = {}, inventory = {} } = systemStats;

    setStats({
      totalSales: revenue.today || 0,
      totalTransactions: transactions.total || 0,
      pendingTasks: transactions.pending || 0,
      totalRevenue: revenue.total || 0,
      monthRevenue: revenue.thisMonth || 0,
      lowStockItems:
        inventory.lowStockCount || lowStock?.length || 0,
      recentTransactions: [],
      users: systemStats.users || 0,
      stores: 1,
      products: systemStats.products || 0,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchStats();
  }, [currentStore, storeVersion]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <View style={styles.statCard}>
      <View style={styles.statCardContent}>
        <View>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={styles.statCardValue}>
            {typeof value === "number" && value > 999
              ? `${(value / 1000).toFixed(1)}K`
              : value}
          </Text>
          {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
        </View>
        <View style={[styles.statCardIcon, { backgroundColor: color }]}>
          <Icon size={20} color={Colors.white} />
        </View>
      </View>
    </View>
  );

  const QuickAction = ({ title, icon: Icon, onPress, color, badge }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Icon size={24} color={Colors.white} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, onPress, showViewAll = false }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {showViewAll && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const getQuickActions = () => {
    const actions = [];

    if (isSalesRole || isWarehouseRole || isAdmin || isSuperAdmin) {
      actions.push({
        title: "Products",
        icon: Package,
        color: "#22C55E",
        onPress: () => router.push("/(app)/(stacks)/products"),
      });
    }

    if (isSalesRole || isFinanceRole || isWarehouseRole || isAdmin || isSuperAdmin) {
      actions.push({
        title: "Transaction",
        icon: CreditCard,
        color: "#8B5CF6",
        onPress: () => router.push("/(app)/(stacks)/transactions"),
        badge: stats.pendingTasks > 0 ? stats.pendingTasks : null,
      });
    }

    if (isSalesRole || isFinanceRole || isWarehouseRole || isAdmin || isSuperAdmin) {
      actions.push({
        title: "Receipts",
        icon: ReceiptText,
        color: "#F59E0B",
        onPress: () => router.push("/(app)/(stacks)/receipts"),
        // badge: stats.lowStockItems > 0 ? stats.lowStockItems : null,
      });
    }

    if (isAdmin || isSuperAdmin || can(Permissions.INVENTORY_READ)) {
      actions.push({
        title: "Inventory",
        icon: Boxes,
        color: "#1c6bda",
        onPress: () => router.push("/(app)/(stacks)/inventory"),
        badge: stats.lowStockItems > 0 ? stats.lowStockItems : null,
      });
    }

    if (isSalesRole || isFinanceRole || isWarehouseRole || isAdmin || isSuperAdmin && can(Permissions.REPORT_GENERATE)) {
      actions.push({
        title: "Reports",
        icon: BarChart3,
        color: "#1493c9",
        onPress: () => router.push("/(app)/(stacks)/reports"),
      });
    }

    if (isSuperAdmin) {
      actions.push({
        title: "Staff",
        icon: Users,
        color: "#a46d98",
        onPress: () => router.push("/(admin)/staff"),
      });
    }

    if (isSuperAdmin) {
      actions.push({
        title: "Stores",
        icon: Store,
        color: "#59713d",
        onPress: () => router.push("/(admin)/stores"),
      });
    }

    if (isSuperAdmin) {
      actions.push({
        title: "Admin",
        icon: ShieldUser,
        color: "#f73c3cbd",
        onPress: () => router.push("/(admin)"),
      });
    }


    return actions;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const quickActions = getQuickActions();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeContainer}>
          <View>
            {/* <Text style={styles.welcomeTitle}>Welcome back, 👋</Text> */}
            <Text style={styles.welcomeName}>
              {user?.firstName} {user?.lastName}
            </Text>
            {currentStore && (
              <View style={styles.storeBadge}>
                <Store size={14} color={Colors.primary} />
                <Text style={styles.storeBadgeText}>{currentStore.name}</Text>
              </View>
            )}
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {user?.role?.replace(/_/g, " ")}
              </Text>
            </View>
          </View>


        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Today's Sales"
              value={formatCurrency(stats?.totalSales ?? 0)}
              icon={DollarSign}
              color={Colors.primary}
            />
            <StatCard
              title="Transactions"
              value={stats.totalTransactions}
              icon={ShoppingBag}
              color={Colors.success}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="This Month Revenue"
              value={formatCurrency(stats?.monthRevenue ?? 0)}
              icon={TrendingUp}
              color="#8B5CF6"
            />
            <StatCard
              title="Pending Tasks"
              value={stats.pendingTasks}
              icon={AlertCircle}
              color={Colors.warning}
              subtitle={
                stats.lowStockItems > 0
                  ? `${stats.lowStockItems} low stock`
                  : undefined
              }
            />
          </View>
        </View>

        <SectionHeader title="Quick Actions" />
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              icon={action.icon}
              color={action.color}
              onPress={action.onPress}
              badge={action.badge}
            />
          ))}
        </View>

        {(isSuperAdmin || isAdmin) && (
          <View style={styles.adminStats}>
            <SectionHeader title="Store Overview" />
            <View style={styles.adminStatsGrid}>
              <View style={styles.adminStatItem}>
                <Users size={20} color={Colors.primary} />
                <Text style={styles.adminStatValue}>{stats.users}</Text>
                <Text style={styles.adminStatLabel}>Users</Text>
              </View>
              <View style={styles.adminStatItem}>
                <Package size={20} color={Colors.primary} />
                <Text style={styles.adminStatValue}>{stats.products}</Text>
                <Text style={styles.adminStatLabel}>Products</Text>
              </View>
              <View style={styles.adminStatItem}>
                <ShoppingBag size={20} color={Colors.primary} />
                <Text style={styles.adminStatValue}>
                  {stats.totalTransactions}
                </Text>
                <Text style={styles.adminStatLabel}>Transactions</Text>
              </View>
            </View>
          </View>
         )} 

        <Text style={styles.versionText}>
          Version 1.0.0 • Store Management System
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["2xl"],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray50,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: Spacing.md,
  },
  welcomeTitle: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.gray900,
  },
  welcomeName: { fontSize: Typography.xl, color: Colors.gray700 },
  roleBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
    marginTop: Spacing.xs,
  },
  roleBadgeText: {
    color: Colors.primary,
    fontSize: Typography.xs,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  logoutButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.error + "10",
    borderRadius: BorderRadius.full,
  },
  statsGrid: { marginBottom: Spacing.md },
  statsRow: { flexDirection: "row", marginBottom: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.xs,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statCardTitle: { color: Colors.gray500, fontSize: Typography.xs },
  statCardValue: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.xs,
  },
  statCardSubtitle: {
    fontSize: Typography.xs,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  statCardIcon: { padding: Spacing.sm, borderRadius: BorderRadius.full },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
  },
  viewAllText: { color: Colors.primary, fontSize: Typography.sm },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  quickAction: {
    width: "23%",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    marginBottom: Spacing.sm,
    ...Shadows.sm,
    position: "relative",
  },
  quickActionIcon: {
    padding: Spacing.md,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  quickActionTitle: {
    fontSize: Typography.xs,
    fontWeight: "500",
    color: Colors.gray700,
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: "bold" },
  adminStats: { marginBottom: Spacing.md },
  adminStatsGrid: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  adminStatItem: { flex: 1, alignItems: "center" },
  adminStatValue: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.xs,
  },
  adminStatLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  versionText: {
    textAlign: "center",
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: Spacing["2xl"],
    paddingVertical: Spacing.md,
  },
  storeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "10",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
    alignSelf: "flex-start",
  },
  storeBadgeText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: "500",
    marginLeft: 4,
  },
});
