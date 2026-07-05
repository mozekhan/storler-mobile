import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { QrCode, CheckCircle, XCircle, AlertCircle } from "lucide-react-native";
import TransactionService from "../../../services/transactionService";
import QRService from "../../../services/qrService";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../constants/theme";

export default function QRValidation() {
  const router = useRouter();
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleValidate = async () => {
    if (!qrData.trim()) {
      Alert.alert("Error", "Please enter QR data");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // First validate with QR service
      const validation = await QRService.validateQR(qrData.trim());

      if (!validation.valid) {
        setResult({
          valid: false,
          message: validation.error || "Invalid QR code",
          data: null,
        });
        setLoading(false);
        return;
      }

      // Then validate with backend
      const result = await TransactionService.validateQR(qrData.trim());

      if (result && result.isValid) {
        setResult({
          valid: true,
          message: "QR code is valid",
          data: result,
        });
      } else {
        setResult({
          valid: false,
          message: result?.error || "Invalid QR code",
          data: null,
        });
      }
    } catch (error) {
      setResult({
        valid: false,
        message: error.response?.data?.message || "Failed to validate QR code",
        data: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewTransaction = () => {
    if (result?.data?.transaction) {
      router.push({
        pathname: "/(app)/(modals)/transaction-detail",
        params: { id: result.data.transaction._id },
      });
    }
  };

  const handleProcessAction = () => {
    if (!result?.data) return;

    const { transaction, qrType, nextAction } = result.data;

    if (qrType === "SALES" && nextAction === "PROCEED_TO_PAYMENT") {
      router.push({
        pathname: "/(app)/(modals)/payment-modal",
        params: { transactionId: transaction._id },
      });
    } else if (qrType === "PAYMENT" && nextAction === "PROCEED_TO_WAREHOUSE") {
      router.push({
        pathname: "/(app)/(tabs)/warehouse",
        params: { transactionId: transaction._id },
      });
    } else {
      Alert.alert("Info", `Next action: ${nextAction || "View details"}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.header}>
          <QrCode size={24} color={Colors.primary} />
          <Text style={styles.title}>Validate QR Code</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>QR Data</Text>
          <TextInput
            style={styles.input}
            placeholder="Paste QR data here..."
            value={qrData}
            onChangeText={setQrData}
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <TouchableOpacity
          style={[styles.validateButton, loading && styles.buttonDisabled]}
          onPress={handleValidate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.validateButtonText}>Validate QR</Text>
          )}
        </TouchableOpacity>

        {result && (
          <View
            style={[
              styles.resultContainer,
              result.valid ? styles.resultValid : styles.resultInvalid,
            ]}
          >
            <View style={styles.resultHeader}>
              {result.valid ? (
                <CheckCircle size={24} color={Colors.success} />
              ) : (
                <XCircle size={24} color={Colors.error} />
              )}
              <Text
                style={[
                  styles.resultMessage,
                  result.valid
                    ? styles.resultValidText
                    : styles.resultInvalidText,
                ]}
              >
                {result.message}
              </Text>
            </View>

            {result.valid && result.data && (
              <View style={styles.resultDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transaction</Text>
                  <Text style={styles.detailValue}>
                    {result.data.transaction?.transactionNumber}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={styles.detailValue}>{result.data.qrType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={styles.detailValue}>
                    {result.data.transaction?.status}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total</Text>
                  <Text style={styles.detailValue}>
                    ${result.data.transaction?.totalAmount?.toFixed(2)}
                  </Text>
                </View>

                {result.data.nextAction && (
                  <View style={styles.nextActionContainer}>
                    <AlertCircle size={16} color={Colors.primary} />
                    <Text style={styles.nextActionText}>
                      Next Action: {result.data.nextAction}
                    </Text>
                  </View>
                )}

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.viewButton]}
                    onPress={handleViewTransaction}
                  >
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>

                  {result.data.nextAction && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.processButton]}
                      onPress={handleProcessAction}
                    >
                      <Text style={styles.processButtonText}>Process</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    ...Shadows.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
    marginLeft: Spacing.sm,
  },
  field: { marginBottom: Spacing.md },
  label: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: Colors.white,
  },
  validateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  validateButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: Typography.md,
  },
  buttonDisabled: { opacity: 0.7 },
  resultContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  resultValid: {
    backgroundColor: Colors.success + "10",
    borderColor: Colors.success + "30",
  },
  resultInvalid: {
    backgroundColor: Colors.error + "10",
    borderColor: Colors.error + "30",
  },
  resultHeader: { flexDirection: "row", alignItems: "center" },
  resultMessage: {
    fontSize: Typography.sm,
    fontWeight: "500",
    marginLeft: Spacing.sm,
  },
  resultValidText: { color: Colors.success },
  resultInvalidText: { color: Colors.error },
  resultDetails: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
  },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  nextActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary + "10",
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  nextActionText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  viewButton: { backgroundColor: Colors.gray200 },
  viewButtonText: { fontWeight: "600", color: Colors.gray700 },
  processButton: { backgroundColor: Colors.primary },
  processButtonText: { fontWeight: "600", color: Colors.white },
});
