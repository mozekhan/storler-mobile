import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DollarSign, ArrowLeft, AlertCircle } from 'lucide-react-native';
import PaymentService from '../../../../../services/paymentService';
import { formatCurrency, formatDateTime } from '../../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../../constants/theme';

export default function RefundPayment() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      const data = await PaymentService.getPaymentsByTransaction(id);
      setPayment(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter a refund reason');
      return;
    }

    setSubmitting(true);
    try {
      await PaymentService.refundPayment(id, reason.trim());
      Alert.alert('Success', 'Payment refunded successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to refund payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!payment) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color={Colors.error} />
        <Text style={styles.errorText}>Payment not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (payment.status !== 'COMPLETED') {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color={Colors.warning} />
        <Text style={styles.errorText}>Only completed payments can be refunded</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.paymentCard}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Number</Text>
          <Text style={styles.detailValue}>{payment.paymentNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={[styles.detailValue, styles.amountValue]}>{formatCurrency(payment.amount)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Method</Text>
          <Text style={styles.detailValue}>{payment.method}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Processed By</Text>
          <Text style={styles.detailValue}>
            {payment.processedBy?.firstName} {payment.processedBy?.lastName}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{formatDateTime(payment.processedAt)}</Text>
        </View>
      </View>

      <View style={styles.refundCard}>
        <Text style={styles.sectionTitle}>Refund Information</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Refund Reason <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Enter reason for refund"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.warningContainer}>
          <AlertCircle size={16} color={Colors.warning} />
          <Text style={styles.warningText}>
            This action cannot be undone. The payment will be marked as refunded.
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.refundButton, submitting && styles.buttonDisabled]}
            onPress={handleRefund}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.refundButtonText}>Process Refund</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md, paddingBottom: Spacing['3xl'] },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing['2xl'] },
  errorText: { fontSize: Typography.lg, color: Colors.gray700, marginTop: Spacing.md, textAlign: 'center' },
  paymentCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  detailValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  amountValue: { color: Colors.primary, fontSize: Typography.md },
  refundCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  field: { marginBottom: Spacing.md },
  label: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray700, marginBottom: Spacing.xs },
  required: { color: Colors.error },
  reasonInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  warningText: {
    fontSize: Typography.sm,
    color: Colors.warning,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  buttonRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  button: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: '600', color: Colors.gray700 },
  refundButton: { backgroundColor: Colors.error },
  refundButtonText: { fontWeight: '600', color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
  backButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing['2xl'], borderRadius: BorderRadius.lg, marginTop: Spacing.md },
  backButtonText: { color: Colors.white, fontWeight: '600' },
});