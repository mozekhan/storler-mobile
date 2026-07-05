import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Save,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  Edit,
  Trash2,
} from "lucide-react-native";
import StoreService from "../../../../services/storeService";
import AdminService from "../../../../services/adminService";
import { formatCurrency } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";

export default function StoreManagement() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState(null);
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: { street: "", city: "", state: "", country: "", zipCode: "" },
    phone: "",
    email: "",
    taxRate: "0",
    currency: "USD",
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [storeData, statsData] = await Promise.all([
        StoreService.getStore(id),
        AdminService.getStoreStats(id),
      ]);
      setStore(storeData);
      setStats(statsData);
      setFormData({
        name: storeData.name,
        code: storeData.code,
        address: storeData.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
        phone: storeData.phone || "",
        email: storeData.email || "",
        taxRate: String(storeData.taxRate || 0),
        currency: storeData.currency || "USD",
        isActive: storeData.isActive !== false,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load store details");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      await StoreService.updateStore(id, formData);
      Alert.alert("Success", "Store updated successfully");
      setIsEditing(false);
      fetchData();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update store",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = () => {
    Alert.alert(
      "Deactivate Store",
      "Are you sure you want to deactivate this store?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            try {
              await StoreService.deleteStore(id);
              Alert.alert("Success", "Store deactivated");
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to deactivate store");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!store) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Store not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeCode}>Code: {store.code}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Edit
                size={20}
                color={isEditing ? Colors.primary : Colors.gray500}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeactivate}
            >
              <Trash2 size={20} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              store.isActive !== false
                ? styles.statusActive
                : styles.statusInactive,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                store.isActive !== false
                  ? styles.statusActiveText
                  : styles.statusInactiveText,
              ]}
            >
              {store.isActive !== false ? "Active" : "Inactive"}
            </Text>
          </View>
          <Text style={styles.currencyText}>Currency: {store.currency}</Text>
        </View>
      </View>

      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{stats.users || 0}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={styles.statCard}>
            <Package size={20} color={Colors.success} />
            <Text style={styles.statValue}>{stats.products || 0}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <ShoppingBag size={20} color={Colors.warning} />
            <Text style={styles.statValue}>
              {stats.transactions?.total || 0}
            </Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statCard}>
            <DollarSign size={20} color={Colors.primary} />
            <Text style={[styles.statValue, styles.revenueValue]}>
              {formatCurrency(stats.revenue?.total || 0)}
            </Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>
      )}

      {isEditing ? (
        <View style={styles.editCard}>
          <Text style={styles.sectionTitle}>Edit Store</Text>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Store Name *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Store Code *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.code}
              onChangeText={(text) =>
                setFormData({ ...formData, code: text.toUpperCase() })
              }
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Phone</Text>
            <TextInput
              style={styles.formInput}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={styles.formInput}
              value={formData.email}
              onChangeText={(text) =>
                setFormData({ ...formData, email: text.toLowerCase() })
              }
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Address</Text>
            <TextInput
              style={[styles.formInput, styles.formInputMargin]}
              placeholder="Street"
              value={formData.address.street}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, street: text },
                })
              }
            />
            <View style={styles.formRow}>
              <View style={[styles.formField, styles.halfField]}>
                <TextInput
                  style={styles.formInput}
                  placeholder="City"
                  value={formData.address.city}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: text },
                    })
                  }
                />
              </View>
              <View style={[styles.formField, styles.halfField]}>
                <TextInput
                  style={styles.formInput}
                  placeholder="State"
                  value={formData.address.state}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: text },
                    })
                  }
                />
              </View>
            </View>
            <View style={styles.formRow}>
              <View style={[styles.formField, styles.halfField]}>
                <TextInput
                  style={styles.formInput}
                  placeholder="Country"
                  value={formData.address.country}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, country: text },
                    })
                  }
                />
              </View>
              <View style={[styles.formField, styles.halfField]}>
                <TextInput
                  style={styles.formInput}
                  placeholder="Zip Code"
                  value={formData.address.zipCode}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, zipCode: text },
                    })
                  }
                />
              </View>
            </View>
          </View>
          <View style={styles.formRow}>
            <View style={[styles.formField, styles.halfField]}>
              <Text style={styles.formLabel}>Tax Rate %</Text>
              <TextInput
                style={styles.formInput}
                value={formData.taxRate}
                onChangeText={(text) =>
                  setFormData({ ...formData, taxRate: text })
                }
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.formField, styles.halfField]}>
              <Text style={styles.formLabel}>Currency</Text>
              <TextInput
                style={styles.formInput}
                value={formData.currency}
                onChangeText={(text) =>
                  setFormData({ ...formData, currency: text.toUpperCase() })
                }
              />
            </View>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Status</Text>
            <View style={styles.statusPicker}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  formData.isActive && styles.statusOptionActive,
                ]}
                onPress={() => setFormData({ ...formData, isActive: true })}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    formData.isActive && styles.statusOptionTextActive,
                  ]}
                >
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  !formData.isActive && styles.statusOptionActive,
                ]}
                onPress={() => setFormData({ ...formData, isActive: false })}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    !formData.isActive && styles.statusOptionTextActive,
                  ]}
                >
                  Inactive
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setIsEditing(false);
                fetchData();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                saving && styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.submitButtonText}>
                {saving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Store Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{store.phone || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{store.email || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>
              {[
                store.address?.street,
                store.address?.city,
                store.address?.state,
                store.address?.country,
              ]
                .filter(Boolean)
                .join(", ") || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tax Rate</Text>
            <Text style={styles.detailValue}>{store.taxRate || 0}%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Currency</Text>
            <Text style={styles.detailValue}>{store.currency}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created</Text>
            <Text style={styles.detailValue}>
              {new Date(store.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={20} color={Colors.gray700} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: Colors.gray500 },
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  storeName: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  storeCode: { fontSize: Typography.sm, color: Colors.gray500 },
  headerActions: { flexDirection: "row" },
  actionButton: { padding: Spacing.sm },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: { fontSize: Typography.xs, fontWeight: "500" },
  statusActive: { backgroundColor: Colors.success + "20" },
  statusActiveText: { color: Colors.success },
  statusInactive: { backgroundColor: Colors.error + "20" },
  statusInactiveText: { color: Colors.error },
  currencyText: {
    fontSize: Typography.xs,
    color: Colors.gray500,
    marginLeft: Spacing.md,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.md,
  },
  statCard: {
    width: "48%",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: "center",
    ...Shadows.sm,
  },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.xs,
  },
  statLabel: { fontSize: Typography.xs, color: Colors.gray500 },
  revenueValue: { color: Colors.primary },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray600 },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
    flex: 1,
    textAlign: "right",
  },
  editCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  formField: { marginBottom: Spacing.md },
  formLabel: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.md,
  },
  formInputMargin: { marginBottom: Spacing.sm },
  formRow: { flexDirection: "row", gap: Spacing.sm },
  halfField: { flex: 1 },
  statusPicker: { flexDirection: "row", gap: Spacing.sm },
  statusOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray100,
    alignItems: "center",
  },
  statusOptionActive: { backgroundColor: Colors.primary },
  statusOptionText: { fontSize: Typography.sm, color: Colors.gray700 },
  statusOptionTextActive: { color: Colors.white },
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    backgroundColor: Colors.gray200,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  backButtonText: {
    color: Colors.gray700,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
});
