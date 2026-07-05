import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { X, Save, Minus, Plus } from "lucide-react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../constants/theme";

const InventoryAdjustmentForm = ({
  productName,
  currentStock,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (quantity === 0) {
      Alert.alert("Error", "Please enter a quantity");
      return;
    }
    if (!reason.trim()) {
      Alert.alert("Error", "Please enter a reason");
      return;
    }
    onSubmit({ quantity, reason: reason.trim() });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adjust Stock</Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={24} color={Colors.gray500} />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.currentStock}>Current Stock: {currentStock}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Adjustment Quantity</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity((prev) => prev - 1)}
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
            onPress={() => setQuantity((prev) => prev + 1)}
          >
            <Plus size={20} color={Colors.gray500} />
          </TouchableOpacity>
        </View>
        <Text style={styles.helperText}>
          Positive to add, negative to remove
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Reason <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.reasonInput}
          placeholder="Enter reason for adjustment"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={3}
          placeholderTextColor={Colors.gray400}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Adjust Stock</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    ...Shadows.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  title: { fontSize: Typography.xl, fontWeight: "bold", color: Colors.gray900 },
  closeButton: { padding: Spacing.sm },
  productInfo: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  productName: {
    fontSize: Typography.md,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  currentStock: { fontSize: Typography.sm, color: Colors.gray500 },
  field: { marginBottom: Spacing.md },
  label: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  required: { color: Colors.error },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityInput: {
    flex: 1,
    textAlign: "center",
    fontSize: Typography.xl,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray300,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.md,
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
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { backgroundColor: Colors.gray200 },
  cancelButtonText: { fontWeight: "600", color: Colors.gray700 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { fontWeight: "600", color: Colors.white },
  buttonDisabled: { opacity: 0.7 },
});

export default InventoryAdjustmentForm;
