// import React, { useState } from 'react';
// import {
//   TouchableOpacity,
//   Text,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   StyleSheet
// } from 'react-native';
// import * as Print from 'expo-print';
// import * as Sharing from 'expo-sharing';
// import { Printer } from 'lucide-react-native';
// import { usePrinter } from '../../hooks/usePrinter';
// import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

// const PrintButton = ({
//   transaction,
//   store,
//   type = 'sales',
//   onSuccess,
//   onError,
//   style,
//   children,
//   ...props
// }) => {
//   const [loading, setLoading] = useState(false);
//   const { printReceipt, isBluetoothAvailable } = usePrinter();

//   const generateReceiptHTML = (transaction, store, type) => {
//     return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Receipt</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
//             .header { text-align: center; margin-bottom: 20px; }
//             .title { font-size: 24px; font-weight: bold; }
//             .subtitle { font-size: 16px; color: #666; }
//             .divider { border-top: 1px dashed #ccc; margin: 15px 0; }
//             .row { display: flex; justify-content: space-between; padding: 5px 0; }
//             .item { padding: 3px 0; }
//             .total { font-weight: bold; font-size: 18px; }
//             .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <div class="title">${store?.name || 'Store'}</div>
//             <div class="subtitle">${type.charAt(0).toUpperCase() + type.slice(1)} Receipt</div>
//           </div>
//           <div class="divider"></div>
//           <div class="row"><span>Transaction</span><span>${transaction.transactionNumber}</span></div>
//           <div class="row"><span>Date</span><span>${new Date().toLocaleString()}</span></div>
//           <div class="divider"></div>
//           ${transaction.items?.map(item => `
//             <div class="row item">
//               <span>${item.name} x${item.quantity}</span>
//               <span>${item.totalPrice?.toFixed(2)}</span>
//             </div>
//           `).join('')}
//           <div class="divider"></div>
//           <div class="row"><span>Subtotal</span><span>${transaction.subtotal?.toFixed(2)}</span></div>
//           <div class="row"><span>Tax</span><span>${transaction.taxTotal?.toFixed(2)}</span></div>
//           <div class="row total"><span>Total</span><span>${transaction.totalAmount?.toFixed(2)}</span></div>
//           <div class="divider"></div>
//           <div class="footer">${store?.receiptFooter || 'Thank you for your purchase!'}</div>
//         </body>
//       </html>
//     `;
//   };

//   const handlePrint = async () => {
//     setLoading(true);

//     try {
//       if (isBluetoothAvailable) {
//         await printReceipt(transaction, store, type);
//         Alert.alert('Success', 'Printing started');
//         if (onSuccess) onSuccess();
//       } else {
//         const html = generateReceiptHTML(transaction, store, type);
//         const { uri } = await Print.printToFileAsync({ html });
        
//         if (Platform.OS === 'ios') {
//           await Print.printAsync({ uri });
//         } else {
//           await Sharing.shareAsync(uri, {
//             mimeType: 'application/pdf',
//             dialogTitle: 'Save Receipt'
//           });
//         }
        
//         if (onSuccess) onSuccess();
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to print receipt');
//       if (onError) onError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={[styles.button, loading && styles.buttonDisabled, style]}
//       onPress={handlePrint}
//       disabled={loading}
//       {...props}
//     >
//       {loading ? (
//         <ActivityIndicator color={Colors.white} />
//       ) : (
//         <>
//           <Printer size={20} color={Colors.white} />
//           <Text style={styles.buttonText}>
//             {children || 'Print Receipt'}
//           </Text>
//         </>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: Colors.primary,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonDisabled: {
//     opacity: 0.5,
//   },
//   buttonText: {
//     color: Colors.white,
//     fontWeight: '600',
//     marginLeft: Spacing.sm,
//     fontSize: Typography.md,
//   },
// });

// export default PrintButton;



























import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Printer } from 'lucide-react-native';
import { usePrinter } from '../../hooks/usePrinter';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const PrintButton = ({
  transaction,
  store,
  type = 'sales',
  onSuccess,
  onError,
  style,
  children,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const { printReceipt, isBluetoothAvailable } = usePrinter();

  const generateReceiptHTML = (transaction, store, type) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; }
            .subtitle { font-size: 16px; color: #666; }
            .divider { border-top: 1px dashed #ccc; margin: 15px 0; }
            .row { display: flex; justify-content: space-between; padding: 5px 0; }
            .item { padding: 3px 0; }
            .total { font-weight: bold; font-size: 18px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${store?.name || 'Store'}</div>
            <div class="subtitle">${type.charAt(0).toUpperCase() + type.slice(1)} Receipt</div>
          </div>
          <div class="divider"></div>
          <div class="row"><span>Transaction</span><span>${transaction.transactionNumber}</span></div>
          <div class="row"><span>Date</span><span>${new Date().toLocaleString()}</span></div>
          <div class="divider"></div>
          ${transaction.items?.map(item => `
            <div class="row item">
              <span>${item.name} x${item.quantity}</span>
              <span>$${item.totalPrice?.toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="divider"></div>
          <div class="row"><span>Subtotal</span><span>$${transaction.subtotal?.toFixed(2)}</span></div>
          <div class="row"><span>Tax</span><span>$${transaction.taxTotal?.toFixed(2)}</span></div>
          <div class="row total"><span>Total</span><span>$${transaction.totalAmount?.toFixed(2)}</span></div>
          <div class="divider"></div>
          <div class="footer">${store?.receiptFooter || 'Thank you for your purchase!'}</div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    setLoading(true);

    try {
      if (isBluetoothAvailable) {
        await printReceipt(transaction, store, type);
        Alert.alert('Success', 'Printing started');
        if (onSuccess) onSuccess();
      } else {
        const html = generateReceiptHTML(transaction, store, type);
        const { uri } = await Print.printToFileAsync({ html });

        if (Platform.OS === 'ios') {
          await Print.printAsync({ uri });
        } else {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Save Receipt'
          });
        }

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to print receipt');
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled, style]}
      onPress={handlePrint}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <>
          <Printer size={20} color={Colors.white} />
          <Text style={styles.buttonText}>{children || 'Print Receipt'}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    marginLeft: Spacing.sm,
    fontSize: Typography.md,
  },
});

export default PrintButton;