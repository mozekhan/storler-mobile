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

const StoreForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    code: initialData.code || "",
    address: {
      street: initialData.address?.street || "",
      city: initialData.address?.city || "",
      state: initialData.address?.state || "",
      country: initialData.address?.country || "",
      zipCode: initialData.address?.zipCode || "",
    },
    phone: initialData.phone || "",
    email: initialData.email || "",
    taxRate: initialData.taxRate ? String(initialData.taxRate) : "0",
    currency: initialData.currency || "USD",
  });

  const handleSubmit = () => {
    const data = {
      ...formData,
      taxRate: parseFloat(formData.taxRate) || 0,
    };
    onSubmit(data);
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateAddress = (field, value) => {
    setFormData({
      ...formData,
      address: { ...formData.address, [field]: value },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {mode === "create" ? "Add New Store" : "Edit Store"}
        </Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={24} color={Colors.gray500} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>
            Store Name <Text style={styles.required}>*</Text>
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
            Store Code <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.code}
            onChangeText={(text) => updateField("code", text.toUpperCase())}
            placeholder="MAIN"
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => updateField("phone", text)}
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => updateField("email", text.toLowerCase())}
            autoCapitalize="none"
            placeholderTextColor={Colors.gray400}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.inputMargin]}
            placeholder="Street"
            value={formData.address.street}
            onChangeText={(text) => updateAddress("street", text)}
            placeholderTextColor={Colors.gray400}
          />
          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.address.city}
                onChangeText={(text) => updateAddress("city", text)}
                placeholderTextColor={Colors.gray400}
              />
            </View>
            <View style={[styles.field, styles.halfField]}>
              <TextInput
                style={styles.input}
                placeholder="State"
                value={formData.address.state}
                onChangeText={(text) => updateAddress("state", text)}
                placeholderTextColor={Colors.gray400}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <TextInput
                style={styles.input}
                placeholder="Country"
                value={formData.address.country}
                onChangeText={(text) => updateAddress("country", text)}
                placeholderTextColor={Colors.gray400}
              />
            </View>
            <View style={[styles.field, styles.halfField]}>
              <TextInput
                style={styles.input}
                placeholder="Zip Code"
                value={formData.address.zipCode}
                onChangeText={(text) => updateAddress("zipCode", text)}
                placeholderTextColor={Colors.gray400}
              />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Tax Rate %</Text>
            <TextInput
              style={styles.input}
              value={formData.taxRate}
              onChangeText={(text) => updateField("taxRate", text)}
              keyboardType="decimal-pad"
              placeholderTextColor={Colors.gray400}
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Currency</Text>
            <TextInput
              style={styles.input}
              value={formData.currency}
              onChangeText={(text) =>
                updateField("currency", text.toUpperCase())
              }
              placeholder="USD"
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
  inputMargin: { marginBottom: Spacing.sm },
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

export default StoreForm;
