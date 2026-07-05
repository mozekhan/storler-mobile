// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { DollarSign, CreditCard, Banknote, Smartphone, QrCode } from 'lucide-react-native';
// import TransactionService from '../../services/transactionService';
// import { formatCurrency } from '../../utils/formatters';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

// export default function PaymentModal() {
//   const router = useRouter();
//   const { transactionId } = useLocalSearchParams();
//   const [loading, setLoading] = useState(false);
//   const [transaction, setTransaction] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState('CASH');
//   const [amountPaid, setAmountPaid] = useState('');
//   const [processing, setProcessing] = useState(false);

//   useEffect(() => {
//     fetchTransaction();
//   }, [transactionId]);

//   const fetchTransaction = async () => {
//     try {
//       const data = await TransactionService.getTransaction(transactionId);
//       setTransaction(data);
//       setAmountPaid(data.totalAmount?.toString() || '');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load transaction');
//     }
//   };

//   const processPayment = async () => {
//     if (!amountPaid) {
//       Alert.alert('Error', 'Please enter amount paid');
//       return;
//     }

//     const amount = parseFloat(amountPaid);
//     if (isNaN(amount) || amount <= 0) {
//       Alert.alert('Error', 'Please enter a valid amount');
//       return;
//     }

//     if (amount < transaction?.totalAmount) {
//       Alert.alert('Error', `Amount paid is less than total. Total: ${formatCurrency(transaction.totalAmount)}`);
//       return;
//     }

//     setProcessing(true);
//     try {
//       const result = await TransactionService.processPayment(
//         transactionId,
//         paymentMethod,
//         amount
//       );

//       Alert.alert(
//         'Payment Successful',
//         `Payment of ${formatCurrency(amount)} processed successfully.\nChange: ${formatCurrency(result.change)}`,
//         [
//           {
//             text: 'View Receipt',
//             onPress: () => router.push(`/(app)/(modals)/receipt-preview?transactionId=${transactionId}`)
//           },
//           { text: 'Done', onPress: () => router.back() },
//         ]
//       );
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to process payment');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (!transaction) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   const paymentMethods = [
//     { id: 'CASH', label: 'Cash', icon: Banknote },
//     { id: 'CARD', label: 'Card', icon: CreditCard },
//     { id: 'TRANSFER', label: 'Transfer', icon: DollarSign },
//     { id: 'MOBILE_MONEY', label: 'Mobile Money', icon: Smartphone },
//   ];

//   const change = amountPaid && transaction
//     ? parseFloat(amountPaid) - transaction.totalAmount
//     : 0;

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
//       <View style={styles.transactionCard}>
//         <Text style={styles.transactionLabel}>Transaction</Text>
//         <Text style={styles.transactionNumber}>
//           {transaction.transactionNumber}
//         </Text>
//         <View style={styles.totalRow}>
//           <Text style={styles.totalLabel}>Total Amount</Text>
//           <Text style={styles.totalAmount}>
//             {formatCurrency(transaction.totalAmount)}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.methodCard}>
//         <Text style={styles.methodTitle}>Payment Method</Text>
//         <View style={styles.methodGrid}>
//           {paymentMethods.map((method) => {
//             const isSelected = paymentMethod === method.id;
//             const Icon = method.icon;
//             return (
//               <TouchableOpacity
//                 key={method.id}
//                 style={styles.methodItem}
//                 onPress={() => setPaymentMethod(method.id)}
//               >
//                 <View style={[
//                   styles.methodOption,
//                   isSelected && styles.methodOptionSelected,
//                 ]}>
//                   <Icon size={24} color={isSelected ? Colors.primary : Colors.gray400} />
//                   <Text style={[
//                     styles.methodLabel,
//                     isSelected && styles.methodLabelSelected,
//                   ]}>
//                     {method.label}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//       </View>

//       <View style={styles.amountCard}>
//         <Text style={styles.amountTitle}>Amount Received</Text>
//         <View style={styles.amountInputContainer}>
//           <DollarSign size={24} color={Colors.gray500} />
//           <TextInput
//             style={styles.amountInput}
//             placeholder="0.00"
//             keyboardType="decimal-pad"
//             value={amountPaid}
//             onChangeText={setAmountPaid}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>
//         {amountPaid && transaction && (
//           <View style={styles.changeContainer}>
//             <Text style={[
//               styles.changeText,
//               change >= 0 ? styles.changePositive : styles.changeNegative,
//             ]}>
//               {change >= 0 ? 'Change' : 'Short'}: {formatCurrency(Math.abs(change))}
//             </Text>
//           </View>
//         )}
//       </View>

//       <View style={styles.buttonRow}>
//         <TouchableOpacity
//           style={[styles.button, styles.cancelButton]}
//           onPress={() => router.back()}
//           disabled={processing}
//         >
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.button,
//             styles.processButton,
//             (processing || !amountPaid) && styles.buttonDisabled,
//           ]}
//           onPress={processPayment}
//           disabled={processing || !amountPaid}
//         >
//           {processing ? (
//             <ActivityIndicator color={Colors.white} />
//           ) : (
//             <Text style={styles.processButtonText}>Process Payment</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.gray50,
//   },
//   content: {
//     padding: Spacing.md,
//     paddingBottom: Spacing['3xl'],
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   transactionCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   transactionLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   transactionNumber: {
//     fontSize: Typography.lg,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: Spacing.md,
//   },
//   totalLabel: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   totalAmount: {
//     fontSize: Typography['2xl'],
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   methodCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   methodTitle: {
//     fontSize: Typography.lg,
//     fontWeight: '600',
//     color: Colors.gray900,
//     marginBottom: Spacing.md,
//   },
//   methodGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   methodItem: {
//     width: '50%',
//     padding: Spacing.xs,
//   },
//   methodOption: {
//     borderWidth: 2,
//     borderColor: Colors.gray200,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     alignItems: 'center',
//   },
//   methodOptionSelected: {
//     borderColor: Colors.primary,
//     backgroundColor: Colors.primary + '10',
//   },
//   methodLabel: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray500,
//     marginTop: Spacing.sm,
//   },
//   methodLabelSelected: {
//     color: Colors.primary,
//   },
//   amountCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.sm,
//   },
//   amountTitle: {
//     fontSize: Typography.lg,
//     fontWeight: '600',
//     color: Colors.gray900,
//     marginBottom: Spacing.md,
//   },
//   amountInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//   },
//   amountInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.sm,
//     fontSize: Typography.xl,
//     fontWeight: 'bold',
//   },
//   changeContainer: {
//     marginTop: Spacing.sm,
//   },
//   changeText: {
//     fontSize: Typography.sm,
//   },
//   changePositive: {
//     color: Colors.success,
//   },
//   changeNegative: {
//     color: Colors.error,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cancelButton: {
//     backgroundColor: Colors.gray200,
//   },
//   cancelButtonText: {
//     fontWeight: '600',
//     color: Colors.gray700,
//   },
//   processButton: {
//     backgroundColor: Colors.primary,
//   },
//   processButtonText: {
//     fontWeight: '600',
//     color: Colors.white,
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  DollarSign,
  CreditCard,
  Banknote,
  Smartphone,
  QrCode,
} from "lucide-react-native";
import TransactionService from "../../../services/transactionService";
import { formatCurrency } from "../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../constants/theme";
import CustomHeader from "../../../components/ui/CustomHeader";

export default function PaymentModal() {
  const router = useRouter();
  const { transactionId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amountPaid, setAmountPaid] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      const data = await TransactionService.getTransaction(transactionId);
      setTransaction(data);
      setAmountPaid(data.totalAmount?.toString() || "");
    } catch (error) {
      Alert.alert("Error", "Failed to load transaction");
    }
  };

  const processPayment = async () => {
    if (!amountPaid) {
      Alert.alert("Error", "Please enter amount paid");
      return;
    }

    const amount = parseFloat(amountPaid);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (amount < transaction?.totalAmount) {
      Alert.alert(
        "Error",
        `Amount paid is less than total. Total: ${formatCurrency(transaction.totalAmount)}`,
      );
      return;
    }

    setProcessing(true);
    try {
      const result = await TransactionService.processPayment(
        transactionId,
        paymentMethod,
        amount,
      );

      Alert.alert(
        "Payment Successful",
        `Payment of ${formatCurrency(amount)} processed successfully.\nChange: ${formatCurrency(result.change)}`,
        [
          {
            text: "View Receipt",
            onPress: () =>
              router.push(
                `/(app)/(modals)/receipt-preview?transactionId=${transactionId}`,
              ),
          },
          { text: "Done", onPress: () => router.back() },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to process payment",
      );
    } finally {
      setProcessing(false);
    }
  };

  if (!transaction) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const paymentMethods = [
    { id: "CASH", label: "Cash", icon: Banknote },
    { id: "CARD", label: "Card", icon: CreditCard },
    { id: "TRANSFER", label: "Transfer", icon: DollarSign },
    { id: "MOBILE_MONEY", label: "Mobile Money", icon: Smartphone },
  ];

  const change =
    amountPaid && transaction
      ? parseFloat(amountPaid) - transaction.totalAmount
      : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <CustomHeader title="Payment" />
      <View style={styles.transactionCard}>
        <Text style={styles.transactionLabel}>Transaction</Text>
        <Text style={styles.transactionNumber}>
          {transaction.transactionNumber}
        </Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(transaction.totalAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.methodCard}>
        <Text style={styles.methodTitle}>Payment Method</Text>
        <View style={styles.methodGrid}>
          {paymentMethods.map((method) => {
            const isSelected = paymentMethod === method.id;
            const Icon = method.icon;
            return (
              <TouchableOpacity
                key={method.id}
                style={styles.methodItem}
                onPress={() => setPaymentMethod(method.id)}
              >
                <View
                  style={[
                    styles.methodOption,
                    isSelected && styles.methodOptionSelected,
                  ]}
                >
                  <Icon
                    size={24}
                    color={isSelected ? Colors.primary : Colors.gray400}
                  />
                  <Text
                    style={[
                      styles.methodLabel,
                      isSelected && styles.methodLabelSelected,
                    ]}
                  >
                    {method.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.amountCard}>
        <Text style={styles.amountTitle}>Amount Received</Text>
        <View style={styles.amountInputContainer}>
          <DollarSign size={24} color={Colors.gray500} />
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amountPaid}
            onChangeText={setAmountPaid}
            placeholderTextColor={Colors.gray400}
          />
        </View>
        {amountPaid && transaction && (
          <View style={styles.changeContainer}>
            <Text
              style={[
                styles.changeText,
                change >= 0 ? styles.changePositive : styles.changeNegative,
              ]}
            >
              {change >= 0 ? "Change" : "Short"}:{" "}
              {formatCurrency(Math.abs(change))}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
          disabled={processing}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.processButton,
            (processing || !amountPaid) && styles.buttonDisabled,
          ]}
          onPress={processPayment}
          disabled={processing || !amountPaid}
        >
          {processing ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.processButtonText}>Process Payment</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md, paddingBottom: Spacing["3xl"] },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  transactionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  transactionLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  transactionNumber: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },
  totalLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  totalAmount: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.primary,
  },
  methodCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  methodTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  methodGrid: { flexDirection: "row", flexWrap: "wrap" },
  methodItem: { width: "50%", padding: Spacing.xs },
  methodOption: {
    borderWidth: 2,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
  },
  methodOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  methodLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray500,
    marginTop: Spacing.sm,
  },
  methodLabelSelected: { color: Colors.primary },
  amountCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  amountTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  amountInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    fontSize: Typography.xl,
    fontWeight: "bold",
  },
  changeContainer: { marginTop: Spacing.sm },
  changeText: { fontSize: Typography.sm },
  changePositive: { color: Colors.success },
  changeNegative: { color: Colors.error },
  buttonRow: { flexDirection: "row", gap: Spacing.sm },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: "600", color: Colors.gray700 },
  processButton: { backgroundColor: Colors.primary },
  processButtonText: { fontWeight: "600", color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
});
