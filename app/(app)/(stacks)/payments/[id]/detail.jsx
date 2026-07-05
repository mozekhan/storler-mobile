import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Share2, CreditCard, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import PaymentService from '../../../../../services/paymentService';
import { formatCurrency, formatDateTime } from '../../../../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../../../constants/theme';

export default function PaymentDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);

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

  const getStatusStyles = (status) => {
    const stylesMap = {
      'PENDING': { container: styles.statusPending, text: styles.statusPendingText, icon: Clock },
      'COMPLETED': { container: styles.statusCompleted, text: styles.statusCompletedText, icon: CheckCircle },
      'FAILED': { container: styles.statusFailed, text: styles.statusFailedText, icon: XCircle },
      'REFUNDED': { container: styles.statusRefunded, text: styles.statusRefundedText, icon: XCircle },
    };
    return stylesMap[status] || { container: styles.statusDefault, text: styles.statusDefaultText, icon: Clock };
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
        <Text style={styles.errorText}>Payment not found</Text>
      </View>
    );
  }

  const statusStyles = getStatusStyles(payment.status);
  const StatusIcon = statusStyles.icon;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerLabel}>Payment Number</Text>
            <Text style={styles.headerNumber}>{payment.paymentNumber}</Text>
          </View>
          <View style={[styles.statusBadge, statusStyles.container]}>
            <StatusIcon size={14} color={statusStyles.text.color} />
            <Text style={[styles.statusText, statusStyles.text]}>{payment.status}</Text>
          </View>
        </View>
        <Text style={styles.headerDate}>{formatDateTime(payment.processedAt)}</Text>
      </View>

      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Amount</Text>
        <Text style={styles.amountValue}>{formatCurrency(payment.amount)}</Text>
        {payment.change > 0 && (
          <Text style={styles.changeText}>Change: {formatCurrency(payment.change)}</Text>
        )}
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Method</Text>
          <Text style={styles.detailValue}>{payment.method}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount Paid</Text>
          <Text style={styles.detailValue}>{formatCurrency(payment.amountPaid)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reference</Text>
          <Text style={styles.detailValue}>{payment.reference}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Processed By</Text>
          <Text style={styles.detailValue}>
            {payment.processedBy?.firstName} {payment.processedBy?.lastName}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Processed At</Text>
          <Text style={styles.detailValue}>{formatDateTime(payment.processedAt)}</Text>
        </View>
      </View>

      {payment.cardDetails && (
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Card Type</Text>
            <Text style={styles.detailValue}>{payment.cardDetails.cardType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last 4</Text>
            <Text style={styles.detailValue}>**** {payment.cardDetails.last4}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expiry</Text>
            <Text style={styles.detailValue}>
              {payment.cardDetails.expiryMonth}/{payment.cardDetails.expiryYear}
            </Text>
          </View>
        </View>
      )}

      {payment.transferDetails && (
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Transfer Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bank</Text>
            <Text style={styles.detailValue}>{payment.transferDetails.bankName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account</Text>
            <Text style={styles.detailValue}>{payment.transferDetails.accountNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reference</Text>
            <Text style={styles.detailValue}>{payment.transferDetails.reference}</Text>
          </View>
        </View>
      )}

      {payment.mobileMoneyDetails && (
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Mobile Money Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provider</Text>
            <Text style={styles.detailValue}>{payment.mobileMoneyDetails.provider}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{payment.mobileMoneyDetails.phoneNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>{payment.mobileMoneyDetails.transactionId}</Text>
          </View>
        </View>
      )}

      {payment.status === 'REFUNDED' && (
        <View style={styles.refundCard}>
          <Text style={styles.sectionTitle}>Refund Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Refunded By</Text>
            <Text style={styles.detailValue}>
              {payment.refundedBy?.firstName} {payment.refundedBy?.lastName}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Refunded At</Text>
            <Text style={styles.detailValue}>{formatDateTime(payment.refundedAt)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reason</Text>
            <Text style={styles.detailValue}>{payment.refundReason}</Text>
          </View>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionButton, styles.backButton]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.gray700} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={() => {
            Alert.alert('Share', 'Share functionality coming soon');
          }}
        >
          <Share2 size={20} color={Colors.white} />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.gray500 },
  headerCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  headerNumber: { fontSize: Typography.xl, fontWeight: 'bold', color: Colors.gray900 },
  headerDate: { fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.sm },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.sm, gap: 4 },
  statusText: { fontSize: Typography.xs, fontWeight: '500' },
  statusPending: { backgroundColor: Colors.warning + '20' },
  statusPendingText: { color: Colors.warning },
  statusCompleted: { backgroundColor: Colors.success + '20' },
  statusCompletedText: { color: Colors.success },
  statusFailed: { backgroundColor: Colors.error + '20' },
  statusFailedText: { color: Colors.error },
  statusRefunded: { backgroundColor: Colors.warning + '20' },
  statusRefundedText: { color: Colors.warning },
  statusDefault: { backgroundColor: Colors.gray200 },
  statusDefaultText: { color: Colors.gray700 },
  amountCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, alignItems: 'center', ...Shadows.sm },
  amountLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  amountValue: { fontSize: Typography['3xl'], fontWeight: 'bold', color: Colors.primary },
  changeText: { fontSize: Typography.sm, color: Colors.success, marginTop: Spacing.xs },
  detailsCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm },
  sectionTitle: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  detailValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900, flex: 1, textAlign: 'right' },
  refundCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.warning + '30', ...Shadows.sm },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  actionButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backButton: { backgroundColor: Colors.gray200 },
  backButtonText: { color: Colors.gray700, fontWeight: '600', marginLeft: Spacing.sm },
  shareButton: { backgroundColor: Colors.primary },
  shareButtonText: { color: Colors.white, fontWeight: '600', marginLeft: Spacing.sm },
});