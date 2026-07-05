// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   StyleSheet
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Package, Minus, Plus } from 'lucide-react-native';
// import api from '../../services/api';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

// export default function InventoryAdjust() {
//   const router = useRouter();
//   const { productId, productName, currentStock } = useLocalSearchParams();
//   const [quantity, setQuantity] = useState(0);
//   const [reason, setReason] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleAdjust = async () => {
//     if (quantity === 0) {
//       Alert.alert('Error', 'Please enter a quantity');
//       return;
//     }

//     if (!reason.trim()) {
//       Alert.alert('Error', 'Please enter a reason');
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post('/inventory/adjust', {
//         productId,
//         quantity: parseInt(quantity),
//         reason: reason.trim()
//       });
      
//       Alert.alert('Success', 'Stock adjusted successfully');
//       router.back();
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'Failed to adjust stock');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <View style={styles.productInfo}>
//           <View style={styles.iconContainer}>
//             <Package size={32} color={Colors.primary} />
//           </View>
//           <Text style={styles.productName}>
//             {productName || 'Product'}
//           </Text>
//           <Text style={styles.productStock}>
//             Current Stock: {currentStock || 0}
//           </Text>
//         </View>

//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>
//             Adjustment Quantity
//           </Text>
//           <View style={styles.quantityRow}>
//             <TouchableOpacity
//               style={styles.quantityButton}
//               onPress={() => setQuantity(prev => Math.max(-999, prev - 1))}
//             >
//               <Minus size={20} color={Colors.gray500} />
//             </TouchableOpacity>
//             <TextInput
//               style={styles.quantityInput}
//               keyboardType="numeric"
//               value={String(quantity)}
//               onChangeText={(text) => setQuantity(parseInt(text) || 0)}
//             />
//             <TouchableOpacity
//               style={styles.quantityButton}
//               onPress={() => setQuantity(prev => prev + 1)}
//             >
//               <Plus size={20} color={Colors.gray500} />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.helperText}>
//             Positive to add, negative to remove
//           </Text>
//         </View>

//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>
//             Reason
//           </Text>
//           <TextInput
//             style={styles.reasonInput}
//             placeholder="Enter reason for adjustment"
//             value={reason}
//             onChangeText={setReason}
//             multiline
//             numberOfLines={2}
//             placeholderTextColor={Colors.gray400}
//           />
//         </View>

//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, styles.cancelButton]}
//             onPress={() => router.back()}
//           >
//             <Text style={styles.cancelButtonText}>
//               Cancel
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
//             onPress={handleAdjust}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color={Colors.white} />
//             ) : (
//               <Text style={styles.submitButtonText}>
//                 Adjust Stock
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.gray50,
//     padding: Spacing.md,
//   },
//   card: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing['2xl'],
//     ...Shadows.sm,
//   },
//   productInfo: {
//     alignItems: 'center',
//     marginBottom: Spacing['2xl'],
//   },
//   iconContainer: {
//     width: 64,
//     height: 64,
//     backgroundColor: Colors.primary + '20',
//     borderRadius: BorderRadius.full,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   productName: {
//     fontSize: Typography.lg,
//     fontWeight: 'bold',
//     color: Colors.gray900,
//     marginTop: Spacing.sm,
//   },
//   productStock: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//   },
//   fieldContainer: {
//     marginBottom: Spacing.md,
//   },
//   label: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray700,
//     marginBottom: Spacing.sm,
//   },
//   quantityRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   quantityButton: {
//     width: 48,
//     height: 48,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   quantityInput: {
//     flex: 1,
//     marginHorizontal: Spacing.md,
//     textAlign: 'center',
//     fontSize: Typography.xl,
//     fontWeight: 'bold',
//     borderBottomWidth: 2,
//     borderBottomColor: Colors.gray300,
//     paddingVertical: Spacing.sm,
//   },
//   helperText: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: Spacing.xs,
//   },
//   reasonInput: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//     marginTop: Spacing.sm,
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
//   submitButton: {
//     backgroundColor: Colors.primary,
//   },
//   submitButtonText: {
//     fontWeight: '600',
//     color: Colors.white,
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
// });
























import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Package, Minus, Plus } from 'lucide-react-native';
import InventoryService from '../../../services/inventoryService';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../../constants/theme';
import CustomHeader from '../../../components/ui/CustomHeader';

export default function InventoryAdjust() {
  const router = useRouter();
  const { productId, productName, currentStock } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdjust = async () => {
    if (quantity === 0) {
      Alert.alert('Error', 'Please enter a quantity');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter a reason');
      return;
    }

    setLoading(true);
    try {
      await InventoryService.adjustStock(
        productId,
        quantity,
        reason.trim()
      );
      
      Alert.alert('Success', 'Stock adjusted successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Adjust Inventory" />
      <View style={styles.card}>
        <View style={styles.productInfo}>
          <View style={styles.iconContainer}>
            <Package size={32} color={Colors.primary} />
          </View>
          <Text style={styles.productName}>
            {productName || 'Product'}
          </Text>
          <Text style={styles.productStock}>
            Current Stock: {currentStock || 0}
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Adjustment Quantity
          </Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(prev => Math.max(-999, prev - 1))}
            >
              <Minus size={20} color={Colors.gray500} />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={String(quantity)}
              onChangeText={(text) => setQuantity(parseInt(text) || 0)}
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(prev => prev + 1)}
            >
              <Plus size={20} color={Colors.gray500} />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            Positive to add, negative to remove
          </Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Reason
          </Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Enter reason for adjustment"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={2}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleAdjust}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                Adjust Stock
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    ...Shadows.sm,
  },
  productInfo: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.gray900,
    marginTop: Spacing.sm,
  },
  productStock: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  fieldContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    flex: 1,
    marginHorizontal: Spacing.md,
    textAlign: 'center',
    fontSize: Typography.xl,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray300,
    paddingVertical: Spacing.sm,
  },
  helperText: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.gray200,
  },
  cancelButtonText: {
    fontWeight: '600',
    color: Colors.gray700,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    fontWeight: '600',
    color: Colors.white,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});