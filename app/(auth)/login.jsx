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
//   ScrollView,
//   StyleSheet
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../../hooks/useAuth';
// import { Colors, Spacing, Typography, BorderRadius, createStyles } from '../../constants/theme';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();
//   const router = useRouter();

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await login(email, password);
//       if (result.success) {
//         router.replace('/(app)');
//       } else {
//         Alert.alert('Login Failed', result.error || 'Invalid credentials');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred during login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styles.contentContainer}>
//             <View style={styles.headerContainer}>
//               <Text style={styles.title}>
//                 Store Management
//               </Text>
//               <Text style={styles.subtitle}>
//                 Sign in to your account
//               </Text>
//             </View>

//             <View style={styles.formContainer}>
//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>
//                   Email Address
//                 </Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your email"
//                   value={email}
//                   onChangeText={setEmail}
//                   autoCapitalize="none"
//                   keyboardType="email-address"
//                   editable={!loading}
//                   placeholderTextColor={Colors.gray400}
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.label}>
//                   Password
//                 </Text>
//                 <View style={styles.passwordContainer}>
//                   <TextInput
//                     style={styles.passwordInput}
//                     placeholder="Enter your password"
//                     value={password}
//                     onChangeText={setPassword}
//                     secureTextEntry={!showPassword}
//                     editable={!loading}
//                     placeholderTextColor={Colors.gray400}
//                   />
//                   <TouchableOpacity
//                     style={styles.showPasswordButton}
//                     onPress={() => setShowPassword(!showPassword)}
//                   >
//                     <Text style={styles.showPasswordText}>
//                       {showPassword ? 'Hide' : 'Show'}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={[styles.loginButton, loading && styles.loginButtonDisabled]}
//                 onPress={handleLogin}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color={Colors.white} />
//                 ) : (
//                   <Text style={styles.loginButtonText}>
//                     Sign In
//                   </Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => router.push('/(auth)/forgot-password')}
//                 style={styles.forgotPasswordLink}
//               >
//                 <Text style={styles.forgotPasswordText}>
//                   Forgot Password?
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.footerContainer}>
//               <Text style={styles.footerText}>
//                 By signing in, you agree to our Terms of Service and Privacy Policy
//               </Text>
//             </View>
//           </View>
//         </ScrollView>
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
//   scrollContent: {
//     flexGrow: 1,
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: Spacing['2xl'],
//     paddingVertical: Spacing['4xl'],
//   },
//   headerContainer: {
//     marginBottom: Spacing['3xl'],
//   },
//   title: {
//     fontSize: Typography['4xl'],
//     fontWeight: 'bold',
//     color: Colors.primary,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     textAlign: 'center',
//     marginTop: Spacing.sm,
//   },
//   formContainer: {
//     gap: Spacing.md,
//   },
//   inputGroup: {
//     marginBottom: Spacing.xs,
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
//   passwordContainer: {
//     position: 'relative',
//   },
//   passwordInput: {
//     borderWidth: 1,
//     borderColor: Colors.gray300,
//     borderRadius: BorderRadius.lg,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: Typography.md,
//     backgroundColor: Colors.white,
//     paddingRight: Spacing['4xl'],
//   },
//   showPasswordButton: {
//     position: 'absolute',
//     right: Spacing.md,
//     top: Spacing.md,
//   },
//   showPasswordText: {
//     color: Colors.primary,
//     fontSize: Typography.sm,
//   },
//   loginButton: {
//     backgroundColor: Colors.primary,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     marginTop: Spacing.md,
//   },
//   loginButtonDisabled: {
//     opacity: 0.7,
//   },
//   loginButtonText: {
//     color: Colors.white,
//     textAlign: 'center',
//     fontWeight: '600',
//     fontSize: Typography.md,
//   },
//   forgotPasswordLink: {
//     marginTop: Spacing.sm,
//   },
//   forgotPasswordText: {
//     color: Colors.primary,
//     textAlign: 'center',
//     fontSize: Typography.sm,
//   },
//   footerContainer: {
//     marginTop: Spacing['3xl'],
//   },
//   footerText: {
//     textAlign: 'center',
//     color: Colors.gray500,
//     fontSize: Typography.xs,
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
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { validators } from '../../utils/validators';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    
    const emailValidation = validators.email(email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Navigate based on role
        const user = result.user;
        if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
          // router.replace('/(admin)');
          router.replace('/(app)/(tabs)');
        } else {
          router.replace('/(app)/(tabs)');
        }
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            {/* Logo / Header */}
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>🏪</Text>
              </View>
              <Text style={styles.title}>
                Store Management
              </Text>
              <Text style={styles.subtitle}>
                Sign in to your account
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Email Address
                </Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrors({ ...errors, email: '' });
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                  placeholderTextColor={Colors.gray400}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Password
                </Text>
                <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors({ ...errors, password: '' });
                    }}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                    placeholderTextColor={Colors.gray400}
                  />
                  <TouchableOpacity
                    style={styles.showPasswordButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.showPasswordText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.loginButtonText}>
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password')}
                style={styles.forgotPasswordLink}
              >
                <Text style={styles.forgotPasswordText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Text>
              <Text style={styles.versionText}>
                Version 1.0.0
              </Text>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['4xl'],
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: Typography['3xl'],
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.md,
    color: Colors.gray500,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  formContainer: {
    gap: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.xs,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    paddingRight: Spacing.md,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.md,
  },
  showPasswordButton: {
    padding: Spacing.xs,
  },
  showPasswordText: {
    color: Colors.primary,
    fontSize: Typography.sm,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    ...Shadows.md,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: Colors.white,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: Typography.md,
  },
  forgotPasswordLink: {
    marginTop: Spacing.sm,
  },
  forgotPasswordText: {
    color: Colors.primary,
    textAlign: 'center',
    fontSize: Typography.sm,
  },
  footerContainer: {
    marginTop: Spacing['3xl'],
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: Colors.gray500,
    fontSize: Typography.xs,
    lineHeight: 18,
  },
  versionText: {
    textAlign: 'center',
    color: Colors.gray400,
    fontSize: Typography.xs,
    marginTop: Spacing.sm,
  },
});