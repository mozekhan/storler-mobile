// import React from "react";
// import { View, Text, FlatList, StyleSheet } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import useTransactionStore from "../../../../../stores/transactionStore";
// import { formatDateTime } from "../../../../../utils/formatters";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
// } from "../../../../../constants/theme";
// import CustomHeader from "../../../../../components/ui/CustomHeader";

// export default function TransactionTimeline() {
//   const { id } = useLocalSearchParams();
//   const { currentTransaction } = useTransactionStore();

//   if (!currentTransaction || currentTransaction._id !== id) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.emptyText}>Loading...</Text>
//       </View>
//     );
//   }

//   const timelineEvents = [
//     {
//       key: "created",
//       label: "Transaction Created",
//       timestamp: currentTransaction.createdAt,
//       icon: "📝",
//       completed: true,
//     },
//     {
//       key: "sales_qr",
//       label: "Sales QR Generated",
//       timestamp: currentTransaction.salesTimestamp,
//       icon: "📷",
//       completed: !!currentTransaction.salesReceiptQR,
//     },
//     {
//       key: "payment",
//       label: "Payment Processed",
//       timestamp: currentTransaction.paymentTimestamp,
//       icon: "💰",
//       completed: !!currentTransaction.paymentTimestamp,
//     },
//     {
//       key: "payment_qr",
//       label: "Payment QR Generated",
//       timestamp: currentTransaction.paymentTimestamp,
//       icon: "📷",
//       completed: !!currentTransaction.paymentReceiptQR,
//     },
//     {
//       key: "release",
//       label: "Stock Released",
//       timestamp: currentTransaction.releaseTimestamp,
//       icon: "📦",
//       completed: currentTransaction.warehouseStatus === "RELEASED",
//     },
//     {
//       key: "completed",
//       label: "Transaction Completed",
//       timestamp: currentTransaction.updatedAt,
//       icon: "✅",
//       completed: currentTransaction.status === "COMPLETED",
//     },
//   ];

//   const getStatusColor = (completed) => {
//     return completed ? Colors.success : Colors.gray300;
//   };

//   return (
//     <View style={styles.container}>
//       <CustomHeader title="Transaction Timeline" />
//       <FlatList
//         style={styles.container}
//         contentContainerStyle={styles.content}
//         data={timelineEvents}
//         keyExtractor={(item) => item.key}
//         renderItem={({ item, index }) => (
//           <View style={styles.timelineItem}>
//             <View style={styles.timelineLeft}>
//               <View
//                 style={[
//                   styles.timelineDot,
//                   { backgroundColor: getStatusColor(item.completed) },
//                 ]}
//               />
//               {index < timelineEvents.length - 1 && (
//                 <View
//                   style={[
//                     styles.timelineLine,
//                     { backgroundColor: getStatusColor(item.completed) },
//                   ]}
//                 />
//               )}
//             </View>
//             <View style={styles.timelineContent}>
//               <View style={styles.timelineHeader}>
//                 <Text style={styles.timelineIcon}>{item.icon}</Text>
//                 <Text
//                   style={[
//                     styles.timelineLabel,
//                     item.completed && styles.timelineLabelCompleted,
//                   ]}
//                 >
//                   {item.label}
//                 </Text>
//               </View>
//               {item.timestamp && (
//                 <Text style={styles.timelineTime}>
//                   {formatDateTime(item.timestamp)}
//                 </Text>
//               )}
//               {!item.completed && (
//                 <Text style={styles.timelinePending}>Pending</Text>
//               )}
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.gray50 },
//   content: { padding: Spacing.md },
//   timelineItem: { flexDirection: "row", marginBottom: Spacing.md },
//   timelineLeft: { alignItems: "center", width: 24, marginRight: Spacing.md },
//   timelineDot: {
//     width: 14,
//     height: 14,
//     borderRadius: BorderRadius.full,
//     borderWidth: 2,
//     borderColor: Colors.white,
//   },
//   timelineLine: {
//     width: 2,
//     flex: 1,
//     marginVertical: 2,
//   },
//   timelineContent: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//   },
//   timelineHeader: { flexDirection: "row", alignItems: "center" },
//   timelineIcon: { fontSize: Typography.lg, marginRight: Spacing.sm },
//   timelineLabel: {
//     fontSize: Typography.sm,
//     fontWeight: "500",
//     color: Colors.gray500,
//   },
//   timelineLabelCompleted: { color: Colors.gray900 },
//   timelineTime: {
//     fontSize: Typography.xs,
//     color: Colors.gray400,
//     marginTop: 2,
//   },
//   timelinePending: {
//     fontSize: Typography.xs,
//     color: Colors.warning,
//     marginTop: 2,
//   },
//   emptyText: {
//     color: Colors.gray500,
//     textAlign: "center",
//     padding: Spacing["3xl"],
//   },
// });




























import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useTransactionStore from "../../../../../stores/transactionStore";
import { formatDateTime } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../../../../constants/theme";
import CustomHeader from "../../../../../components/ui/CustomHeader";

export default function TransactionTimeline() {
  const { id } = useLocalSearchParams();
  const { currentTransaction } = useTransactionStore();

  if (!currentTransaction || currentTransaction._id !== id) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  const receiptData = currentTransaction.receiptData || {};
  const timeline = receiptData.timeline || {};
  const qrStatus = currentTransaction.qrStatus || {};
  
  const createdAt = currentTransaction.createdAt || timeline.created;
  const salesTimestamp = currentTransaction.salesTimestamp || timeline.sales;
  const completedAt = currentTransaction.updatedAt || timeline.completed;

  const timelineEvents = [
    {
      key: "created",
      label: "Transaction Created",
      timestamp: createdAt,
      icon: "📝",
      completed: !!createdAt,
    },
    {
      key: "sales_qr",
      label: "Sales QR Generated",
      timestamp: salesTimestamp,
      icon: "📷",
      completed: !!qrStatus.salesQRScanned || !!salesTimestamp,
    },
    {
      key: "payment",
      label: "Payment Processed",
      timestamp: currentTransaction.paymentTimestamp || 
                 (receiptData.summary?.paymentMethod !== "N/A" ? createdAt : null),
      icon: "💰",
      completed: receiptData.summary?.paymentMethod !== "N/A" || 
                 currentTransaction.paymentStatus === "COMPLETED",
    },
    {
      key: "payment_qr",
      label: "Payment QR Generated",
      timestamp: currentTransaction.paymentTimestamp || 
                 (receiptData.summary?.paymentMethod !== "N/A" ? createdAt : null),
      icon: "📷",
      completed: !!qrStatus.paymentQRScanned || 
                 receiptData.summary?.paymentMethod !== "N/A",
    },
    {
      key: "release",
      label: "Stock Released",
      timestamp: currentTransaction.releaseTimestamp,
      icon: "📦",
      completed: currentTransaction.warehouseStatus === "RELEASED" || 
                 !!qrStatus.releaseQRScanned,
    },
    {
      key: "completed",
      label: "Transaction Completed",
      timestamp: completedAt,
      icon: "✅",
      completed: currentTransaction.status === "COMPLETED" || !!completedAt,
    },
  ];

  const getStatusColor = (completed) => {
    return completed ? Colors.success : Colors.gray300;
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Transaction Timeline" />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={timelineEvents}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => (
          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: getStatusColor(item.completed) },
                ]}
              />
              {index < timelineEvents.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    { backgroundColor: getStatusColor(item.completed) },
                  ]}
                />
              )}
            </View>
            <View style={styles.timelineContent}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.timelineLabel,
                    item.completed && styles.timelineLabelCompleted,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              {item.timestamp && (
                <Text style={styles.timelineTime}>
                  {formatDateTime(item.timestamp)}
                </Text>
              )}
              {!item.completed && (
                <Text style={styles.timelinePending}>Pending</Text>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  timelineItem: { flexDirection: "row", marginBottom: Spacing.md },
  timelineLeft: { alignItems: "center", width: 24, marginRight: Spacing.md },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  timelineHeader: { flexDirection: "row", alignItems: "center" },
  timelineIcon: { fontSize: Typography.lg, marginRight: Spacing.sm },
  timelineLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray500,
  },
  timelineLabelCompleted: { color: Colors.gray900 },
  timelineTime: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: 2,
  },
  timelinePending: {
    fontSize: Typography.xs,
    color: Colors.warning,
    marginTop: 2,
  },
  emptyText: {
    color: Colors.gray500,
    textAlign: "center",
    padding: Spacing["3xl"],
  },
});