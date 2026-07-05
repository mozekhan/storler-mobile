
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter } from 'expo-router';
// import api from '../../services/api';
// import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

// export default function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async () => {
//     if (!email) {
//       Alert.alert('Error', 'Please enter your email address');
//       return;
//     }

//     setLoading(true);
//     try {
//       await api.post('/auth/forgot-password', { email });
//       setSubmitted(true);
//     } catch (error) {
//       Alert.alert(
//         'Error',
//         error.response?.data?.message || 'Failed to send reset email'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.submittedContainer}>
//           <View style={styles.iconContainer}>
//             <Text style={styles.icon}>📧</Text>
//           </View>
//           <Text style={styles.submittedTitle}>
//             Check your email
//           </Text>
//           <Text style={styles.submittedText}>
//             We've sent a password reset link to{' '}
//             <Text style={styles.emailHighlight}>{email}</Text>
//           </Text>
//           <TouchableOpacity
//             style={styles.backLink}
//             onPress={() => router.push('/(auth)/login')}
//           >
//             <Text style={styles.backLinkText}>Back to login</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <View style={styles.contentContainer}>
//           <View style={styles.headerContainer}>
//             <Text style={styles.title}>
//               Forgot Password
//             </Text>
//             <Text style={styles.subtitle}>
//               Enter your email address and we'll send you a reset link
//             </Text>
//           </View>

//           <View>
//             <Text style={styles.label}>
//               Email Address
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your email"
//               value={email}
//               onChangeText={setEmail}
//               autoCapitalize="none"
//               keyboardType="email-address"
//               editable={!loading}
//               placeholderTextColor={Colors.gray400}
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.submitButton, loading && styles.submitButtonDisabled]}
//             onPress={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color={Colors.white} />
//             ) : (
//               <Text style={styles.submitButtonText}>
//                 Send Reset Link
//               </Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.backLink}
//             onPress={() => router.push('/(auth)/login')}
//           >
//             <Text style={styles.backLinkText}>Back to login</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: Spacing['2xl'],
//   },
//   headerContainer: {
//     marginBottom: Spacing['3xl'],
//   },
//   title: {
//     fontSize: Typography['3xl'],
//     fontWeight: 'bold',
//     color: Colors.gray900,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: Typography.sm,
//     color: Colors.gray500,
//     textAlign: 'center',
//     marginTop: Spacing.sm,
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
//   submitButton: {
//     backgroundColor: Colors.primary,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     marginTop: Spacing['2xl'],
//   },
//   submitButtonDisabled: {
//     opacity: 0.7,
//   },
//   submitButtonText: {
//     color: Colors.white,
//     textAlign: 'center',
//     fontWeight: '600',
//     fontSize: Typography.md,
//   },
//   backLink: {
//     marginTop: Spacing.md,
//   },
//   backLinkText: {
//     color: Colors.primary,
//     textAlign: 'center',
//   },
//   submittedContainer: {
//     flex: 1,
//     backgroundColor: Colors.white,
//     justifyContent: 'center',
//     paddingHorizontal: Spacing['2xl'],
//     alignItems: 'center',
//   },
//   iconContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: BorderRadius.full,
//     backgroundColor: Colors.success + '20',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: Spacing.md,
//   },
//   icon: {
//     fontSize: 36,
//   },
//   submittedTitle: {
//     fontSize: Typography['2xl'],
//     fontWeight: 'bold',
//     color: Colors.gray900,
//     textAlign: 'center',
//   },
//   submittedText: {
//     color: Colors.gray500,
//     textAlign: 'center',
//     marginTop: Spacing.sm,
//   },
//   emailHighlight: {
//     fontWeight: '500',
//   },
// });























import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { validators } from '../../utils/validators';

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const validation = validators.password(formData.newPassword);
      if (!validation.valid) {
        newErrors.newPassword = validation.message;
      }
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await changePassword(
        formData.currentPassword,
        formData.newPassword
      );
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Password changed successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to change password');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>
              Enter your current password and choose a new one
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={[styles.input, errors.currentPassword && styles.inputError]}
                placeholder="Enter current password"
                secureTextEntry
                value={formData.currentPassword}
                onChangeText={(text) => {
                  setFormData({ ...formData, currentPassword: text });
                  setErrors({ ...errors, currentPassword: '' });
                }}
                placeholderTextColor={Colors.gray400}
              />
              {errors.currentPassword && (
                <Text style={styles.errorText}>{errors.currentPassword}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={[styles.input, errors.newPassword && styles.inputError]}
                placeholder="Enter new password"
                secureTextEntry
                value={formData.newPassword}
                onChangeText={(text) => {
                  setFormData({ ...formData, newPassword: text });
                  setErrors({ ...errors, newPassword: '' });
                }}
                placeholderTextColor={Colors.gray400}
              />
              {errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}
              <Text style={styles.hint}>
                Password must be at least 8 characters with uppercase, lowercase, number, and special character
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirm new password"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(text) => {
                  setFormData({ ...formData, confirmPassword: text });
                  setErrors({ ...errors, confirmPassword: '' });
                }}
                placeholderTextColor={Colors.gray400}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['2xl'],
  },
  header: {
    marginBottom: Spacing['3xl'],
  },
  title: {
    fontSize: Typography['2xl'],
    fontWeight: 'bold',
    color: Colors.gray900,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.gray500,
    marginTop: Spacing.sm,
  },
  form: {
    gap: Spacing.md,
  },
  field: {
    marginBottom: Spacing.sm,
  },
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
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: Typography.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  hint: {
    fontSize: Typography.xs,
    color: Colors.gray400,
    marginTop: Spacing.xs,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: Typography.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.gray500,
  },
});