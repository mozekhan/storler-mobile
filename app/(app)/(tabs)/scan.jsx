// // screens/scan.jsx - Delegates all validation to backend
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import { useRouter } from "expo-router";
// import { X, QrCode, CheckCircle, XCircle } from "lucide-react-native";
// import TransactionService from "../../../services/transactionService";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
// } from "../../../constants/theme";

// const { width } = Dimensions.get("window");

// export default function Scan() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scanning, setScanning] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [lastScanned, setLastScanned] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (!permission?.granted) {
//       requestPermission();
//     }
//   }, []);

//   const handleBarCodeScanned = async ({ data }) => {
//     if (!scanning || loading) return;
//     setScanning(false);
//     setLoading(true);

//     try {
//       // Delegate validation entirely to backend
//       const result = await TransactionService.validateQR(data);

//       if (result && result.isValid) {
//         const { transaction, qrType, nextAction, receiptData } = result;

//         setLastScanned({
//           transactionId: transaction._id,
//           transactionNumber: transaction.transactionNumber,
//           qrType,
//           nextAction,
//           success: true,
//         });

//         // Navigate based on QR type and next action
//         if (qrType === "SALES" && nextAction === "PROCEED_TO_PAYMENT") {
//           router.push({
//             pathname: "/(app)/(modals)/payment-modal",
//             params: { 
//               transactionId: transaction._id,
//               transactionNumber: transaction.transactionNumber,
//               totalAmount: transaction.totalAmount,
//               itemCount: transaction.items?.length || 0
//             },
//           });
//         } else if (qrType === "PAYMENT" && nextAction === "PROCEED_TO_WAREHOUSE") {
//           router.push({
//             pathname: "/(app)/(tabs)/warehouse",
//             params: { 
//               transactionId: transaction._id,
//               transactionNumber: transaction.transactionNumber,
//               invoiceNumber: transaction.finalInvoiceNumber
//             },
//           });
//         } else if (qrType === "RELEASE" && nextAction === "VIEW_INVOICE") {
//           router.push({
//             pathname: "/(app)/(modals)/transaction-detail",
//             params: { 
//               id: transaction._id,
//               invoiceNumber: transaction.finalInvoiceNumber,
//               showInvoice: "true"
//             },
//           });
//         } else if (qrType === "INVOICE" && nextAction === "COMPLETE_TRANSACTION") {
//           router.push({
//             pathname: "/(app)/(modals)/transaction-detail",
//             params: { 
//               id: transaction._id,
//               transactionNumber: transaction.transactionNumber,
//               showReceipt: "true"
//             },
//           });
//         } else {
//           // Generic success - show transaction details
//           Alert.alert(
//             "QR Validated",
//             `Transaction: ${transaction.transactionNumber}\n` +
//             `Status: ${transaction.status}\n` +
//             `Total: $${transaction.totalAmount?.toFixed(2)}\n` +
//             `Items: ${transaction.items?.length || 0}`,
//             [
//               {
//                 text: "View Details",
//                 onPress: () =>
//                   router.push({
//                     pathname: "/(app)/(modals)/transaction-detail",
//                     params: { id: transaction._id },
//                   }),
//               },
//               {
//                 text: "Scan Again",
//                 onPress: () => {
//                   setScanning(true);
//                   setLastScanned(null);
//                 },
//               },
//             ]
//           );
//         }
//       } else {
//         Alert.alert(
//           "Invalid QR Code",
//           result?.error || "This QR code is not valid or expired"
//         );
//         setScanning(true);
//       }
//     } catch (error) {
//       console.error("QR Scan Error:", error);
//       let errorMessage = "Failed to scan QR code";
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
//       Alert.alert("Error", errorMessage);
//       setScanning(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetScanner = () => {
//     setScanning(true);
//     setLastScanned(null);
//   };

//   if (!permission?.granted) {
//     return (
//       <SafeAreaView style={styles.permissionContainer}>
//         <View style={styles.permissionContent}>
//           <QrCode size={64} color={Colors.primary} />
//           <Text style={styles.permissionTitle}>Camera Permission Required</Text>
//           <Text style={styles.permissionText}>
//             Camera permission is required to scan QR codes for transactions
//           </Text>
//           <TouchableOpacity
//             style={styles.permissionButton}
//             onPress={requestPermission}
//           >
//             <Text style={styles.permissionButtonText}>Grant Permission</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.cameraContainer}>
//         <CameraView
//           style={styles.camera}
//           onBarcodeScanned={handleBarCodeScanned}
//           barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
//         >
//           <View style={styles.cameraOverlay}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => router.back()}
//             >
//               <X color={Colors.white} size={24} />
//             </TouchableOpacity>

//             <View style={styles.scanArea}>
//               <View style={styles.scanFrame}>
//                 <View style={[styles.corner, styles.cornerTL]} />
//                 <View style={[styles.corner, styles.cornerTR]} />
//                 <View style={[styles.corner, styles.cornerBL]} />
//                 <View style={[styles.corner, styles.cornerBR]} />
//               </View>
//               <Text style={styles.scanText}>Position QR code in the frame</Text>
//             </View>

//             {loading && (
//               <View style={styles.loadingOverlay}>
//                 <ActivityIndicator color={Colors.white} size="large" />
//                 <Text style={styles.loadingText}>Validating QR Code...</Text>
//               </View>
//             )}

//             {lastScanned && !loading && (
//               <View style={styles.resultOverlay}>
//                 <View style={styles.resultContent}>
//                   {lastScanned.success ? (
//                     <CheckCircle size={48} color={Colors.success} />
//                   ) : (
//                     <XCircle size={48} color={Colors.error} />
//                   )}
//                   <Text style={styles.resultTitle}>
//                     {lastScanned.success ? "QR Validated!" : "Invalid QR Code"}
//                   </Text>
//                   <Text style={styles.resultSubtitle}>
//                     {lastScanned.success
//                       ? `${lastScanned.transactionNumber || lastScanned.transactionId?.slice(-8)}`
//                       : "Please try again"}
//                   </Text>
//                   {lastScanned.nextAction && (
//                     <Text style={styles.resultNextAction}>
//                       Next: {lastScanned.nextAction.replace("_", " ")}
//                     </Text>
//                   )}
//                   <TouchableOpacity
//                     style={styles.resultButton}
//                     onPress={resetScanner}
//                   >
//                     <Text style={styles.resultButtonText}>Scan Again</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             )}
//           </View>
//         </CameraView>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.black },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: Colors.white,
//   },
//   permissionContent: {
//     alignItems: "center",
//     paddingHorizontal: Spacing["3xl"],
//   },
//   permissionTitle: {
//     fontSize: Typography.xl,
//     fontWeight: "bold",
//     color: Colors.gray900,
//     marginTop: Spacing.md,
//   },
//   permissionText: {
//     fontSize: Typography.md,
//     color: Colors.gray500,
//     textAlign: "center",
//     marginTop: Spacing.sm,
//     lineHeight: 24,
//   },
//   permissionButton: {
//     marginTop: Spacing["2xl"],
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing["3xl"],
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   permissionButtonText: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: Typography.md,
//   },
//   cameraContainer: { flex: 1 },
//   camera: { flex: 1 },
//   cameraOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
//   closeButton: {
//     position: "absolute",
//     top: Spacing.md,
//     right: Spacing.md,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     padding: Spacing.sm,
//     borderRadius: BorderRadius.full,
//     zIndex: 10,
//   },
//   scanArea: { flex: 1, justifyContent: "center", alignItems: "center" },
//   scanFrame: {
//     width: width * 0.65,
//     height: width * 0.65,
//     borderWidth: 2,
//     borderColor: "rgba(255,255,255,0.8)",
//     borderRadius: BorderRadius.lg,
//     backgroundColor: "transparent",
//   },
//   corner: {
//     position: "absolute",
//     width: 30,
//     height: 30,
//     borderColor: Colors.primary,
//     borderWidth: 3,
//   },
//   cornerTL: {
//     top: -2,
//     left: -2,
//     borderBottomWidth: 0,
//     borderRightWidth: 0,
//     borderRadius: 2,
//   },
//   cornerTR: {
//     top: -2,
//     right: -2,
//     borderBottomWidth: 0,
//     borderLeftWidth: 0,
//     borderRadius: 2,
//   },
//   cornerBL: {
//     bottom: -2,
//     left: -2,
//     borderTopWidth: 0,
//     borderRightWidth: 0,
//     borderRadius: 2,
//   },
//   cornerBR: {
//     bottom: -2,
//     right: -2,
//     borderTopWidth: 0,
//     borderLeftWidth: 0,
//     borderRadius: 2,
//   },
//   scanText: {
//     color: Colors.white,
//     textAlign: "center",
//     marginTop: Spacing["2xl"],
//     fontSize: Typography.md,
//     opacity: 0.8,
//   },
//   loadingOverlay: {
//     position: "absolute",
//     bottom: Spacing["4xl"],
//     left: 0,
//     right: 0,
//     alignItems: "center",
//   },
//   loadingText: {
//     color: Colors.white,
//     marginTop: Spacing.sm,
//     fontSize: Typography.sm,
//   },
//   resultOverlay: {
//     position: "absolute",
//     bottom: Spacing["4xl"],
//     left: Spacing["2xl"],
//     right: Spacing["2xl"],
//     backgroundColor: "rgba(0,0,0,0.8)",
//     borderRadius: BorderRadius["2xl"],
//     padding: Spacing["2xl"],
//     alignItems: "center",
//   },
//   resultContent: { alignItems: "center" },
//   resultTitle: {
//     color: Colors.white,
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     marginTop: Spacing.sm,
//   },
//   resultSubtitle: {
//     color: Colors.gray300,
//     fontSize: Typography.sm,
//     marginTop: Spacing.xs,
//   },
//   resultNextAction: {
//     color: Colors.primary,
//     fontSize: Typography.sm,
//     marginTop: Spacing.xs,
//     fontWeight: "500",
//   },
//   resultButton: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing["2xl"],
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//   },
//   resultButtonText: { color: Colors.white, fontWeight: "600" },
// });





























import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { X, QrCode, CheckCircle, XCircle } from "lucide-react-native";
import TransactionService from "../../../services/transactionService";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from "../../../constants/theme";

const { width } = Dimensions.get("window");

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (!scanning || loading) return;
    setScanning(false);
    setLoading(true);

    try {
      // First, validate the QR to determine its type
      const result = await TransactionService.validateQR(data);

      if (!result.isValid) {
        Alert.alert("Invalid QR Code", result.error || "This QR code is not valid or expired");
        setScanning(true);
        setLoading(false);
        return;
      }

      const { transaction, qrType, nextAction, status } = result;

      setLastScanned({
        transactionId: transaction._id,
        transactionNumber: transaction.transactionNumber,
        qrType,
        nextAction,
        success: true,
        status,
      });

      // Route based on QR type and next action
      switch (qrType) {
        case "SALES":
          if (nextAction === "PROCEED_TO_PAYMENT") {
            // Navigate to Payment Screen with transaction details
            router.push({
              pathname: "/(app)/(tabs)/finance",
              params: {
                transactionId: transaction._id,
                transactionNumber: transaction.transactionNumber,
                totalAmount: transaction.totalAmount,
                itemCount: transaction.items?.length || 0,
                qrData: data,
                mode: "pay",
              },
            });
          } else {
            Alert.alert(
              "Sales QR Scanned",
              `Transaction: ${transaction.transactionNumber}\nStatus: ${status}\nTotal: $${transaction.totalAmount?.toFixed(2)}`,
              [
                {
                  text: "View Details",
                  onPress: () => router.push({
                    pathname: "/(app)/(modals)/transaction-detail",
                    params: { id: transaction._id },
                  }),
                },
                {
                  text: "Scan Again",
                  onPress: () => { setScanning(true); setLastScanned(null); },
                },
              ]
            );
          }
          break;

        case "PAYMENT":
          if (nextAction === "PROCEED_TO_WAREHOUSE") {
            // Navigate to Warehouse Screen
            router.push({
              pathname: "/(app)/(tabs)/warehouse",
              params: {
                transactionId: transaction._id,
                transactionNumber: transaction.transactionNumber,
                totalAmount: transaction.totalAmount,
                qrData: data,
                mode: "release",
              },
            });
          } else {
            Alert.alert(
              "Payment QR Scanned",
              `Transaction: ${transaction.transactionNumber}\nStatus: ${status}\nTotal: $${transaction.totalAmount?.toFixed(2)}`,
              [
                {
                  text: "View Details",
                  onPress: () => router.push({
                    pathname: "/(app)/(modals)/transaction-detail",
                    params: { id: transaction._id },
                  }),
                },
                {
                  text: "Scan Again",
                  onPress: () => { setScanning(true); setLastScanned(null); },
                },
              ]
            );
          }
          break;

        case "RELEASE":
          if (nextAction === "PROCEED_TO_INVOICE") {
            // Navigate to Invoice View
            router.push({
              pathname: "/(app)/(modals)/receipt-preview",
              params: {
                transactionId: transaction._id,
                transactionNumber: transaction.transactionNumber,
                invoiceNumber: transaction.finalInvoiceNumber,
                qrData: data,
                mode: "invoice",
              },
            });
          } else {
            Alert.alert(
              "Release QR Scanned",
              `Transaction: ${transaction.transactionNumber}\nStatus: ${status}\nInvoice: ${transaction.finalInvoiceNumber || "N/A"}`,
              [
                {
                  text: "View Details",
                  onPress: () => router.push({
                    pathname: "/(app)/(modals)/transaction-detail",
                    params: { id: transaction._id },
                  }),
                },
                {
                  text: "Scan Again",
                  onPress: () => { setScanning(true); setLastScanned(null); },
                },
              ]
            );
          }
          break;

        case "INVOICE":
          if (nextAction === "COMPLETE_TRANSACTION") {
            // Complete the transaction
            Alert.alert(
              "Transaction Complete!",
              `Transaction ${transaction.transactionNumber} has been completed successfully.`,
              [
                {
                  text: "View Receipt",
                  onPress: () => router.push({
                    pathname: "/(app)/(modals)/receipt-preview",
                    params: {
                      transactionId: transaction._id,
                      mode: "final",
                    },
                  }),
                },
                {
                  text: "Scan Again",
                  onPress: () => { setScanning(true); setLastScanned(null); },
                },
              ]
            );
          } else {
            Alert.alert(
              "Invoice QR Scanned",
              `Transaction: ${transaction.transactionNumber}\nStatus: ${status}`,
              [
                {
                  text: "View Details",
                  onPress: () => router.push({
                    pathname: "/(app)/(modals)/transaction-detail",
                    params: { id: transaction._id },
                  }),
                },
                {
                  text: "Scan Again",
                  onPress: () => { setScanning(true); setLastScanned(null); },
                },
              ]
            );
          }
          break;

        default:
          Alert.alert(
            "QR Validated",
            `Type: ${qrType}\nTransaction: ${transaction.transactionNumber}\nStatus: ${status}`,
            [
              {
                text: "View Details",
                onPress: () => router.push({
                  pathname: "/(app)/(modals)/transaction-detail",
                  params: { id: transaction._id },
                }),
              },
              {
                text: "Scan Again",
                onPress: () => { setScanning(true); setLastScanned(null); },
              },
            ]
          );
      }
    } catch (error) {
      console.error("QR Scan Error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to scan QR code");
      setScanning(true);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanning(true);
    setLastScanned(null);
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionContent}>
          <QrCode size={64} color={Colors.primary} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            Camera permission is required to scan QR codes for transactions
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
              <X color={Colors.white} size={24} />
            </TouchableOpacity>

            <View style={styles.scanArea}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <Text style={styles.scanText}>Position QR code in the frame</Text>
            </View>

            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color={Colors.white} size="large" />
                <Text style={styles.loadingText}>Validating QR Code...</Text>
              </View>
            )}

            {lastScanned && !loading && (
              <View style={styles.resultOverlay}>
                <View style={styles.resultContent}>
                  {lastScanned.success ? (
                    <CheckCircle size={48} color={Colors.success} />
                  ) : (
                    <XCircle size={48} color={Colors.error} />
                  )}
                  <Text style={styles.resultTitle}>
                    {lastScanned.success ? "QR Validated!" : "Invalid QR Code"}
                  </Text>
                  <Text style={styles.resultSubtitle}>
                    {lastScanned.success
                      ? `${lastScanned.transactionNumber || lastScanned.transactionId?.slice(-8)}`
                      : "Please try again"}
                  </Text>
                  {lastScanned.nextAction && (
                    <Text style={styles.resultNextAction}>
                      Next: {lastScanned.nextAction.replace("_", " ")}
                    </Text>
                  )}
                  <Text style={styles.resultStatus}>
                    Status: {lastScanned.status || "Unknown"}
                  </Text>
                  <TouchableOpacity style={styles.resultButton} onPress={resetScanner}>
                    <Text style={styles.resultButtonText}>Scan Again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  permissionContent: {
    alignItems: "center",
    paddingHorizontal: Spacing["3xl"],
  },
  permissionTitle: {
    fontSize: Typography.xl,
    fontWeight: "bold",
    color: Colors.gray900,
    marginTop: Spacing.md,
  },
  permissionText: {
    fontSize: Typography.md,
    color: Colors.gray500,
    textAlign: "center",
    marginTop: Spacing.sm,
    lineHeight: 24,
  },
  permissionButton: {
    marginTop: Spacing["2xl"],
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing["3xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  permissionButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: Typography.md,
  },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  closeButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    zIndex: 10,
  },
  scanArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  scanFrame: {
    width: width * 0.65,
    height: width * 0.65,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: BorderRadius.lg,
    backgroundColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderRadius: 2,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: 2,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderRadius: 2,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRadius: 2,
  },
  scanText: {
    color: Colors.white,
    textAlign: "center",
    marginTop: Spacing["2xl"],
    fontSize: Typography.md,
    opacity: 0.8,
  },
  loadingOverlay: {
    position: "absolute",
    bottom: Spacing["4xl"],
    left: 0,
    right: 0,
    alignItems: "center",
  },
  loadingText: {
    color: Colors.white,
    marginTop: Spacing.sm,
    fontSize: Typography.sm,
  },
  resultOverlay: {
    position: "absolute",
    bottom: Spacing["4xl"],
    left: Spacing["2xl"],
    right: Spacing["2xl"],
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["2xl"],
    alignItems: "center",
  },
  resultContent: { alignItems: "center" },
  resultTitle: {
    color: Colors.white,
    fontSize: Typography.lg,
    fontWeight: "bold",
    marginTop: Spacing.sm,
  },
  resultSubtitle: {
    color: Colors.gray300,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
  },
  resultNextAction: {
    color: Colors.primary,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
    fontWeight: "500",
  },
  resultStatus: {
    color: Colors.gray300,
    fontSize: Typography.sm,
    marginTop: 2,
  },
  resultButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  resultButtonText: { color: Colors.white, fontWeight: "600" },
});