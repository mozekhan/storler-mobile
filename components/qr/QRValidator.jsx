// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   StyleSheet
// } from 'react-native';
// import { CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
// import Card from './Card';
// import Button from './Button';
// import api from '../../services/api';
// import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

// const QRValidator = ({ onValid, onInvalid }) => {
//   const [qrData, setQrData] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);

//   const handleValidate = async () => {
//     if (!qrData.trim()) {
//       Alert.alert('Error', 'Please enter QR data');
//       return;
//     }

//     setLoading(true);
//     setResult(null);

//     try {
//       const response = await api.post('/receipts/validate', {
//         qrData: qrData.trim()
//       });

//       const data = response.data.data;
//       setResult({
//         valid: true,
//         data: data,
//         message: 'QR code is valid'
//       });

//       if (onValid) {
//         onValid(data);
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Invalid QR code';
//       setResult({
//         valid: false,
//         message: errorMessage
//       });

//       if (onInvalid) {
//         onInvalid(errorMessage);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const ResultIcon = result?.valid ? CheckCircle : XCircle;
//   const resultColor = result?.valid ? Colors.success : Colors.error;

//   return (
//     <Card>
//       <Card.Header>
//         <Card.Title>Validate QR Code</Card.Title>
//       </Card.Header>
//       <Card.Body>
//         <View style={styles.container}>
//           <View style={styles.field}>
//             <Text style={styles.label}>QR Data</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Paste QR data here..."
//               value={qrData}
//               onChangeText={setQrData}
//               multiline
//               numberOfLines={3}
//               placeholderTextColor={Colors.gray400}
//             />
//           </View>

//           <Button
//             onPress={handleValidate}
//             loading={loading}
//             disabled={!qrData.trim()}
//           >
//             Validate QR
//           </Button>

//           {result && (
//             <View style={[
//               styles.resultContainer,
//               result.valid ? styles.resultValid : styles.resultInvalid
//             ]}>
//               <View style={styles.resultRow}>
//                 <ResultIcon size={24} color={resultColor} />
//                 <Text style={[
//                   styles.resultMessage,
//                   result.valid ? styles.resultValidText : styles.resultInvalidText
//                 ]}>
//                   {result.message}
//                 </Text>
//               </View>

//               {result.valid && result.data && (
//                 <View style={styles.resultDetails}>
//                   <Text style={styles.resultDetailText}>
//                     Transaction: {result.data.transaction?.transactionNumber}
//                   </Text>
//                   <Text style={styles.resultDetailText}>
//                     Type: {result.data.qrType}
//                   </Text>
//                   <Text style={styles.resultDetailText}>
//                     Status: {result.data.transaction?.status}
//                   </Text>
//                   {result.data.nextAction && (
//                     <View style={styles.nextActionContainer}>
//                       <Text style={styles.nextActionText}>
//                         Next Action: {result.data.nextAction}
//                       </Text>
//                     </View>
//                   )}
//                 </View>
//               )}
//             </View>
//           )}
//         </View>
//       </Card.Body>
//     </Card>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     gap: Spacing.md,
//   },
//   field: {
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
//     height: 80,
//     textAlignVertical: 'top',
//   },
//   resultContainer: {
//     padding: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     borderWidth: 1,
//   },
//   resultValid: {
//     backgroundColor: Colors.success + '10',
//     borderColor: Colors.success + '30',
//   },
//   resultInvalid: {
//     backgroundColor: Colors.error + '10',
//     borderColor: Colors.error + '30',
//   },
//   resultRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   resultMessage: {
//     fontSize: Typography.sm,
//     fontWeight: '500',
//     marginLeft: Spacing.sm,
//   },
//   resultValidText: {
//     color: Colors.success,
//   },
//   resultInvalidText: {
//     color: Colors.error,
//   },
//   resultDetails: {
//     marginTop: Spacing.sm,
//     paddingTop: Spacing.sm,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//   },
//   resultDetailText: {
//     fontSize: Typography.sm,
//     color: Colors.gray700,
//     marginTop: Spacing.xs,
//   },
//   nextActionContainer: {
//     marginTop: Spacing.sm,
//     backgroundColor: Colors.primary + '20',
//     padding: Spacing.sm,
//     borderRadius: BorderRadius.sm,
//   },
//   nextActionText: {
//     fontSize: Typography.sm,
//     color: Colors.primary,
//   },
// });

// export default QRValidator;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { QrCode, CheckCircle, XCircle, AlertCircle } from "lucide-react-native";
import QRService from "../../services/qrService";
import TransactionService from "../../services/transactionService";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../constants/theme";

const QRValidator = ({ onValid, onInvalid }) => {
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleValidate = async () => {
    if (!qrData.trim()) {
      Alert.alert("Error", "Please enter QR data");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // First validate with QR service
      const validation = await QRService.validateQR(qrData.trim());

      if (!validation.valid) {
        setResult({
          valid: false,
          message: validation.error || "Invalid QR code",
          data: null,
        });
        if (onInvalid) onInvalid(validation.error);
        setLoading(false);
        return;
      }

      // Then validate with backend
      const result = await TransactionService.validateQR(qrData.trim());

      if (result && result.isValid) {
        setResult({
          valid: true,
          message: "QR code is valid",
          data: result,
        });
        if (onValid) onValid(result);
      } else {
        setResult({
          valid: false,
          message: result?.error || "Invalid QR code",
          data: null,
        });
        if (onInvalid) onInvalid(result?.error);
      }
    } catch (error) {
      setResult({
        valid: false,
        message: error.response?.data?.message || "Failed to validate QR code",
        data: null,
      });
      if (onInvalid) onInvalid(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const ResultIcon = result?.valid ? CheckCircle : XCircle;
  const resultColor = result?.valid ? Colors.success : Colors.error;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <QrCode size={20} color={Colors.primary} />
        <Text style={styles.headerTitle}>Validate QR Code</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>QR Data</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste QR data here..."
          value={qrData}
          onChangeText={setQrData}
          multiline
          numberOfLines={3}
          placeholderTextColor={Colors.gray400}
        />
      </View>

      <TouchableOpacity
        style={[styles.validateButton, loading && styles.buttonDisabled]}
        onPress={handleValidate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} size="small" />
        ) : (
          <Text style={styles.validateButtonText}>Validate QR</Text>
        )}
      </TouchableOpacity>

      {result && (
        <View
          style={[
            styles.resultContainer,
            result.valid ? styles.resultValid : styles.resultInvalid,
          ]}
        >
          <View style={styles.resultHeader}>
            <ResultIcon size={20} color={resultColor} />
            <Text
              style={[
                styles.resultMessage,
                result.valid
                  ? styles.resultValidText
                  : styles.resultInvalidText,
              ]}
            >
              {result.message}
            </Text>
          </View>

          {result.valid && result.data && (
            <View style={styles.resultDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction</Text>
                <Text style={styles.detailValue}>
                  {result.data.transaction?.transactionNumber}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{result.data.qrType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>
                  {result.data.transaction?.status}
                </Text>
              </View>
              {result.data.nextAction && (
                <View style={styles.nextActionContainer}>
                  <AlertCircle size={14} color={Colors.primary} />
                  <Text style={styles.nextActionText}>
                    Next: {result.data.nextAction}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.md,
    fontWeight: "600",
    color: Colors.gray900,
    marginLeft: Spacing.sm,
  },
  field: { marginBottom: Spacing.md },
  label: {
    fontSize: Typography.sm,
    fontWeight: "500",
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
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: Colors.white,
  },
  validateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  validateButtonText: { color: Colors.white, fontWeight: "600" },
  buttonDisabled: { opacity: 0.7 },
  resultContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  resultValid: {
    backgroundColor: Colors.success + "10",
    borderColor: Colors.success + "30",
  },
  resultInvalid: {
    backgroundColor: Colors.error + "10",
    borderColor: Colors.error + "30",
  },
  resultHeader: { flexDirection: "row", alignItems: "center" },
  resultMessage: {
    fontSize: Typography.sm,
    fontWeight: "500",
    marginLeft: Spacing.sm,
  },
  resultValidText: { color: Colors.success },
  resultInvalidText: { color: Colors.error },
  resultDetails: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  detailLabel: { fontSize: Typography.sm, color: Colors.gray500 },
  detailValue: {
    fontSize: Typography.sm,
    fontWeight: "500",
    color: Colors.gray900,
  },
  nextActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary + "10",
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  nextActionText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
});

export default QRValidator;
