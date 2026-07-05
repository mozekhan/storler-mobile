// import React from 'react';
// import { View, Text, ScrollView, StyleSheet } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import { formatCurrency, formatDateTime } from '../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

// const ReceiptTemplate = ({ transaction, store, type = 'sales' }) => {
//   const renderSalesReceipt = () => (
//     <View style={styles.receipt}>
//       <Text style={styles.storeName}>
//         {store?.name || 'Store'}
//       </Text>
//       <Text style={styles.receiptType}>
//         Sales Receipt
//       </Text>
//       <View style={styles.divider} />

//       <View style={styles.detailsContainer}>
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Transaction</Text>
//           <Text style={styles.detailValue}>
//             {transaction.transactionNumber}
//           </Text>
//         </View>
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Date</Text>
//           <Text style={styles.detailValue}>
//             {formatDateTime(transaction.salesTimestamp)}
//           </Text>
//         </View>
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Attendant</Text>
//           <Text style={styles.detailValue}>
//             {transaction.salesAttendantId?.firstName} {transaction.salesAttendantId?.lastName}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.divider} />

//       {transaction.items?.map((item, index) => (
//         <View key={index} style={styles.itemRow}>
//           <View style={styles.itemInfo}>
//             <Text style={styles.itemName}>{item.name}</Text>
//             <Text style={styles.itemQuantity}>x{item.quantity}</Text>
//           </View>
//           <Text style={styles.itemPrice}>
//             {formatCurrency(item.totalPrice)}
//           </Text>
//         </View>
//       ))}

//       <View style={styles.divider} />

//       <View style={styles.totalsContainer}>
//         <View style={styles.totalRow}>
//           <Text style={styles.totalLabel}>Subtotal</Text>
//           <Text style={styles.totalValue}>
//             {formatCurrency(transaction.subtotal)}
//           </Text>
//         </View>
//         <View style={styles.totalRow}>
//           <Text style={styles.totalLabel}>Tax</Text>
//           <Text style={styles.totalValue}>
//             {formatCurrency(transaction.taxTotal)}
//           </Text>
//         </View>
//         <View style={[styles.totalRow, styles.grandTotalRow]}>
//           <Text style={styles.grandTotalLabel}>Total</Text>
//           <Text style={styles.grandTotalValue}>
//             {formatCurrency(transaction.totalAmount)}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.divider} />

//       {transaction.salesReceiptQR && (
//         <View style={styles.qrContainer}>
//           <Text style={styles.qrLabel}>Scan QR Code for Payment</Text>
//           <QRCode
//             value={transaction.salesReceiptQR}
//             size={120}
//             color={Colors.black}
//             backgroundColor={Colors.white}
//           />
//         </View>
//       )}

//       <View style={styles.divider} />

//       <Text style={styles.footer}>
//         {store?.receiptFooter || 'Thank you for your purchase!'}
//       </Text>
//     </View>
//   );

//   const renderPaymentReceipt = () => (
//     <View style={styles.receipt}>
//       <Text style={styles.storeName}>
//         {store?.name || 'Store'}
//       </Text>
//       <Text style={styles.receiptType}>
//         Payment Receipt
//       </Text>
//       <View style={styles.divider} />

//       <View style={styles.detailsContainer}>
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Transaction</Text>
//           <Text style={styles.detailValue}>
//             {transaction.transactionNumber}
//           </Text>
//         </View>
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Date</Text>
//           <Text style={styles.detailValue}>
//             {formatDateTime(transaction.paymentTimestamp)}
//           </Text>
//         </View>
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Cashier</Text>
//           <Text style={styles.detailValue}>
//             {transaction.financeAttendantId?.firstName} {transaction.financeAttendantId?.lastName}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.divider} />

//       <View style={styles.totalsContainer}>
//         <View style={styles.totalRow}>
//           <Text style={styles.totalLabel}>Payment Method</Text>
//           <Text style={styles.totalValue}>
//             {transaction.paymentMethod}
//           </Text>
//         </View>
//         <View style={styles.totalRow}>
//           <Text style={styles.totalLabel}>Amount Paid</Text>
//           <Text style={styles.totalValue}>
//             {formatCurrency(transaction.amountPaid)}
//           </Text>
//         </View>
//         {transaction.changeAmount > 0 && (
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Change</Text>
//             <Text style={styles.totalValue}>
//               {formatCurrency(transaction.changeAmount)}
//             </Text>
//           </View>
//         )}
//       </View>

//       <View style={styles.divider} />

//       {transaction.paymentReceiptQR && (
//         <View style={styles.qrContainer}>
//           <Text style={styles.qrLabel}>Scan QR Code for Collection</Text>
//           <QRCode
//             value={transaction.paymentReceiptQR}
//             size={120}
//             color={Colors.black}
//             backgroundColor={Colors.white}
//           />
//         </View>
//       )}

//       <View style={styles.divider} />

//       <Text style={styles.footer}>
//         {store?.receiptFooter || 'Thank you for your purchase!'}
//       </Text>
//     </View>
//   );

//   const renderInvoice = () => (
//     <View style={styles.receipt}>
//       <Text style={styles.storeName}>
//         {store?.name || 'Store'}
//       </Text>
//       <Text style={styles.receiptType}>
//         Final Invoice
//       </Text>
//       <View style={styles.divider} />

//       <View style={styles.detailsContainer}>
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Invoice #</Text>
//           <Text style={styles.detailValue}>
//             {transaction.finalInvoiceNumber}
//           </Text>
//         </View>
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Transaction</Text>
//           <Text style={styles.detailValue}>
//             {transaction.transactionNumber}
//           </Text>
//         </View>
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Date</Text>
//           <Text style={styles.detailValue}>
//             {formatDateTime(transaction.releaseTimestamp)}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.divider} />

//       <Text style={styles.sectionTitle}>Items Released</Text>
//       {transaction.itemsReleased?.map((release, index) => {
//         const item = transaction.items?.find(i =>
//           i.productId?._id === release.productId?._id
//         );
//         return (
//           <View key={index} style={styles.itemRow}>
//             <Text style={styles.itemName}>{item?.name || 'Unknown'}</Text>
//             <Text style={styles.itemPrice}>x{release.quantityReleased}</Text>
//           </View>
//         );
//       })}

//       <View style={styles.divider} />

//       <View style={styles.totalsContainer}>
//         <View style={styles.totalRow}>
//           <Text style={styles.totalLabel}>Released By</Text>
//           <Text style={styles.totalValue}>
//             {transaction.warehouseStaffId?.firstName} {transaction.warehouseStaffId?.lastName}
//           </Text>
//         </View>
//         <View style={styles.totalRow}>
//           <Text style={styles.totalLabel}>Total Amount</Text>
//           <Text style={styles.totalValue}>
//             {formatCurrency(transaction.totalAmount)}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.divider} />

//       <Text style={styles.footer}>
//         {store?.receiptFooter || 'Thank you for your business!'}
//       </Text>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       {type === 'sales' && renderSalesReceipt()}
//       {type === 'payment' && renderPaymentReceipt()}
//       {type === 'invoice' && renderInvoice()}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: Colors.white,
//   },
//   receipt: {
//     padding: Spacing.md,
//   },
//   storeName: {
//     textAlign: 'center',
//     fontSize: Typography.xl,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   receiptType: {
//     textAlign: 'center',
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   divider: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray300,
//     marginVertical: Spacing.md,
//   },
//   detailsContainer: {
//     gap: Spacing.xs,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   detailLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   detailValue: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   itemRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: Spacing.xs,
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: Typography.sm,
//     color: Colors.gray900,
//   },
//   itemQuantity: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   itemPrice: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray900,
//   },
//   totalsContainer: {
//     gap: Spacing.xs,
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   totalLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray600,
//   },
//   totalValue: {
//     fontSize: Typography.sm,
//     color: Colors.gray900,
//   },
//   grandTotalRow: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//     paddingTop: Spacing.sm,
//     marginTop: Spacing.sm,
//   },
//   grandTotalLabel: {
//     fontSize: Typography.md,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   grandTotalValue: {
//     fontSize: Typography.md,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   qrContainer: {
//     alignItems: 'center',
//   },
//   qrLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     marginBottom: Spacing.sm,
//   },
//   footer: {
//     textAlign: 'center',
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//   },
//   sectionTitle: {
//     fontSize: Typography.sm,
//     fontWeight: '600',
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },
// });

// export default ReceiptTemplate;

import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../constants/theme";

const ReceiptTemplate = ({ transaction, store, type = "sales" }) => {
  const renderSalesReceipt = () => (
    <View style={styles.receipt}>
      <Text style={styles.storeName}>{store?.name || "Store"}</Text>
      <Text style={styles.receiptType}>Sales Receipt</Text>
      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction</Text>
          <Text style={styles.detailValue}>
            {transaction.transactionNumber}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {formatDateTime(transaction.salesTimestamp)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Attendant</Text>
          <Text style={styles.detailValue}>
            {transaction.salesAttendantId?.firstName}{" "}
            {transaction.salesAttendantId?.lastName}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {transaction.items?.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
          </View>
          <Text style={styles.itemPrice}>
            {formatCurrency(item.totalPrice)}
          </Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(transaction.subtotal)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(transaction.taxTotal)}
          </Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotalRow]}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalValue}>
            {formatCurrency(transaction.totalAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {transaction.salesReceiptQR && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>Scan QR Code for Payment</Text>
          <QRCode
            value={transaction.salesReceiptQR}
            size={120}
            color={Colors.black}
            backgroundColor={Colors.white}
          />
        </View>
      )}

      <View style={styles.divider} />

      <Text style={styles.footer}>
        {store?.receiptFooter || "Thank you for your purchase!"}
      </Text>
    </View>
  );

  const renderPaymentReceipt = () => (
    <View style={styles.receipt}>
      <Text style={styles.storeName}>{store?.name || "Store"}</Text>
      <Text style={styles.receiptType}>Payment Receipt</Text>
      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction</Text>
          <Text style={styles.detailValue}>
            {transaction.transactionNumber}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {formatDateTime(transaction.paymentTimestamp)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cashier</Text>
          <Text style={styles.detailValue}>
            {transaction.financeAttendantId?.firstName}{" "}
            {transaction.financeAttendantId?.lastName}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Payment Method</Text>
          <Text style={styles.totalValue}>{transaction.paymentMethod}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Amount Paid</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(transaction.amountPaid)}
          </Text>
        </View>
        {transaction.changeAmount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Change</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(transaction.changeAmount)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {transaction.paymentReceiptQR && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>Scan QR Code for Collection</Text>
          <QRCode
            value={transaction.paymentReceiptQR}
            size={120}
            color={Colors.black}
            backgroundColor={Colors.white}
          />
        </View>
      )}

      <View style={styles.divider} />

      <Text style={styles.footer}>
        {store?.receiptFooter || "Thank you for your purchase!"}
      </Text>
    </View>
  );

  const renderInvoice = () => (
    <View style={styles.receipt}>
      <Text style={styles.storeName}>{store?.name || "Store"}</Text>
      <Text style={styles.receiptType}>Final Invoice</Text>
      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Invoice #</Text>
          <Text style={styles.detailValue}>
            {transaction.finalInvoiceNumber}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction</Text>
          <Text style={styles.detailValue}>
            {transaction.transactionNumber}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {formatDateTime(transaction.releaseTimestamp)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Items Released</Text>
      {transaction.itemsReleased?.map((release, index) => {
        const item = transaction.items?.find(
          (i) => i.productId?._id === release.productId?._id,
        );
        return (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{item?.name || "Unknown"}</Text>
            <Text style={styles.itemPrice}>x{release.quantityReleased}</Text>
          </View>
        );
      })}

      <View style={styles.divider} />

      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Released By</Text>
          <Text style={styles.totalValue}>
            {transaction.warehouseStaffId?.firstName}{" "}
            {transaction.warehouseStaffId?.lastName}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(transaction.totalAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.footer}>
        {store?.receiptFooter || "Thank you for your business!"}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {type === "sales" && renderSalesReceipt()}
      {type === "payment" && renderPaymentReceipt()}
      {type === "invoice" && renderInvoice()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.white },
  receipt: { padding: Spacing.md },
  storeName: {
    textAlign: "center",
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  receiptType: {
    textAlign: "center",
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray300,
    marginVertical: Spacing.md,
  },
  detailsContainer: { gap: Spacing.xs },
  detailRow: { flexDirection: "row", justifyContent: "space-between" },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: Typography.sm, color: Colors.gray900 },
  itemQuantity: { fontSize: Typography.xs, color: Colors.gray500 },
  itemPrice: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  totalsContainer: { gap: Spacing.xs },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  totalValue: { fontSize: Typography.sm, color: Colors.gray900 },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  grandTotalLabel: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  grandTotalValue: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.primary,
  },
  qrContainer: { alignItems: "center" },
  qrLabel: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginBottom: Spacing.sm,
  },
  footer: {
    textAlign: "center",
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: "600",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
});

export default ReceiptTemplate;
