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
import { useAuth } from "../../hooks/useAuth";
import AdminService from "../../services/adminService";
import StoreService from "../../services/storeService";
import UserService from "../../services/userService";
import {
  Users,
  Store,
  Package,
  DollarSign,
  ShoppingBag,
  Clock,
  AlertCircle,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  TrendingUp,
  ChevronRight,
  RefreshCw,
  PlusCircle,
  List,
  Edit,
} from "lucide-react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../constants/theme";
import { formatCurrency } from "../../utils/formatters";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    products: 0,
    transactions: { total: 0, completed: 0, pending: 0 },
    revenue: { today: 0, thisMonth: 0, allTime: 0 },
    inventory: { totalItems: 0, lowStockCount: 0, outOfStockCount: 0 },
  });
  const [recentStores, setRecentStores] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [systemStats, stores, users] = await Promise.all([
        AdminService.getSystemStats(),
        StoreService.getStores({ limit: 5 }),
        UserService.getUsers({ limit: 5 }),
      ]);

      setStats(systemStats);
      setRecentStores(stores.stores || []);
      setRecentUsers(users.users || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
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

  const AdminCard = ({ title, icon: Icon, description, onPress, color }) => (
    <TouchableOpacity style={styles.adminCard} onPress={onPress}>
      <View style={[styles.adminCardIcon, { backgroundColor: color + "15" }]}>
        <Icon size={28} color={color} />
      </View>
      <View style={styles.adminCardContent}>
        <Text style={styles.adminCardTitle}>{title}</Text>
        <Text style={styles.adminCardDescription}>{description}</Text>
      </View>
      <ChevronRight size={20} color={Colors.gray400} />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              System overview and management
            </Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <RefreshCw size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await logout();
              router.replace("/(auth)/login");
            }}
          >
            <LogOut size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Users"
              value={stats.users}
              icon={Users}
              color="#3B82F6"
            />
            <StatCard
              title="Stores"
              value={stats.stores}
              icon={Store}
              color="#8B5CF6"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Products"
              value={stats.products}
              icon={Package}
              color="#22C55E"
            />
            <StatCard
              title="Transactions"
              value={stats.transactions?.total || 0}
              icon={ShoppingBag}
              color="#F59E0B"
              subtitle={`${stats.transactions?.completed || 0} completed`}
            />
          </View>
        </View>

        <View style={styles.revenueCard}>
          <Text style={styles.revenueTitle}>Revenue Overview</Text>
          <View style={styles.revenueGrid}>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>Today</Text>
              <Text style={[styles.revenueValue, styles.primaryValue]}>
                {formatCurrency(stats.revenue?.today ?? 0)}
              </Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>This Month</Text>
              <Text style={[styles.revenueValue, styles.successValue]}>
                {formatCurrency(stats.revenue?.thisMonth ?? 0)}
              </Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>All Time</Text>
              <Text style={[styles.revenueValue, styles.primaryValue]}>
                {formatCurrency(stats.revenue?.allTime ?? 0)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.inventoryCard}>
          <Text style={styles.inventoryTitle}>Inventory Status</Text>
          <View style={styles.inventoryGrid}>
            <View style={styles.inventoryItem}>
              <Package size={20} color={Colors.primary} />
              <Text style={styles.inventoryValue}>
                {stats.inventory?.totalItems || 0}
              </Text>
              <Text style={styles.inventoryLabel}>Total Items</Text>
            </View>
            <View style={styles.inventoryItem}>
              <AlertCircle size={20} color={Colors.warning} />
              <Text style={[styles.inventoryValue, styles.warningValue]}>
                {stats.inventory?.lowStockCount || 0}
              </Text>
              <Text style={styles.inventoryLabel}>Low Stock</Text>
            </View>
            <View style={styles.inventoryItem}>
              <AlertCircle size={20} color={Colors.error} />
              <Text style={[styles.inventoryValue, styles.errorValue]}>
                {stats.inventory?.outOfStockCount || 0}
              </Text>
              <Text style={styles.inventoryLabel}>Out of Stock</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Management</Text>

        <AdminCard
          title="Product Management"
          icon={Package}
          description="Manage products, inventory, and stock levels"
          color="#22C55E"
          onPress={() => router.push("/(app)/(stacks)/products")}
        />

        <AdminCard
          title="Staff Management"
          icon={Users}
          description="Manage staff accounts and permissions"
          color="#3B82F6"
          onPress={() => router.push("/(admin)/staff")}
        />

        <AdminCard
          title="Store Management"
          icon={Store}
          description="Manage stores and branches"
          color="#8B5CF6"
          onPress={() => router.push("/(admin)/stores")}
        />

        <AdminCard
          title="Audit Logs"
          icon={FileText}
          description="View system activity logs"
          color="#F59E0B"
          onPress={() => router.push("/(admin)/audit-logs")}
        />

        <AdminCard
          title="System Settings"
          icon={Settings}
          description="Configure system settings"
          color="#6B7280"
          onPress={() => router.push("/(admin)/settings")}
        />

        <Text style={styles.sectionTitle}>Recent Activity</Text>

        <View style={styles.recentCard}>
          <Text style={styles.recentSubtitle}>Recent Users</Text>
          {recentUsers.length === 0 ? (
            <Text style={styles.recentEmpty}>No users found</Text>
          ) : (
            recentUsers.map((user) => (
              <View key={user._id} style={styles.recentItem}>
                <View style={styles.recentAvatar}>
                  <Text style={styles.recentAvatarText}>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </Text>
                </View>
                <View style={styles.recentItemInfo}>
                  <Text style={styles.recentItemName}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text style={styles.recentItemDetail}>
                    {user.email} • {user.role?.replace("_", " ")}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.recentCard}>
          <Text style={styles.recentSubtitle}>Recent Stores</Text>
          {recentStores.length === 0 ? (
            <Text style={styles.recentEmpty}>No stores found</Text>
          ) : (
            recentStores.map((store) => (
              <View key={store._id} style={styles.recentItem}>
                <View style={styles.recentStoreIcon}>
                  <Store size={16} color={Colors.primary} />
                </View>
                <View style={styles.recentItemInfo}>
                  <Text style={styles.recentItemName}>{store.name}</Text>
                  <Text style={styles.recentItemDetail}>
                    Code: {store.code} •{" "}
                    {store.isActive ? "Active" : "Inactive"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            System running smoothly • {new Date().toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["3xl"],
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.gray900,
  },
  headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
  refreshButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
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
    fontSize: Typography.xl,
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
  revenueCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  revenueTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  revenueGrid: { flexDirection: "row", },
  revenueItem: { flex: 1 },
  revenueLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  revenueValue: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    marginTop: Spacing.xs,
  },
  primaryValue: { color: Colors.primary },
  successValue: { color: Colors.success },
  inventoryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  inventoryTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  inventoryGrid: { flexDirection: "row" },
  inventoryItem: { flex: 1, alignItems: "center" },
  inventoryValue: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.xs,
  },
  inventoryLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  warningValue: { color: Colors.warning },
  errorValue: { color: Colors.error },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  adminCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  adminCardIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  adminCardContent: { flex: 1 },
  adminCardTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
  },
  adminCardDescription: { fontSize: Typography.sm, color: Colors.gray500 },
  recentCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  recentSubtitle: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  recentAvatar: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  recentAvatarText: {
    fontSize: Typography.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
  recentStoreIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  recentItemInfo: { marginLeft: Spacing.sm, flex: 1 },
  recentItemName: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  recentItemDetail: { fontSize: Typography.xs, color: Colors.gray500 },
  recentEmpty: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    textAlign: "center",
    paddingVertical: Spacing.md,
  },
  footer: { paddingVertical: Spacing.md, alignItems: "center" },
  footerText: { fontSize: Typography.xs, color: Colors.gray400 },
});
