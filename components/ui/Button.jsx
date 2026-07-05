// import React from 'react';
// import {
//   TouchableOpacity,
//   Text,
//   ActivityIndicator,
//   StyleSheet
// } from 'react-native';
// import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

// const Button = ({
//   children,
//   variant = 'primary',
//   size = 'md',
//   loading = false,
//   disabled = false,
//   style,
//   ...props
// }) => {
//   const getVariantStyles = () => {
//     switch (variant) {
//       case 'primary':
//         return styles.primary;
//       case 'secondary':
//         return styles.secondary;
//       case 'danger':
//         return styles.danger;
//       case 'success':
//         return styles.success;
//       case 'warning':
//         return styles.warning;
//       case 'outline':
//         return styles.outline;
//       default:
//         return styles.primary;
//     }
//   };

//   const getSizeStyles = () => {
//     switch (size) {
//       case 'sm':
//         return styles.sm;
//       case 'md':
//         return styles.md;
//       case 'lg':
//         return styles.lg;
//       default:
//         return styles.md;
//     }
//   };

//   const getTextColor = () => {
//     switch (variant) {
//       case 'primary':
//         return styles.primaryText;
//       case 'secondary':
//         return styles.secondaryText;
//       case 'danger':
//         return styles.dangerText;
//       case 'success':
//         return styles.successText;
//       case 'warning':
//         return styles.warningText;
//       case 'outline':
//         return styles.outlineText;
//       default:
//         return styles.primaryText;
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={[
//         styles.button,
//         getVariantStyles(),
//         getSizeStyles(),
//         (disabled || loading) && styles.disabled,
//         style
//       ]}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {loading ? (
//         <ActivityIndicator color={variant === 'outline' ? Colors.primary : Colors.white} />
//       ) : (
//         <Text style={[styles.text, getTextColor()]}>
//           {children}
//         </Text>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     borderRadius: BorderRadius.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   primary: {
//     backgroundColor: Colors.primary,
//   },
//   secondary: {
//     backgroundColor: Colors.gray200,
//   },
//   danger: {
//     backgroundColor: Colors.error,
//   },
//   success: {
//     backgroundColor: Colors.success,
//   },
//   warning: {
//     backgroundColor: Colors.warning,
//   },
//   outline: {
//     backgroundColor: Colors.transparent,
//     borderWidth: 2,
//     borderColor: Colors.primary,
//   },
//   sm: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.xs,
//   },
//   md: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//   },
//   lg: {
//     paddingHorizontal: Spacing['2xl'],
//     paddingVertical: Spacing.md,
//   },
//   disabled: {
//     opacity: 0.5,
//   },
//   text: {
//     fontWeight: '600',
//     fontSize: Typography.sm,
//   },
//   primaryText: {
//     color: Colors.white,
//   },
//   secondaryText: {
//     color: Colors.gray700,
//   },
//   dangerText: {
//     color: Colors.white,
//   },
//   successText: {
//     color: Colors.white,
//   },
//   warningText: {
//     color: Colors.white,
//   },
//   outlineText: {
//     color: Colors.primary,
//   },
// });

// export default Button;

import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../constants/theme";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return styles.primary;
      case "secondary":
        return styles.secondary;
      case "danger":
        return styles.danger;
      case "success":
        return styles.success;
      case "warning":
        return styles.warning;
      case "outline":
        return styles.outline;
      default:
        return styles.primary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return styles.sm;
      case "md":
        return styles.md;
      case "lg":
        return styles.lg;
      default:
        return styles.md;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return styles.primaryText;
      case "secondary":
        return styles.secondaryText;
      case "danger":
        return styles.dangerText;
      case "success":
        return styles.successText;
      case "warning":
        return styles.warningText;
      case "outline":
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? Colors.primary : Colors.white}
        />
      ) : (
        <Text style={[styles.text, getTextColor()]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.gray200 },
  danger: { backgroundColor: Colors.error },
  success: { backgroundColor: Colors.success },
  warning: { backgroundColor: Colors.warning },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  sm: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  md: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  lg: { paddingHorizontal: Spacing["2xl"], paddingVertical: Spacing.md },
  disabled: { opacity: 0.5 },
  text: { fontWeight: "600", fontSize: Typography.sm },
  primaryText: { color: Colors.white },
  secondaryText: { color: Colors.gray700 },
  dangerText: { color: Colors.white },
  successText: { color: Colors.white },
  warningText: { color: Colors.white },
  outlineText: { color: Colors.primary },
});

export default Button;
