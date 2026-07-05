import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { Colors, Spacing, Typography } from '../constants/theme';

const PermissionGuard = ({
  children,
  permissions = [],
  fallback = null,
  requireAll = false,
}) => {
  const { user, isLoading } = useAuth();
  const { can, canAll } = useRole();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return fallback || null;
  }

  let hasAccess = false;
  if (requireAll) {
    hasAccess = canAll(permissions);
  } else {
    hasAccess = permissions.some(p => can(p));
  }

  if (!hasAccess) {
    return fallback || (
      <View style={styles.container}>
        <Text style={styles.text}>
          You don't have permission to view this content.
        </Text>
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  text: {
    color: Colors.gray500,
    textAlign: 'center',
    fontSize: Typography.md,
  },
});

export default PermissionGuard;