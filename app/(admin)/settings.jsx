import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  TextInput,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Settings,
  Shield,
  Bell,
  Database,
  Globe,
  Lock,
  Smartphone,
  ChevronRight,
  Save,
  RefreshCw,
  HardDrive,
} from "lucide-react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../constants/theme";

export default function SystemSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      appName: "Store Management System",
      defaultCurrency: "USD",
      defaultTimezone: "UTC",
    },
    security: {
      maxLoginAttempts: "5",
      sessionTimeout: "30",
      twoFactorEnabled: false,
    },
    notifications: {
      emailEnabled: true,
      pushEnabled: true,
      dailyReports: true,
      lowStockAlerts: true,
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      autoBackup: true,
    },
  });

  useEffect(() => {
    // In a real app, fetch settings from API
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, save settings to API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Success", "Settings saved successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {Icon && <Icon size={18} color={Colors.primary} />}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const SettingItem = ({
    icon: Icon,
    title,
    subtitle,
    value,
    onValueChange,
    right,
    input,
    inputValue,
    onInputChange,
    keyboardType,
  }) => (
    <View style={styles.settingItem}>
      {Icon && (
        <View style={styles.settingIcon}>
          <Icon size={18} color={Colors.gray500} />
        </View>
      )}
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        {input && (
          <TextInput
            style={styles.settingInput}
            value={inputValue}
            onChangeText={onInputChange}
            keyboardType={keyboardType || "default"}
            placeholderTextColor={Colors.gray400}
          />
        )}
      </View>
      {typeof value === "boolean" ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.gray300, true: Colors.primary }}
        />
      ) : (
        right || <ChevronRight size={18} color={Colors.gray400} />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>System Settings</Text>
          <Text style={styles.headerSubtitle}>
            Configure system preferences
          </Text>
        </View>

        <SettingSection title="General" icon={Globe}>
          <SettingItem
            icon={Globe}
            title="App Name"
            input
            inputValue={settings.general.appName}
            onInputChange={(text) =>
              setSettings({
                ...settings,
                general: { ...settings.general, appName: text },
              })
            }
          />
          <SettingItem
            icon={Globe}
            title="Default Currency"
            subtitle={settings.general.defaultCurrency}
            onValueChange={() =>
              Alert.alert("Currency", "Currency picker coming soon")
            }
          />
          <SettingItem
            icon={Globe}
            title="Default Timezone"
            subtitle={settings.general.defaultTimezone}
            onValueChange={() =>
              Alert.alert("Timezone", "Timezone picker coming soon")
            }
          />
        </SettingSection>

        <SettingSection title="Security" icon={Shield}>
          <SettingItem
            icon={Lock}
            title="Two-Factor Authentication"
            subtitle="Require 2FA for admin users"
            value={settings.security.twoFactorEnabled}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                security: { ...settings.security, twoFactorEnabled: value },
              })
            }
          />
          <SettingItem
            icon={Lock}
            title="Max Login Attempts"
            input
            inputValue={settings.security.maxLoginAttempts}
            onInputChange={(text) =>
              setSettings({
                ...settings,
                security: { ...settings.security, maxLoginAttempts: text },
              })
            }
            keyboardType="numeric"
          />
          <SettingItem
            icon={Lock}
            title="Session Timeout"
            subtitle="Minutes"
            input
            inputValue={settings.security.sessionTimeout}
            onInputChange={(text) =>
              setSettings({
                ...settings,
                security: { ...settings.security, sessionTimeout: text },
              })
            }
            keyboardType="numeric"
          />
        </SettingSection>

        <SettingSection title="Notifications" icon={Bell}>
          <SettingItem
            icon={Bell}
            title="Email Notifications"
            value={settings.notifications.emailEnabled}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  emailEnabled: value,
                },
              })
            }
          />
          <SettingItem
            icon={Smartphone}
            title="Push Notifications"
            value={settings.notifications.pushEnabled}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  pushEnabled: value,
                },
              })
            }
          />
          <SettingItem
            icon={Bell}
            title="Daily Reports"
            value={settings.notifications.dailyReports}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  dailyReports: value,
                },
              })
            }
          />
          <SettingItem
            icon={Bell}
            title="Low Stock Alerts"
            value={settings.notifications.lowStockAlerts}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  lowStockAlerts: value,
                },
              })
            }
          />
        </SettingSection>

        <SettingSection title="System" icon={Database}>
          <SettingItem
            icon={HardDrive}
            title="Maintenance Mode"
            subtitle="Put the system in maintenance mode"
            value={settings.system.maintenanceMode}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                system: { ...settings.system, maintenanceMode: value },
              })
            }
          />
          <SettingItem
            icon={Shield}
            title="Debug Mode"
            subtitle="Enable debug logging"
            value={settings.system.debugMode}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                system: { ...settings.system, debugMode: value },
              })
            }
          />
          <SettingItem
            icon={Database}
            title="Auto Backup"
            subtitle="Automatically backup data daily"
            value={settings.system.autoBackup}
            onValueChange={(value) =>
              setSettings({
                ...settings,
                system: { ...settings.system, autoBackup: value },
              })
            }
          />
        </SettingSection>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.refreshButton]}
            onPress={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1000);
            }}
          >
            <RefreshCw size={18} color={Colors.primary} />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.saveButton,
              saving && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Save size={18} color={Colors.white} />
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Changes may require restart to take effect
          </Text>
          <Text style={styles.versionText}>
            Version 1.0.0 • Store Management System
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["3xl"],
  },
  header: { paddingVertical: Spacing.md },
  headerTitle: {
    fontSize: Typography["2xl"],
    fontWeight: "bold",
    color: Colors.gray900,
  },
  headerSubtitle: { fontSize: Typography.sm, color: Colors.gray500 },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: "600",
    color: Colors.gray700,
    marginLeft: Spacing.sm,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  settingIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  settingInfo: { flex: 1 },
  settingTitle: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  settingSubtitle: { fontSize: Typography.xs, color: Colors.gray500 },
  settingInput: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
    backgroundColor: Colors.white,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  refreshButton: { backgroundColor: Colors.gray200 },
  refreshButtonText: {
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  saveButton: { backgroundColor: Colors.primary },
  saveButtonText: {
    color: Colors.white,
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
  buttonDisabled: { opacity: 0.7 },
  footer: { marginTop: Spacing["2xl"], alignItems: "center" },
  footerText: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    textAlign: "center",
  },
  versionText: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: Spacing.sm,
  },
});
