import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../constants/theme";

const Badge = ({
  children,
  variant = "default",
  style,
  textStyle,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "default":
        return styles.defaultBadge;
      case "primary":
        return styles.primaryBadge;
      case "success":
        return styles.successBadge;
      case "warning":
        return styles.warningBadge;
      case "error":
        return styles.errorBadge;
      case "info":
        return styles.infoBadge;
      default:
        return styles.defaultBadge;
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case "default":
        return styles.defaultText;
      case "primary":
        return styles.primaryText;
      case "success":
        return styles.successText;
      case "warning":
        return styles.warningText;
      case "error":
        return styles.errorText;
      case "info":
        return styles.infoText;
      default:
        return styles.defaultText;
    }
  };

  return (
    <View style={[styles.badge, getVariantStyles(), style]} {...props}>
      <Text style={[styles.text, getTextStyles(), textStyle]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: Typography.xs,
    fontWeight: "500",
  },
  defaultBadge: { backgroundColor: Colors.gray200 },
  defaultText: { color: Colors.gray700 },
  primaryBadge: { backgroundColor: Colors.primary + "20" },
  primaryText: { color: Colors.primary },
  successBadge: { backgroundColor: Colors.success + "20" },
  successText: { color: Colors.success },
  warningBadge: { backgroundColor: Colors.warning + "20" },
  warningText: { color: Colors.warning },
  errorBadge: { backgroundColor: Colors.error + "20" },
  errorText: { color: Colors.error },
  infoBadge: { backgroundColor: Colors.primary + "20" },
  infoText: { color: Colors.primary },
});

export default Badge;
