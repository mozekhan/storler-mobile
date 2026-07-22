import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Card,
  Badge,
  Chip,
  LoadingSpinner,
  CustomHeader,
} from "../../../../../components/ui";
import {
  List,
  CreditCard,
  FileText,
  Clock,
  Package,
  ArrowRight,
} from "lucide-react-native";
import useTransactionStore from "../../../../../stores/transactionStore";
import { formatCurrency, formatDate } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  Shadows,
  BorderRadius,
} from "../../../../../constants/theme";

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fetchTransactionWithReceipt, currentTransaction, isLoading } =
    useTransactionStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTransactionWithReceipt(id);
    }
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactionWithReceipt(id);
    setRefreshing(false);
  };

  // Navigation handlers
  const navigateToItems = () => {
    router.push(`/transactions/${id}/items`);
  };

  const navigateToPayments = () => {
    router.push(`/transactions/${id}/payments`);
  };

  const navigateToReceipts = () => {
    router.push(`/transactions/${id}/receipts`);
  };

  const navigateToTimeline = () => {
    router.push(`/transactions/${id}/timeline`);
  };

  if (isLoading && !currentTransaction) {
    return <LoadingSpinner />;
  }

  if (!currentTransaction) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Transaction not found</Text>
      </View>
    );
  }

  const transaction = currentTransaction;
  const receiptData = transaction.receiptData || {};
  const summary = receiptData.summary || {};
  const staff = receiptData.staff || {};
  const timeline = receiptData.timeline || {};

  // Get status from transaction or receipt data
  const status = transaction.status || "PENDING";
  const transactionNumber = transaction.transactionNumber || "N/A";

  // Get store info
  const store = transaction.storeId || {};
  const storeName = store.name || receiptData?.store?.name || "N/A";
  const storeCode = store.code || "N/A";

  // Get items from transaction or receipt data
  const items = transaction.items || receiptData.items || [];
  const itemsReleased = transaction.itemsReleased || receiptData.releasedItems || [];

  // Get staff info
  const salesAttendant = staff.salesAttendant || transaction.salesAttendantId || {};
  const financeAttendant = staff.financeAttendant || transaction.financeAttendantId || null;
  const warehouseStaff = staff.warehouseStaff || transaction.warehouseStaffId || null;

  const salesAttendantName = salesAttendant.name || 
    `${salesAttendant.firstName || ''} ${salesAttendant.lastName || ''}`.trim() || "N/A";

  // Get totals
  const subtotal = transaction.subtotal || summary.subtotal || 0;
  const taxTotal = transaction.taxTotal || summary.taxTotal || 0;
  const totalAmount = transaction.totalAmount || summary.totalAmount || 0;
  const amountPaid = summary.amountPaid || transaction.amountPaid || 0;
  const changeAmount = summary.changeAmount || transaction.changeAmount || 0;
  const paymentMethod = summary.paymentMethod || transaction.paymentMethod || "N/A";

  // Get timeline
  const createdAt = transaction.createdAt || timeline.created || new Date();
  const auditTrail = transaction.auditTrail || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <CustomHeader title="Transaction Details" />
      
      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text style={styles.transactionNumber}>{transactionNumber}</Text>
          <Badge status={status}>{status}</Badge>
        </View>
        <Text style={styles.date}>{formatDate(createdAt)}</Text>
      </Card>

      {/* Quick Navigation Grid */}
      <View style={styles.quickNavGrid}>
        <TouchableOpacity style={styles.quickNavItem} onPress={navigateToItems}>
          <View
            style={[
              styles.quickNavIcon,
              { backgroundColor: Colors.primary + "15" },
            ]}
          >
            <List size={24} color={Colors.primary} />
          </View>
          <Text style={styles.quickNavLabel}>Items</Text>
          <Text style={styles.quickNavCount}>
            {items.length + itemsReleased.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickNavItem}
          onPress={navigateToPayments}
        >
          <View
            style={[styles.quickNavIcon, { backgroundColor: "#8B5CF6" + "15" }]}
          >
            <CreditCard size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.quickNavLabel}>Payments</Text>
          <Text style={styles.quickNavCount}>
            {paymentMethod !== "N/A" ? "1" : "0"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickNavItem}
          onPress={navigateToReceipts}
        >
          <View
            style={[styles.quickNavIcon, { backgroundColor: "#EC4899" + "15" }]}
          >
            <FileText size={24} color="#EC4899" />
          </View>
          <Text style={styles.quickNavLabel}>Receipts</Text>
          <Text style={styles.quickNavCount}>●</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickNavItem}
          onPress={navigateToTimeline}
        >
          <View
            style={[
              styles.quickNavIcon,
              { backgroundColor: Colors.warning + "15" },
            ]}
          >
            <Clock size={24} color={Colors.warning} />
          </View>
          <Text style={styles.quickNavLabel}>Timeline</Text>
          <Text style={styles.quickNavCount}>●</Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Store</Text>
        <Text style={styles.storeName}>{storeName}</Text>
        <Text style={styles.storeCode}>Code: {storeCode}</Text>
      </Card>

      <Card style={styles.sectionCard}>
        <View style={styles.totalsGrid}>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(subtotal)}
            </Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(taxTotal)}
            </Text>
          </View>
          <View style={[styles.totalItem, styles.totalHighlight]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(totalAmount)}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          Items ({items.length + itemsReleased.length})
        </Text>
        {[...items, ...itemsReleased].slice(0, 3).map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name || "Item"}</Text>
              <Text style={styles.itemSku}>SKU: {item.sku || "N/A"}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity || 0}</Text>
            </View>
            <View style={styles.itemPrice}>
              <Text style={styles.itemUnitPrice}>
                {formatCurrency(item.unitPrice || 0)}
              </Text>
              <Text style={styles.itemTotal}>
                {formatCurrency(item.totalPrice || item.unitPrice * item.quantity || 0)}
              </Text>
            </View>
          </View>
        ))}
        {(items.length + itemsReleased.length) > 3 && (
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={navigateToItems}
          >
            <Text style={styles.viewMoreText}>
              View all {items.length + itemsReleased.length} items
            </Text>
            <ArrowRight size={16} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Staff</Text>
        <View style={styles.staffRow}>
          <View style={styles.staffItem}>
            <Text style={styles.staffLabel}>Sales Attendant</Text>
            <Text style={styles.staffName}>{salesAttendantName}</Text>
          </View>
          {financeAttendant && (
            <View style={styles.staffItem}>
              <Text style={styles.staffLabel}>Finance Attendant</Text>
              <Text style={styles.staffName}>
                {financeAttendant.name || 
                  `${financeAttendant.firstName || ''} ${financeAttendant.lastName || ''}`.trim() || "N/A"}
              </Text>
            </View>
          )}
          {warehouseStaff && (
            <View style={styles.staffItem}>
              <Text style={styles.staffLabel}>Warehouse Staff</Text>
              <Text style={styles.staffName}>
                {warehouseStaff.name || 
                  `${warehouseStaff.firstName || ''} ${warehouseStaff.lastName || ''}`.trim() || "N/A"}
              </Text>
            </View>
          )}
        </View>
      </Card>

      {paymentMethod !== "N/A" && (
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentGrid}>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Method</Text>
              <Chip>{paymentMethod}</Chip>
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Amount Paid</Text>
              <Text>{formatCurrency(amountPaid)}</Text>
            </View>
            {changeAmount > 0 && (
              <View style={styles.paymentItem}>
                <Text style={styles.paymentLabel}>Change</Text>
                <Text style={styles.changeText}>
                  {formatCurrency(changeAmount)}
                </Text>
              </View>
            )}
          </View>
        </Card>
      )}

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Audit Trail</Text>
        {auditTrail.slice(0, 3).map((entry, index) => (
          <View key={index} style={styles.auditEntry}>
            <Text style={styles.auditAction}>{entry.action || "Update"}</Text>
            <Text style={styles.auditTime}>{formatDate(entry.timestamp || new Date())}</Text>
          </View>
        ))}
        {auditTrail.length > 3 && (
          <Text style={styles.viewMore}>
            + {auditTrail.length - 3} more
          </Text>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerCard: { margin: 16, marginBottom: 8 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionNumber: { fontSize: 18, fontWeight: "bold" },
  date: { fontSize: 14, color: Colors.gray, marginTop: 4 },
  quickNavGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  quickNavItem: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    ...Shadows.sm,
  },
  quickNavIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  quickNavLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
  },
  quickNavCount: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  sectionCard: { marginHorizontal: 16, marginVertical: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  totalsGrid: { flexDirection: "row", justifyContent: "space-between" },
  totalItem: { flex: 1, alignItems: "center" },
  totalHighlight: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    padding: 8,
  },
  totalLabel: { fontSize: 12, color: Colors.gray },
  totalValue: { fontSize: 16, fontWeight: "500" },
  totalAmount: { fontSize: 20, fontWeight: "bold", color: Colors.primary },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: "500" },
  itemSku: { fontSize: 12, color: Colors.gray },
  itemQuantity: { fontSize: 12, color: Colors.gray },
  itemPrice: { alignItems: "flex-end" },
  itemUnitPrice: { fontSize: 12, color: Colors.gray },
  itemTotal: { fontSize: 14, fontWeight: "500" },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  viewMoreText: {
    color: Colors.primary,
    fontWeight: "600",
    marginRight: Spacing.xs,
  },
  staffRow: { gap: 8 },
  staffItem: { paddingVertical: 4 },
  staffLabel: { fontSize: 12, color: Colors.gray },
  staffName: { fontSize: 14, fontWeight: "500" },
  paymentGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  paymentItem: { minWidth: "45%" },
  paymentLabel: { fontSize: 12, color: Colors.gray },
  changeText: { color: Colors.success, fontWeight: "600" },
  auditEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  auditAction: { fontSize: 14 },
  auditTime: { fontSize: 12, color: Colors.gray },
  viewMore: { fontSize: 14, color: Colors.primary, marginTop: 8 },
  storeName: { fontSize: 16, fontWeight: "500" },
  storeCode: { fontSize: 14, color: Colors.gray },
});