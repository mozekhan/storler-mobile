// import React, { useEffect, useState } from "react";
// import { View, ScrollView, StyleSheet, Text, RefreshControl } from "react-native";
// import { useLocalSearchParams, useNavigation } from "expo-router";
// import {
//   Card,
//   Badge,
//   Divider,
//   Chip,
//   LoadingSpinner,
// } from "../../../../../components/ui";
// import TransactionDetailView from "../../../../../components/detail/TransactionDetailView";
// import useTransactionStore from "../../../../../stores/transactionStore";
// import { formatCurrency, formatDate } from "../../../../../utils/formatters";
// import { Colors } from "../../../../../constants/theme";

// export default function TransactionDetailScreen() {
//   const { id } = useLocalSearchParams();
//   const navigation = useNavigation();
//   const { fetchTransaction, currentTransaction, isLoading } =
//     useTransactionStore();
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetchTransaction(id);
//       navigation.setOptions({ title: `Transaction #${id.slice(-6)}` });
//     }
//   }, [id]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchTransaction(id, true);
//     setRefreshing(false);
//   };

//   if (isLoading && !currentTransaction) {
//     return <LoadingSpinner />;
//   }

//   if (!currentTransaction) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text>Transaction not found</Text>
//       </View>
//     );
//   }

//   const transaction = currentTransaction;

//   return (
//     <ScrollView
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       <Card style={styles.headerCard}>
//         <View style={styles.headerRow}>
//           <Text style={styles.transactionNumber}>
//             {transaction.transactionNumber}
//           </Text>
//           <Badge status={transaction.status}>{transaction.status}</Badge>
//         </View>
//         <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
//       </Card>

//       <Card style={styles.sectionCard}>
//         <Text style={styles.sectionTitle}>Store</Text>
//         <Text style={styles.storeName}>{transaction.storeId?.name}</Text>
//         <Text style={styles.storeCode}>Code: {transaction.storeId?.code}</Text>
//       </Card>

//       <Card style={styles.sectionCard}>
//         <View style={styles.totalsGrid}>
//           <View style={styles.totalItem}>
//             <Text style={styles.totalLabel}>Subtotal</Text>
//             <Text style={styles.totalValue}>
//               {formatCurrency(transaction.subtotal)}
//             </Text>
//           </View>
//           <View style={styles.totalItem}>
//             <Text style={styles.totalLabel}>Tax</Text>
//             <Text style={styles.totalValue}>
//               {formatCurrency(transaction.taxTotal)}
//             </Text>
//           </View>
//           <View style={[styles.totalItem, styles.totalHighlight]}>
//             <Text style={styles.totalLabel}>Total</Text>
//             <Text style={styles.totalAmount}>
//               {formatCurrency(transaction.totalAmount)}
//             </Text>
//           </View>
//         </View>
//       </Card>

//       <Card style={styles.sectionCard}>
//         <Text style={styles.sectionTitle}>
//           Items ({transaction.items?.length || 0})
//         </Text>
//         {transaction.items?.map((item, index) => (
//           <View key={index} style={styles.itemRow}>
//             <View style={styles.itemInfo}>
//               <Text style={styles.itemName}>{item.name}</Text>
//               <Text style={styles.itemSku}>SKU: {item.sku}</Text>
//               <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
//             </View>
//             <View style={styles.itemPrice}>
//               <Text style={styles.itemUnitPrice}>
//                 {formatCurrency(item.unitPrice)}
//               </Text>
//               <Text style={styles.itemTotal}>
//                 {formatCurrency(item.totalPrice)}
//               </Text>
//             </View>
//           </View>
//         ))}
//       </Card>

//       <Card style={styles.sectionCard}>
//         <Text style={styles.sectionTitle}>Staff</Text>
//         <View style={styles.staffRow}>
//           <View style={styles.staffItem}>
//             <Text style={styles.staffLabel}>Sales Attendant</Text>
//             <Text style={styles.staffName}>
//               {transaction.salesAttendantId?.firstName}{" "}
//               {transaction.salesAttendantId?.lastName}
//             </Text>
//           </View>
//           {transaction.financeAttendantId && (
//             <View style={styles.staffItem}>
//               <Text style={styles.staffLabel}>Finance Attendant</Text>
//               <Text style={styles.staffName}>
//                 {transaction.financeAttendantId?.firstName}{" "}
//                 {transaction.financeAttendantId?.lastName}
//               </Text>
//             </View>
//           )}
//           {transaction.warehouseStaffId && (
//             <View style={styles.staffItem}>
//               <Text style={styles.staffLabel}>Warehouse Staff</Text>
//               <Text style={styles.staffName}>
//                 {transaction.warehouseStaffId?.firstName}{" "}
//                 {transaction.warehouseStaffId?.lastName}
//               </Text>
//             </View>
//           )}
//         </View>
//       </Card>

//       {transaction.paymentMethod && (
//         <Card style={styles.sectionCard}>
//           <Text style={styles.sectionTitle}>Payment</Text>
//           <View style={styles.paymentGrid}>
//             <View style={styles.paymentItem}>
//               <Text style={styles.paymentLabel}>Method</Text>
//               <Chip>{transaction.paymentMethod}</Chip>
//             </View>
//             <View style={styles.paymentItem}>
//               <Text style={styles.paymentLabel}>Amount Paid</Text>
//               <Text>{formatCurrency(transaction.amountPaid)}</Text>
//             </View>
//             {transaction.changeAmount > 0 && (
//               <View style={styles.paymentItem}>
//                 <Text style={styles.paymentLabel}>Change</Text>
//                 <Text style={styles.changeText}>
//                   {formatCurrency(transaction.changeAmount)}
//                 </Text>
//               </View>
//             )}
//           </View>
//         </Card>
//       )}

//       <Card style={styles.sectionCard}>
//         <Text style={styles.sectionTitle}>Audit Trail</Text>
//         {transaction.auditTrail?.slice(0, 3).map((entry, index) => (
//           <View key={index} style={styles.auditEntry}>
//             <Text style={styles.auditAction}>{entry.action}</Text>
//             <Text style={styles.auditTime}>{formatDate(entry.timestamp)}</Text>
//           </View>
//         ))}
//         {transaction.auditTrail?.length > 3 && (
//           <Text style={styles.viewMore}>
//             + {transaction.auditTrail.length - 3} more
//           </Text>
//         )}
//       </Card>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   headerCard: { margin: 16, marginBottom: 8 },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   transactionNumber: { fontSize: 18, fontWeight: "bold" },
//   date: { fontSize: 14, color: Colors.gray, marginTop: 4 },
//   sectionCard: { marginHorizontal: 16, marginVertical: 4 },
//   sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
//   totalsGrid: { flexDirection: "row", justifyContent: "space-between" },
//   totalItem: { flex: 1, alignItems: "center" },
//   totalHighlight: {
//     backgroundColor: Colors.primaryLight,
//     borderRadius: 8,
//     padding: 8,
//   },
//   totalLabel: { fontSize: 12, color: Colors.gray },
//   totalValue: { fontSize: 16, fontWeight: "500" },
//   totalAmount: { fontSize: 20, fontWeight: "bold", color: Colors.primary },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   itemInfo: { flex: 1 },
//   itemName: { fontSize: 14, fontWeight: "500" },
//   itemSku: { fontSize: 12, color: Colors.gray },
//   itemQuantity: { fontSize: 12, color: Colors.gray },
//   itemPrice: { alignItems: "flex-end" },
//   itemUnitPrice: { fontSize: 12, color: Colors.gray },
//   itemTotal: { fontSize: 14, fontWeight: "500" },
//   staffRow: { gap: 8 },
//   staffItem: { paddingVertical: 4 },
//   staffLabel: { fontSize: 12, color: Colors.gray },
//   staffName: { fontSize: 14, fontWeight: "500" },
//   paymentGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
//   paymentItem: { minWidth: "45%" },
//   paymentLabel: { fontSize: 12, color: Colors.gray },
//   changeText: { color: Colors.success, fontWeight: "600" },
//   auditEntry: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 4,
//   },
//   auditAction: { fontSize: 14 },
//   auditTime: { fontSize: 12, color: Colors.gray },
//   viewMore: { fontSize: 14, color: Colors.primary, marginTop: 8 },
//   storeName: { fontSize: 16, fontWeight: "500" },
//   storeCode: { fontSize: 14, color: Colors.gray },
// });

// app/(stacks)/transactions/[id]/detail.jsx
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
  // Text,
  Badge,
  Divider,
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
  const { fetchTransaction, currentTransaction, isLoading } =
    useTransactionStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTransaction(id);
    }
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransaction(id, true);
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
          <Text style={styles.transactionNumber}>
            {transaction.transactionNumber}
          </Text>
          <Badge status={transaction.status}>{transaction.status}</Badge>
        </View>
        <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
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
            {transaction.items?.length || 0}
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
            {transaction.paymentMethod ? "1" : "0"}
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
          <Text style={styles.quickNavCount}>
            {transaction.receipts?.length || 0}
          </Text>
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
        <Text style={styles.storeName}>{transaction.storeId?.name}</Text>
        <Text style={styles.storeCode}>Code: {transaction.storeId?.code}</Text>
      </Card>

      <Card style={styles.sectionCard}>
        <View style={styles.totalsGrid}>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(transaction.subtotal)}
            </Text>
          </View>
          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(transaction.taxTotal)}
            </Text>
          </View>
          <View style={[styles.totalItem, styles.totalHighlight]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(transaction.totalAmount)}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          Items ({transaction.items?.length || 0})
        </Text>
        {transaction.items?.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSku}>SKU: {item.sku}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <View style={styles.itemPrice}>
              <Text style={styles.itemUnitPrice}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={styles.itemTotal}>
                {formatCurrency(item.totalPrice)}
              </Text>
            </View>
          </View>
        ))}
        {(transaction.items?.length || 0) > 3 && (
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={navigateToItems}
          >
            <Text style={styles.viewMoreText}>
              View all {transaction.items.length} items
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
            <Text style={styles.staffName}>
              {transaction.salesAttendantId?.firstName}{" "}
              {transaction.salesAttendantId?.lastName}
            </Text>
          </View>
          {transaction.financeAttendantId && (
            <View style={styles.staffItem}>
              <Text style={styles.staffLabel}>Finance Attendant</Text>
              <Text style={styles.staffName}>
                {transaction.financeAttendantId?.firstName}{" "}
                {transaction.financeAttendantId?.lastName}
              </Text>
            </View>
          )}
          {transaction.warehouseStaffId && (
            <View style={styles.staffItem}>
              <Text style={styles.staffLabel}>Warehouse Staff</Text>
              <Text style={styles.staffName}>
                {transaction.warehouseStaffId?.firstName}{" "}
                {transaction.warehouseStaffId?.lastName}
              </Text>
            </View>
          )}
        </View>
      </Card>

      {transaction.paymentMethod && (
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentGrid}>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Method</Text>
              <Chip>{transaction.paymentMethod}</Chip>
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>Amount Paid</Text>
              <Text>{formatCurrency(transaction.amountPaid)}</Text>
            </View>
            {transaction.changeAmount > 0 && (
              <View style={styles.paymentItem}>
                <Text style={styles.paymentLabel}>Change</Text>
                <Text style={styles.changeText}>
                  {formatCurrency(transaction.changeAmount)}
                </Text>
              </View>
            )}
          </View>
        </Card>
      )}

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Audit Trail</Text>
        {transaction.auditTrail?.slice(0, 3).map((entry, index) => (
          <View key={index} style={styles.auditEntry}>
            <Text style={styles.auditAction}>{entry.action}</Text>
            <Text style={styles.auditTime}>{formatDate(entry.timestamp)}</Text>
          </View>
        ))}
        {transaction.auditTrail?.length > 3 && (
          <Text style={styles.viewMore}>
            + {transaction.auditTrail.length - 3} more
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
    // minWidth: "45%",
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
