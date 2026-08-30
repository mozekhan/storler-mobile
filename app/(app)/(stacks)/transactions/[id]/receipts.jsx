// app/(app)/(stacks)/transactions/[id]/receipts.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FileText, Eye, Printer } from "lucide-react-native";
import useTransactionStore from "../../../../../stores/transactionStore";
import { formatDate } from "../../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../../constants/theme";
import CustomHeader from "../../../../../components/ui/CustomHeader";

// Custom Alert Modal Component
const CustomAlertModal = ({ visible, title, message, buttons, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.alertOverlay}>
        <View style={styles.alertContainer}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.alertCloseButton}>
              <XCircle size={20} color={Colors.gray400} />
            </TouchableOpacity>
          </View>
          <View style={styles.alertBody}>
            <Text style={styles.alertMessage}>{message}</Text>
          </View>
          <View style={styles.alertFooter}>
            {buttons && buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.alertButton,
                  btn.style === 'cancel' ? styles.alertCancelButton : styles.alertPrimaryButton,
                  index > 0 && styles.alertButtonMargin
                ]}
                onPress={() => {
                  if (btn.onPress) btn.onPress();
                  onClose();
                }}
              >
                <Text style={btn.style === 'cancel' ? styles.alertCancelText : styles.alertPrimaryText}>
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function TransactionReceipts() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { currentTransaction } = useTransactionStore();
  const [alertModal, setAlertModal] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [],
    onClose: null,
  });

  const showAlert = (title, message, buttons = [{ text: "OK" }]) => {
    return new Promise((resolve) => {
      const wrappedButtons = buttons.map(btn => ({
        ...btn,
        onPress: () => {
          if (btn.onPress) btn.onPress();
          resolve();
        }
      }));
      setAlertModal({
        visible: true,
        title,
        message,
        buttons: wrappedButtons,
        onClose: resolve,
      });
    });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, visible: false }));
    if (alertModal.onClose) alertModal.onClose();
  };

  if (!currentTransaction || currentTransaction._id !== id) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  const receiptData = currentTransaction.receiptData || {};
  
  // Build receipts from available data
  const receipts = [];
  
  // Sales Receipt
  if (receiptData.receiptType || currentTransaction.salesReceiptPrinted !== undefined) {
    receipts.push({
      _id: `${currentTransaction._id}-sales`,
      receiptNumber: `${currentTransaction.transactionNumber || "SALES"}-001`,
      type: "SALES",
      printed: currentTransaction.salesReceiptPrinted || false,
      createdAt: receiptData.generatedAt || currentTransaction.salesTimestamp || currentTransaction.createdAt,
      data: receiptData,
      icon: "📄",
    });
  }
  
  // Payment Receipt
  const paymentMethod = receiptData.summary?.paymentMethod || currentTransaction.paymentMethod;
  if (paymentMethod && paymentMethod !== "N/A") {
    receipts.push({
      _id: `${currentTransaction._id}-payment`,
      receiptNumber: `${currentTransaction.transactionNumber || "PAYMENT"}-001`,
      type: "PAYMENT",
      printed: currentTransaction.paymentReceiptPrinted || false,
      createdAt: receiptData.generatedAt || currentTransaction.updatedAt || currentTransaction.paymentTimestamp,
      data: receiptData,
      icon: "💰",
    });
  }
  
  // Invoice Receipt
  if (currentTransaction.status === "COMPLETED" || currentTransaction.finalInvoicePrinted) {
    receipts.push({
      _id: `${currentTransaction._id}-invoice`,
      receiptNumber: `${currentTransaction.transactionNumber || "INVOICE"}-001`,
      type: "INVOICE",
      printed: currentTransaction.finalInvoicePrinted || false,
      createdAt: currentTransaction.updatedAt || currentTransaction.completedAt,
      data: receiptData,
      icon: "📋",
    });
  }

  const getTypeLabel = (type) => {
    const labels = {
      SALES: "Sales Receipt",
      PAYMENT: "Payment Receipt",
      INVOICE: "Invoice",
    };
    return labels[type] || type;
  };

  const viewReceipt = (receipt) => {
    router.push(`/receipts/${receipt._id}`);
  };

  const printReceipt = async (receipt) => {
    await showAlert("Print", `Printing ${receipt.type} receipt...`);
  };

  if (receipts.length === 0) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Transaction Receipts" />
        <View style={styles.emptyContainer}>
          <FileText size={48} color={Colors.gray300} />
          <Text style={styles.emptyText}>No receipts available</Text>
          <Text style={styles.emptySubText}>
            Receipts will appear once the transaction is processed
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Transaction Receipts" />
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={receipts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.receiptItem}>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptIcon}>{item.icon}</Text>
              <View style={styles.receiptInfo}>
                <Text style={styles.receiptNumber}>{item.receiptNumber}</Text>
                <Text style={styles.receiptType}>{getTypeLabel(item.type)}</Text>
              </View>
              <View style={styles.receiptActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => viewReceipt(item)}
                >
                  <Eye size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => printReceipt(item)}
                >
                  <Printer size={18} color={Colors.gray600} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.receiptFooter}>
              <Text style={styles.receiptDate}>
                {formatDate(item.createdAt)}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  item.printed ? styles.statusPrinted : styles.statusNotPrinted,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.printed
                      ? styles.statusPrintedText
                      : styles.statusNotPrintedText,
                  ]}
                >
                  {item.printed ? "Printed" : "Not Printed"}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
      <CustomAlertModal
        visible={alertModal.visible}
        title={alertModal.title}
        message={alertModal.message}
        buttons={alertModal.buttons}
        onClose={closeAlert}
      />
    </View>
  );
}

// Import Modal and XCircle at the top
import { Modal } from "react-native";
import { XCircle } from "lucide-react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  receiptItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  receiptHeader: { flexDirection: "row", alignItems: "center" },
  receiptIcon: { fontSize: Typography.xl, marginRight: Spacing.md },
  receiptInfo: { flex: 1 },
  receiptNumber: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
  },
  receiptType: { fontSize: Typography.sm, color: Colors.gray500 },
  receiptActions: { flexDirection: "row" },
  actionButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  receiptFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  receiptDate: { fontSize: Typography.xs, color: Colors.gray400 },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: { fontSize: Typography.xs, fontWeight: "500" },
  statusPrinted: { backgroundColor: Colors.success + "20" },
  statusPrintedText: { color: Colors.success },
  statusNotPrinted: { backgroundColor: Colors.warning + "20" },
  statusNotPrintedText: { color: Colors.warning },
  emptyContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: Spacing["4xl"],
  },
  emptyText: { 
    color: Colors.gray500, 
    marginTop: Spacing.md,
    fontSize: Typography.lg,
  },
  emptySubText: {
    color: Colors.gray400,
    marginTop: Spacing.xs,
    textAlign: "center",
    fontSize: Typography.sm,
  },
  // Alert Modal Styles
  alertOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  alertContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius["2xl"],
    width: "100%",
    maxWidth: 380,
    ...Shadows.lg,
    overflow: "hidden",
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  alertTitle: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
    flex: 1,
  },
  alertCloseButton: {
    padding: Spacing.xs,
  },
  alertBody: {
    padding: Spacing.lg,
    paddingVertical: Spacing["2xl"],
  },
  alertMessage: {
    fontSize: Typography.md,
    color: Colors.gray700,
    lineHeight: 24,
    textAlign: "center",
  },
  alertFooter: {
    flexDirection: "row",
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    justifyContent: "flex-end",
  },
  alertButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    minWidth: 80,
    alignItems: "center",
  },
  alertButtonMargin: {
    marginLeft: Spacing.sm,
  },
  alertPrimaryButton: {
    backgroundColor: Colors.primary,
  },
  alertCancelButton: {
    backgroundColor: Colors.gray200,
  },
  alertPrimaryText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: Typography.sm,
  },
  alertCancelText: {
    color: Colors.gray700,
    fontWeight: "600",
    fontSize: Typography.sm,
  },
});