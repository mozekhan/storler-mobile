// app/(app)/(stacks)/transactions/[id]/timeline.jsx
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
  Shadows,
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
  
  // Get the transaction status to determine which steps are completed
  const transactionStatus = currentTransaction.status || "PENDING";

  // Get timestamps from various sources
  const createdAt = currentTransaction.createdAt || timeline.created || null;
  const salesTimestamp = currentTransaction.salesTimestamp || timeline.sales || null;
  const paymentTimestamp = currentTransaction.paymentTimestamp || timeline.payment || null;
  const releaseTimestamp = currentTransaction.releaseTimestamp || timeline.release || null;
  const completedAt = currentTransaction.updatedAt || currentTransaction.completedAt || timeline.completed || null;

  // Check if QR codes exist
  const hasSalesQR = !!currentTransaction.salesQR || !!currentTransaction.salesQRData;
  const hasPaymentQR = !!currentTransaction.paymentQR || !!currentTransaction.paymentQRData;
  const hasReleaseQR = !!currentTransaction.releaseQR || !!currentTransaction.releaseQRData;
  const hasInvoiceQR = !!currentTransaction.invoiceQR || !!currentTransaction.invoiceQRData;

  // Determine which steps are completed based on transaction status
  const isStepCompleted = (stepName) => {
    switch (stepName) {
      case "created":
        return true; // Always completed if transaction exists
      case "sales_qr":
        return transactionStatus === "SALES_QR" || 
               transactionStatus === "PAID" || 
               transactionStatus === "PAYMENT_QR" || 
               transactionStatus === "RELEASED" || 
               transactionStatus === "RELEASE_QR" || 
               transactionStatus === "COMPLETED";
      case "payment":
        return transactionStatus === "PAID" || 
               transactionStatus === "PAYMENT_QR" || 
               transactionStatus === "RELEASED" || 
               transactionStatus === "RELEASE_QR" || 
               transactionStatus === "COMPLETED";
      case "payment_qr":
        return transactionStatus === "PAYMENT_QR" || 
               transactionStatus === "RELEASED" || 
               transactionStatus === "RELEASE_QR" || 
               transactionStatus === "COMPLETED";
      case "release":
        return transactionStatus === "RELEASED" || 
               transactionStatus === "RELEASE_QR" || 
               transactionStatus === "COMPLETED";
      case "release_qr":
        return transactionStatus === "RELEASE_QR" || 
               transactionStatus === "COMPLETED";
      case "invoice_qr":
        return transactionStatus === "COMPLETED";
      case "completed":
        return transactionStatus === "COMPLETED";
      default:
        return false;
    }
  };

  // Build all timeline events (show all steps)
  const timelineEvents = [
    {
      key: "created",
      label: "Transaction Created",
      timestamp: createdAt,
      icon: "📝",
      completed: isStepCompleted("created"),
      order: 0,
      description: "Transaction has been created and is ready for sales",
    },
    {
      key: "sales_qr",
      label: "Sales QR Generated",
      timestamp: hasSalesQR ? (salesTimestamp || createdAt) : null,
      icon: "📷",
      completed: isStepCompleted("sales_qr"),
      order: 1,
      description: "Sales QR code generated for payment processing",
      isNext: transactionStatus === "PENDING",
    },
    {
      key: "payment",
      label: "Payment Processed",
      timestamp: paymentTimestamp || null,
      icon: "💰",
      completed: isStepCompleted("payment"),
      order: 2,
      description: "Payment has been received and verified",
      isNext: transactionStatus === "SALES_QR",
    },
    {
      key: "payment_qr",
      label: "Payment QR Generated",
      timestamp: hasPaymentQR ? (paymentTimestamp || null) : null,
      icon: "📷",
      completed: isStepCompleted("payment_qr"),
      order: 3,
      description: "Payment QR code generated for warehouse release",
      isNext: transactionStatus === "PAID",
    },
    {
      key: "release",
      label: "Stock Released",
      timestamp: releaseTimestamp || null,
      icon: "📦",
      completed: isStepCompleted("release"),
      order: 4,
      description: "Items have been released from warehouse",
      isNext: transactionStatus === "PAYMENT_QR",
    },
    {
      key: "release_qr",
      label: "Release QR Generated",
      timestamp: hasReleaseQR ? (releaseTimestamp || null) : null,
      icon: "📷",
      completed: isStepCompleted("release_qr"),
      order: 5,
      description: "Release QR code generated for invoice",
      isNext: transactionStatus === "RELEASED",
    },
    {
      key: "invoice_qr",
      label: "Invoice QR Generated",
      timestamp: hasInvoiceQR ? (completedAt || null) : null,
      icon: "📋",
      completed: isStepCompleted("invoice_qr"),
      order: 6,
      description: "Final invoice QR code generated",
      isNext: transactionStatus === "RELEASE_QR",
    },
    {
      key: "completed",
      label: "Transaction Completed",
      timestamp: completedAt || null,
      icon: "✅",
      completed: isStepCompleted("completed"),
      order: 7,
      description: "Transaction has been fully completed",
      isNext: transactionStatus === "INVOICE_QR",
    },
  ];

  // Sort events by order
  timelineEvents.sort((a, b) => a.order - b.order);

  const getStatusColor = (completed) => {
    return completed ? Colors.success : Colors.gray300;
  };

  // Find the next step (first incomplete step)
  const getNextStepIndex = () => {
    return timelineEvents.findIndex(event => !event.completed);
  };

  const nextStepIndex = getNextStepIndex();

  return (
    <View style={styles.container}>
      <CustomHeader title="Transaction Timeline" />
      
      {/* Status Indicator */}
      <View style={styles.statusHeader}>
        <Text style={styles.statusLabel}>Current Status:</Text>
        <View style={[styles.statusBadge, { backgroundColor: Colors.primary + "20" }]}>
          <Text style={[styles.statusBadgeText, { color: Colors.primary }]}>
            {transactionStatus}
          </Text>
        </View>
      </View>

      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={timelineEvents}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          const isLast = index === timelineEvents.length - 1;
          const showLine = !isLast;
          const isNextStep = index === nextStepIndex;
          const isCompleted = item.completed;
          
          return (
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineDot,
                    isCompleted && styles.timelineDotCompleted,
                    !isCompleted && isNextStep && styles.timelineDotCurrent,
                    !isCompleted && !isNextStep && styles.timelineDotPending,
                  ]}
                >
                  {isCompleted && (
                    <Text style={styles.timelineDotCheck}>✓</Text>
                  )}
                  {!isCompleted && isNextStep && (
                    <View style={styles.timelineDotPulse} />
                  )}
                </View>
                {showLine && (
                  <View
                    style={[
                      styles.timelineLine,
                      isCompleted ? styles.timelineLineCompleted : styles.timelineLinePending,
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
                      isCompleted && styles.timelineLabelCompleted,
                      !isCompleted && isNextStep && styles.timelineLabelCurrent,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>Done</Text>
                    </View>
                  )}
                  {!isCompleted && isNextStep && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>In Progress</Text>
                    </View>
                  )}
                  {!isCompleted && !isNextStep && (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>Pending</Text>
                    </View>
                  )}
                </View>
                {item.description && (
                  <Text style={styles.timelineDescription}>{item.description}</Text>
                )}
                {item.timestamp && (
                  <Text style={styles.timelineTime}>
                    {formatDateTime(item.timestamp)}
                  </Text>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No timeline events available</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md, paddingBottom: Spacing["4xl"] },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  statusLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray600,
    marginRight: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusBadgeText: {
    fontSize: Typography.xs,
    fontWeight: "600",
  },
  timelineItem: { 
    flexDirection: "row", 
    marginBottom: Spacing.md,
  },
  timelineLeft: { 
    alignItems: "center", 
    width: 30, 
    marginRight: Spacing.md,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.white,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineDotCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  timelineDotCurrent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timelineDotPending: {
    backgroundColor: Colors.gray200,
    borderColor: Colors.gray300,
  },
  timelineDotCheck: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  timelineDotPulse: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
    minHeight: 20,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.success,
  },
  timelineLinePending: {
    backgroundColor: Colors.gray300,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  timelineHeader: { 
    flexDirection: "row", 
    alignItems: "center",
    flexWrap: "wrap",
  },
  timelineIcon: { 
    fontSize: Typography.lg, 
    marginRight: Spacing.sm,
    width: 24,
  },
  timelineLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray500,
    flex: 1,
  },
  timelineLabelCompleted: { 
    color: Colors.gray900,
    fontWeight: "600",
  },
  timelineLabelCurrent: {
    color: Colors.primary,
    fontWeight: "600",
  },
  timelineDescription: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: 2,
    marginLeft: 4,
    fontStyle: "italic",
  },
  timelineTime: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: 2,
    paddingLeft: 4,
  },
  completedBadge: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: Spacing.xs,
  },
  completedBadgeText: {
    color: Colors.white,
    fontSize: Typography.xs,
    fontWeight: "600",
  },
  currentBadge: {
    backgroundColor: Colors.primary + "20",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  currentBadgeText: {
    color: Colors.primary,
    fontSize: Typography.xs,
    fontWeight: "600",
  },
  pendingBadge: {
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: Spacing.xs,
  },
  pendingBadgeText: {
    color: Colors.gray500,
    fontSize: Typography.xs,
    fontWeight: "500",
  },
  emptyContainer: { 
    paddingVertical: Spacing["4xl"], 
    alignItems: "center" 
  },
  emptyText: {
    color: Colors.gray500,
    textAlign: "center",
    padding: Spacing["3xl"],
  },
});