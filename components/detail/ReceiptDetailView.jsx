import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { FileText, Printer, Mail, Calendar, QrCode } from 'lucide-react-native';
import Badge from '../ui/Badge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const { width } = Dimensions.get('window');

const ReceiptDetailView = ({ receipt }) => {
  const getTypeIcon = (type) => {
    const icons = {
      SALES: '📄',
      PAYMENT: '💰',
      INVOICE: '📋',
    };
    return icons[type] || '📄';
  };

  const getTypeColor = (type) => {
    const colors = {
      SALES: Colors.primary,
      PAYMENT: Colors.success,
      INVOICE: Colors.warning,
    };
    return colors[type] || Colors.gray500;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={[styles.iconContainer, { backgroundColor: getTypeColor(receipt.type) + '15' }]}>
            <FileText size={24} color={getTypeColor(receipt.type)} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.receiptNumber}>{receipt.receiptNumber}</Text>
            <Text style={styles.receiptType}>{getTypeIcon(receipt.type)} {receipt.type}</Text>
          </View>
          <Badge variant={receipt.printed ? 'success' : 'warning'}>
            {receipt.printed ? 'Printed' : 'Not Printed'}
          </Badge>
        </View>
        <Text style={styles.receiptDate}>{formatDateTime(receipt.createdAt)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Receipt Information</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>{receipt.type}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction</Text>
          <Text style={styles.detailValue}>{receipt.transactionId?.transactionNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Store</Text>
          <Text style={styles.detailValue}>{receipt.storeId?.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={[styles.detailValue, receipt.printed ? styles.printedText : styles.notPrintedText]}>
            {receipt.printed ? 'Printed' : 'Not Printed'}
          </Text>
        </View>
      </View>

      {receipt.printed && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Print Information</Text>
          <View style={styles.detailRow}>
            <Printer size={16} color={Colors.gray500} />
            <Text style={styles.detailLabel}>Printed At</Text>
            <Text style={styles.detailValue}>{formatDateTime(receipt.printedAt)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Printed By</Text>
            <Text style={styles.detailValue}>
              {receipt.printedBy?.firstName} {receipt.printedBy?.lastName}
            </Text>
          </View>
        </View>
      )}

      {receipt.emailSent && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Information</Text>
          <View style={styles.detailRow}>
            <Mail size={16} color={Colors.gray500} />
            <Text style={styles.detailLabel}>Email Sent</Text>
            <Text style={styles.detailValue}>{formatDateTime(receipt.emailSentAt)}</Text>
          </View>
          {receipt.emailRecipient && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recipient</Text>
              <Text style={styles.detailValue}>{receipt.emailRecipient}</Text>
            </View>
          )}
        </View>
      )}

      {receipt.fileSize && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>File Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>File Size</Text>
            <Text style={styles.detailValue}>{(receipt.fileSize / 1024).toFixed(1)} KB</Text>
          </View>
          {receipt.filePath && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>File Path</Text>
              <Text style={[styles.detailValue, styles.filePathText]} numberOfLines={1}>{receipt.filePath}</Text>
            </View>
          )}
        </View>
      )}

      {/* Transaction Items */}
      {receipt.transactionId?.items && receipt.transactionId.items.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {receipt.transactionId.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>{item.quantity} × {formatCurrency(item.unitPrice)}</Text>
              </View>
              <Text style={styles.itemTotal}>{formatCurrency(item.totalPrice)}</Text>
            </View>
          ))}
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(receipt.transactionId.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>{formatCurrency(receipt.transactionId.taxTotal)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(receipt.transactionId.totalAmount)}</Text>
            </View>
          </View>
        </View>
      )}

      {/* QR Code */}
      {receipt.qrCode && (
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>QR Code</Text>
          <Image
            source={{ uri: receipt.qrCode }}
            style={styles.qrImage}
            resizeMode="contain"
          />
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
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerInfo: { flex: 1 },
  receiptNumber: { fontSize: Typography.lg, fontWeight: 'bold', color: Colors.gray900 },
  receiptType: { fontSize: Typography.sm, color: Colors.gray500 },
  receiptDate: { fontSize: Typography.sm, color: Colors.gray500, marginTop: Spacing.xs },
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
  printedText: { color: Colors.success },
  notPrintedText: { color: Colors.warning },
  filePathText: { fontSize: Typography.xs, maxWidth: '60%' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: Colors.gray50 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: Typography.sm, color: Colors.gray900 },
  itemDetail: { fontSize: Typography.xs, color: Colors.gray500 },
  itemTotal: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray900 },
  totalsContainer: { marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.gray200 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  totalLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  totalValue: { fontSize: Typography.sm, color: Colors.gray900 },
  grandTotalRow: { borderTopWidth: 1, borderTopColor: Colors.gray200, paddingTop: Spacing.sm, marginTop: Spacing.xs },
  grandTotalLabel: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.gray900 },
  grandTotalValue: { fontSize: Typography.md, fontWeight: 'bold', color: Colors.primary },
  qrSection: { alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  qrTitle: { fontSize: Typography.sm, fontWeight: '500', color: Colors.gray600, marginBottom: Spacing.sm },
  qrImage: { width: width * 0.4, height: width * 0.4, backgroundColor: Colors.white, borderRadius: BorderRadius.lg },
});

export default ReceiptDetailView;