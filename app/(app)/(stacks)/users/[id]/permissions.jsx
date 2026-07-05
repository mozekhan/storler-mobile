import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Switch,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Shield, Check, X } from "lucide-react-native";
import UserService from "../../../../../services/userService";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../../../../constants/theme";
import { Permissions, RolePermissions } from "../../../../../constants/roles";

export default function UserPermissions() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const data = await UserService.getUser(id);
      setUser(data);
      setPermissions(data.permissions || []);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permission) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((p) => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  const getDefaultPermissions = () => {
    return RolePermissions[user?.role] || [];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>User not found</Text>
      </View>
    );
  }

  const defaultPermissions = getDefaultPermissions();
  const permissionGroups = [
    {
      title: "Transactions",
      permissions: [
        Permissions.TRANSACTION_CREATE,
        Permissions.TRANSACTION_READ_OWN,
        Permissions.TRANSACTION_READ_ALL,
      ],
    },
    {
      title: "Payments",
      permissions: [Permissions.PAYMENT_PROCESS, Permissions.PAYMENT_REFUND],
    },
    {
      title: "Inventory",
      permissions: [
        Permissions.INVENTORY_READ,
        Permissions.INVENTORY_ADJUST,
        Permissions.INVENTORY_RELEASE,
      ],
    },
    {
      title: "Users",
      permissions: [Permissions.USER_CREATE, Permissions.USER_UPDATE],
    },
    {
      title: "System",
      permissions: [
        Permissions.AUDIT_READ,
        Permissions.REPORT_GENERATE,
        Permissions.STORE_MANAGE,
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Shield size={24} color={Colors.primary} />
        <Text style={styles.headerTitle}>Permissions</Text>
        <Text style={styles.headerSubtitle}>
          {user.firstName} {user.lastName}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Default permissions for role{" "}
          <Text style={styles.infoHighlight}>
            {user.role?.replace("_", " ")}
          </Text>
        </Text>
        <View style={styles.defaultPermissions}>
          {defaultPermissions.map((perm) => (
            <View key={perm} style={styles.defaultPermItem}>
              <Check size={14} color={Colors.success} />
              <Text style={styles.defaultPermText}>
                {perm.replace(":", " ")}
              </Text>
            </View>
          ))}
          {defaultPermissions.length === 0 && (
            <Text style={styles.noDefaultText}>No default permissions</Text>
          )}
        </View>
      </View>

      <Text style={styles.customTitle}>Custom Permissions</Text>

      {permissionGroups.map((group) => (
        <View key={group.title} style={styles.groupCard}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.permissions.map((permission) => {
            const isDefault = defaultPermissions.includes(permission);
            const isEnabled = permissions.includes(permission);

            return (
              <View key={permission} style={styles.permissionRow}>
                <View style={styles.permissionInfo}>
                  <Text style={styles.permissionName}>
                    {permission.replace(":", " ")}
                  </Text>
                  {isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <Switch
                  value={isEnabled}
                  onValueChange={() => togglePermission(permission)}
                  trackColor={{ false: Colors.gray300, true: Colors.primary }}
                  disabled={isDefault}
                />
              </View>
            );
          })}
        </View>
      ))}

      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  content: { padding: Spacing.md, paddingBottom: Spacing["3xl"] },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: Colors.gray500 },
  header: { alignItems: "center", marginBottom: Spacing.md },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.xs,
  },
  headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoText: { fontSize: Typography.sm, color: Colors.gray600 },
  infoHighlight: { fontWeight: "600", color: Colors.gray900 },
  defaultPermissions: {
    marginTop: Spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  defaultPermItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.success + "10",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    marginBottom: 2,
  },
  defaultPermText: {
    fontSize: Typography.xs,
    color: Colors.success,
    marginLeft: 2,
  },
  noDefaultText: { fontSize: Typography.xs, color: Colors.gray400 },
  customTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  groupCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  groupTitle: {
    fontSize: Typography.sm,
    fontWeight: "600",
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  permissionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  permissionInfo: { flexDirection: "row", alignItems: "center" },
  permissionName: { fontSize: Typography.sm, color: Colors.gray900 },
  defaultBadge: {
    backgroundColor: Colors.gray200,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  defaultBadgeText: { fontSize: Typography.xs, color: Colors.gray500 },
  saveContainer: { marginTop: Spacing.md },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  saveButtonText: { color: Colors.white, fontWeight: "600" },
});
