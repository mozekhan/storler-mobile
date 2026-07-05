import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { CreditCard, CheckCircle, XCircle, Clock, DollarSign, User, Calendar } from 'lucide-react-native';
import Badge from '../ui/Badge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const PaymentDetailView = ({ payment }) => {
  const getStatusIcon = (status) => {
    const icons = {
      PENDING: Clock,
      COMPLETED: CheckCircle,
      FAILED: XCircle,
      REFUNDED: XCircle,
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: Colors.warning,
      COMPLETED: Colors.success,
      FAILED: Colors.error,
      REFUNDED: Colors.warning,
    };
    return colors[status] || Colors.gray500;
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      CASH: '💵',
      CARD: '💳',
      TRANSFER: '🏦',
      MOBILE_MONEY: '📱',
      CREDIT: '💳',
    };
    return icons[method] || '💰';
  };

  const StatusIcon = getStatusIcon(payment.status);
  const statusColor = getStatusColor(payment.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.iconContainer}>
            <CreditCard size={24} color={Colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.paymentNumber}>{payment.paymentNumber}</Text>
            <Text style={styles.paymentMethod}>{getPaymentMethodIcon(payment.method)} {payment.method}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <StatusIcon size={12} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>{payment.status}</Text>
          </View>
        </View>
        <Text style={styles.paymentDate}>{formatDateTime(payment.processedAt)}</Text>
      </View>

      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Amount</Text>
        <Text style={styles.amountValue}>{formatCurrency(payment.amount)}</Text>
        {payment.change > 0 && (
          <Text style={styles.changeText}>Change: {formatCurrency(payment.change)}</Text>
        )}
      </View>

      <View style={styles.section}>
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
          <Text style={styles.detailLabel}>Transaction</Text>
          <Text style={styles.detailValue}>{payment.transactionId?.transactionNumber}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Processor Information</Text>
        <View style={styles.detailRow}>
          <User size={16} color={Colors.gray500} />
          <Text style={styles.detailLabel}>Processed By</Text>
          <Text style={styles.detailValue}>
            {payment.processedBy?.firstName} {payment.processedBy?.lastName}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={16} color={Colors.gray500} />
          <Text style={styles.detailLabel}>Processed At</Text>
          <Text style={styles.detailValue}>{formatDateTime(payment.processedAt)}</Text>
        </View>
      </View>

      {payment.cardDetails && (
        <View style={styles.section}>
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
            <Text style={styles.detailValue}>{payment.cardDetails.expiryMonth}/{payment.cardDetails.expiryYear}</Text>
          </View>
        </View>
      )}

      {payment.transferDetails && (
        <View style={styles.section}>
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
        <View style={styles.section}>
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
        <View style={[styles.section, styles.refundSection]}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: { flex: 1 },
  paymentNumber: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900 },
  paymentMethod: { fontSize: Typography.sm, color: Colors.gray500 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm, gap: 4 },
  statusText: { fontSize: Typography.xs, fontWeight: '500' },
  paymentDate: { fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.xs },
  amountCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  amountLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  amountValue: { fontSize: Typography['3xl'], fontWeight: 'bold', color: Colors.primary },
  changeText: { fontSize: Typography.sm, color: Colors.success, marginTop: Spacing.xs },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: Typography.md, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500, flex: 1 },
  detailValue: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900, textAlign: 'right' },
  refundSection: { borderWidth: 1, borderColor: Colors.warning + '30' },
});

export default PaymentDetailView;