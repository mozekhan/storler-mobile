import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const StatusBadge = ({ status, size = 'md', style, textStyle, ...props }) => {
  const getStatusStyles = () => {
    const statusMap = {
      'PENDING': { container: styles.pending, text: styles.pendingText },
      'SALES_QR': { container: styles.salesQR, text: styles.salesQRText },
      'PAID': { container: styles.paid, text: styles.paidText },
      'PAYMENT_QR': { container: styles.paymentQR, text: styles.paymentQRText },
      'RELEASED': { container: styles.released, text: styles.releasedText },
      'COMPLETED': { container: styles.completed, text: styles.completedText },
      'CANCELLED': { container: styles.cancelled, text: styles.cancelledText },
      'REFUNDED': { container: styles.refunded, text: styles.refundedText },
      'ACTIVE': { container: styles.active, text: styles.activeText },
      'INACTIVE': { container: styles.inactive, text: styles.inactiveText },
    };
    return statusMap[status] || { container: styles.default, text: styles.defaultText };
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { paddingHorizontal: Spacing.sm, paddingVertical: 2 };
      case 'md': return { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs };
      case 'lg': return { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm };
      default: return { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs };
    }
  };

  const statusStyles = getStatusStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.badge, statusStyles.container, sizeStyles, style]} {...props}>
      <Text style={[styles.text, statusStyles.text, textStyle]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: Typography.xs,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  pending: { backgroundColor: Colors.warning + '20' },
  pendingText: { color: Colors.warning },
  salesQR: { backgroundColor: Colors.primary + '20' },
  salesQRText: { color: Colors.primary },
  paid: { backgroundColor: '#8B5CF6' + '20' },
  paidText: { color: '#8B5CF6' },
  paymentQR: { backgroundColor: '#8B5CF6' + '20' },
  paymentQRText: { color: '#8B5CF6' },
  released: { backgroundColor: '#EC4899' + '20' },
  releasedText: { color: '#EC4899' },
  completed: { backgroundColor: Colors.success + '20' },
  completedText: { color: Colors.success },
  cancelled: { backgroundColor: Colors.error + '20' },
  cancelledText: { color: Colors.error },
  refunded: { backgroundColor: Colors.warning + '20' },
  refundedText: { color: Colors.warning },
  active: { backgroundColor: Colors.success + '20' },
  activeText: { color: Colors.success },
  inactive: { backgroundColor: Colors.error + '20' },
  inactiveText: { color: Colors.error },
  default: { backgroundColor: Colors.gray200 },
  defaultText: { color: Colors.gray700 },
});

export default StatusBadge;