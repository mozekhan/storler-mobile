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
  RefreshControl,
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
  MapPin,
  Phone,
  Mail,
  Store,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react-native";
import StoreService from "../../../../services/storeService";
import { formatCurrency, formatDate } from "../../../../utils/formatters";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../../constants/theme";
import CustomHeader from "../../../../components/ui/CustomHeader";

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
    currency: "NGN",
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [storeData, statsData] = await Promise.all([
        StoreService.getStore(id),
        StoreService.getStoreStats(id),
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
        currency: storeData.currency || "NGN",
        isActive: storeData.isActive !== false,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load store details");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
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
        error.response?.data?.message || "Failed to update store"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = () => {
    const newStatus = !formData.isActive;
    Alert.alert(
      newStatus ? "Activate Store" : "Deactivate Store",
      newStatus
        ? "Are you sure you want to activate this store?"
        : "Are you sure you want to deactivate this store?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: newStatus ? "Activate" : "Deactivate",
          style: newStatus ? "default" : "destructive",
          onPress: async () => {
            try {
              await StoreService.updateStore(id, { isActive: newStatus });
              Alert.alert("Success", `Store ${newStatus ? "activated" : "deactivated"}`);
              fetchData();
            } catch (error) {
              Alert.alert("Error", "Failed to update store status");
            }
          },
        },
      ]
    );
  };

  const formatStoreAddress = (address) => {
    if (!address) return "N/A";
    return [address.street, address.city, address.state, address.country]
      .filter(Boolean)
      .join(", ");
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.gray700} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Store Details" showBack={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Store Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.storeIconContainer}>
              <Store size={32} color={Colors.white} />
            </View>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeCode}>Code: {store.code}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Edit size={20} color={isEditing ? Colors.primary : Colors.gray500} />
            </TouchableOpacity>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                store.isActive !== false ? styles.statusActive : styles.statusInactive,
              ]}
            >
              {store.isActive !== false ? (
                <CheckCircle size={14} color={Colors.success} />
              ) : (
                <XCircle size={14} color={Colors.error} />
              )}
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
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyText}>{store.currency}</Text>
            </View>
          </View>
        </View>

        {/* Statistics Cards */}
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

        {/* Edit Form or Details */}
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
                  {saving ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Store Information</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Store size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Store Name</Text>
              <Text style={styles.detailValue}>{store.name}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailCodeIcon}>#</Text>
              </View>
              <Text style={styles.detailLabel}>Store Code</Text>
              <Text style={styles.detailValue}>{store.code}</Text>
            </View>
            
            {store.phone && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Phone size={16} color={Colors.gray500} />
                </View>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{store.phone}</Text>
              </View>
            )}
            
            {store.email && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Mail size={16} color={Colors.gray500} />
                </View>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{store.email}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MapPin size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>
                {formatStoreAddress(store.address)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailPercentIcon}>%</Text>
              </View>
              <Text style={styles.detailLabel}>Tax Rate</Text>
              <Text style={styles.detailValue}>{store.taxRate || 0}%</Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <DollarSign size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Currency</Text>
              <Text style={styles.detailValue}>{store.currency}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Clock size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Created</Text>
              <Text style={styles.detailValue}>
                {formatDate(store.createdAt)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Clock size={16} color={Colors.gray500} />
              </View>
              <Text style={styles.detailLabel}>Last Updated</Text>
              <Text style={styles.detailValue}>
                {formatDate(store.updatedAt)}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {!isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                store.isActive !== false
                  ? styles.deactivateButton
                  : styles.activateButton,
              ]}
              onPress={handleToggleStatus}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  store.isActive !== false
                    ? styles.deactivateButtonText
                    : styles.activateButtonText,
                ]}
              >
                {store.isActive !== false ? "Deactivate Store" : "Activate Store"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: Colors.gray500, fontSize: Typography.lg },
  scrollView: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: Spacing["3xl"] },

  // Header Card
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  storeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  storeInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  storeName: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
  },
  storeCode: {
    fontSize: Typography.sm,
    color: Colors.gray500,
  },
  editButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray100,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: "500",
    marginLeft: 4,
  },
  statusActive: { backgroundColor: Colors.success + "20" },
  statusActiveText: { color: Colors.success },
  statusInactive: { backgroundColor: Colors.error + "20" },
  statusInactiveText: { color: Colors.error },
  currencyBadge: {
    marginLeft: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray200,
  },
  currencyText: {
    fontSize: Typography.xs,
    fontWeight: "600",
    color: Colors.gray700,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.md,
    gap:Spacing.sm,
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
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.gray500,
  },
  revenueValue: { color: Colors.primary },

  // Details
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
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailIcon: {
    width: 24,
    alignItems: "center",
  },
  detailCodeIcon: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    fontWeight: "bold",
  },
  detailPercentIcon: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    fontWeight: "bold",
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: Colors.gray600,
    marginLeft: Spacing.sm,
    width: 80,
  },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
    flex: 1,
    textAlign: "right",
  },

  // Edit Form
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

  // Action Buttons
  actionButtons: {
    marginBottom: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  deactivateButton: {
    backgroundColor: Colors.error + "10",
    borderWidth: 1,
    borderColor: Colors.error,
  },
  activateButton: {
    backgroundColor: Colors.success + "10",
    borderWidth: 1,
    borderColor: Colors.success,
  },
  actionButtonText: {
    fontSize: Typography.md,
    fontWeight: "600",
  },
  deactivateButtonText: { color: Colors.error },
  activateButtonText: { color: Colors.success },

  // Back Button
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