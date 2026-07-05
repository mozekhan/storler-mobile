// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet
// } from 'react-native';
// import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

// const Input = ({
//   label,
//   error,
//   style,
//   inputStyle,
//   ...props
// }) => {
//   return (
//     <View style={[styles.container, style]}>
//       {label && (
//         <Text style={styles.label}>{label}</Text>
//       )}
//       <TextInput
//         style={[
//           styles.input,
//           error && styles.inputError,
//           inputStyle
//         ]}
//         placeholderTextColor={Colors.gray400}
//         {...props}
//       />
//       {error && (
//         <Text style={styles.errorText}>{error}</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//   },
//   label: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     color: Colors.gray700,
//     marginBottom: Spacing.xs,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     backgroundColor: Colors.white,
//   },
//   inputError: {
//     borderColor: Colors.error,
//   },
//   errorText: {
//     fontSize: Typography.sm,
//     color: Colors.error,
//     marginTop: Spacing.xs,
//   },
// });

// export default Input;























import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const Input = ({
  label,
  error,
  style,
  inputStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          inputStyle
        ]}
        placeholderTextColor={Colors.gray400}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
    backgroundColor: Colors.white,
  },
  inputError: { borderColor: Colors.error },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

export default Input;