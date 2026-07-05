import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { X, Save } from "lucide-react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../constants/theme";

const ProductForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    sku: initialData.sku || "",
    description: initialData.description || "",
    category: initialData.category || "",
    subCategory: initialData.subCategory || "",
    brand: initialData.brand || "",
    unitPrice: initialData.unitPrice ? String(initialData.unitPrice) : "",
    costPrice: initialData.costPrice ? String(initialData.costPrice) : "",
    taxRate: initialData.taxRate ? String(initialData.taxRate) : "0",
    minStockLevel: initialData.minStockLevel
      ? String(initialData.minStockLevel)
      : "5",
    maxStockLevel: initialData.maxStockLevel
      ? String(initialData.maxStockLevel)
      : "100",
    unitOfMeasure: initialData.unitOfMeasure || "each",
    initialQuantity: initialData.initialQuantity
      ? String(initialData.initialQuantity)
      : "0",
  });

  const handleSubmit = () => {
    const data = {
      ...formData,
      unitPrice: parseFloat(formData.unitPrice),
      costPrice: parseFloat(formData.costPrice) || 0,
      taxRate: parseFloat(formData.taxRate) || 0,
      minStockLevel: parseInt(formData.minStockLevel) || 5,
      maxStockLevel: parseInt(formData.maxStockLevel) || 100,
      initialQuantity: parseInt(formData.initialQuantity) || 0,
    };
    onSubmit(data);
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {mode === "create" ? "Add New Product" : "Edit Product"}
        </Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={24} color={Colors.gray500} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Product Information</Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => updateField("name", text)}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            SKU <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.sku}
            onChangeText={(text) => updateField("sku", text.toUpperCase())}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => updateField("description", text)}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.category}
              onChangeText={(text) => updateField("category", text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Sub Category</Text>
            <TextInput
              style={styles.input}
              value={formData.subCategory}
              onChangeText={(text) => updateField("subCategory", text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            value={formData.brand}
            onChangeText={(text) => updateField("brand", text)}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <Text style={styles.sectionTitle}>Pricing & Tax</Text>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>
              Unit Price <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={formData.unitPrice}
              onChangeText={(text) => updateField("unitPrice", text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Cost Price</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={formData.costPrice}
              onChangeText={(text) => updateField("costPrice", text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Tax Rate %</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={formData.taxRate}
              onChangeText={(text) => updateField("taxRate", text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Unit of Measure</Text>
            <TextInput
              style={styles.input}
              placeholder="each"
              value={formData.unitOfMeasure}
              onChangeText={(text) => updateField("unitOfMeasure", text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Stock Management</Text>

        <View style={[styles.field, styles.initialStockField]}>
          <Text style={styles.label}>Initial Stock Quantity</Text>
          <TextInput
            style={[styles.input, styles.initialStockInput]}
            placeholder="0"
            keyboardType="numeric"
            value={formData.initialQuantity}
            onChangeText={(text) => updateField("initialQuantity", text)}
            placeholderTextColor={Colors.gray400}
          />
          <Text style={styles.helperText}>
            Set to 0 if you want to add stock later
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Min Stock Level</Text>
            <TextInput
              style={styles.input}
              placeholder="5"
              keyboardType="numeric"
              value={formData.minStockLevel}
              onChangeText={(text) => updateField("minStockLevel", text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Max Stock Level</Text>
            <TextInput
              style={styles.input}
              placeholder="100"
              keyboardType="numeric"
              value={formData.maxStockLevel}
              onChangeText={(text) => updateField("maxStockLevel", text)}
              placeholderTextColor={Colors.gray400}
            />
          </View>
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
              <Text style={styles.submitButtonText}>
                {mode === "create" ? "Create" : "Update"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  title: { fontSize: Typography.xl, fontWeight: "bold", color: Colors.gray900 },
  closeButton: { padding: Spacing.sm },
  form: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray700,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingBottom: Spacing.sm,
  },
  field: { marginBottom: Spacing.md },
  halfField: { flex: 1 },
  row: { flexDirection: "row", gap: Spacing.sm },
  label: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  required: { color: Colors.error },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    backgroundColor: Colors.white,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  initialStockField: {
    backgroundColor: Colors.primary + "05",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + "20",
  },
  initialStockInput: {
    borderColor: Colors.primary + "30",
    backgroundColor: Colors.white,
  },
  helperText: { fontSize: Typography.xs, color: Colors.gray400, marginTop: 2 },
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

export default ProductForm;
