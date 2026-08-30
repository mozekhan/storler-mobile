// import React, { useState, useRef, useCallback } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
//   Modal,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import { useRouter, useFocusEffect } from "expo-router";
// import { X, QrCode, CheckCircle, XCircle } from "lucide-react-native";
// import TransactionService from "../../../services/transactionService";
// import {
//   Colors,
//   Spacing,
//   Typography,
//   BorderRadius,
//   Shadows,
// } from "../../../constants/theme";

// const { width } = Dimensions.get("window");

// // How long we wait after a modal is dismissed before we start listening for
// // barcodes again. The printed QR / receipt is almost always still sitting in
// // the camera's frame right when a modal closes - re-arming instantly let the
// // very next camera frame re-scan the same code and re-run the whole flow.
// const RESCAN_COOLDOWN_MS = 1500;

// // Maps a validated QR's type + nextAction to where we send the user next.
// // These three cases never show a modal - they navigate straight through.
// const AUTO_ADVANCE = {
//   SALES: {
//     nextAction: "PROCEED_TO_PAYMENT",
//     pathname: "/(app)/(tabs)/finance",
//     mode: "pay",
//   },
//   PAYMENT: {
//     nextAction: "PROCEED_TO_WAREHOUSE",
//     pathname: "/(app)/(tabs)/warehouse",
//     mode: "release",
//   },
//   RELEASE: {
//     nextAction: "PROCEED_TO_INVOICE",
//     pathname: "/(app)/(modals)/receipt-preview",
//     mode: "invoice",
//   },
// };

// function ScanResultModal({ visible, type, title, message, primaryLabel, onPrimary, onDismiss }) {
//   const isSuccess = type === "success";
//   return (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
//       <View style={styles.alertOverlay}>
//         <View style={styles.alertContainer}>
//           <View style={styles.alertHeader}>
//             <Text style={styles.alertTitle}>{title}</Text>
//             <TouchableOpacity onPress={onDismiss} style={styles.alertCloseButton}>
//               <XCircle size={20} color={Colors.gray400} />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.alertBody}>
//             {isSuccess ? (
//               <CheckCircle size={40} color={Colors.success} style={styles.alertIcon} />
//             ) : (
//               <XCircle size={40} color={Colors.error} style={styles.alertIcon} />
//             )}
//             <Text style={styles.alertMessage}>{message}</Text>
//           </View>

//           <View style={styles.alertFooter}>
//             <TouchableOpacity
//               style={[styles.alertButton, styles.alertCancelButton]}
//               onPress={onDismiss}
//             >
//               <Text style={styles.alertCancelText}>
//                 {primaryLabel ? "Scan Again" : "OK"}
//               </Text>
//             </TouchableOpacity>
//             {primaryLabel && (
//               <TouchableOpacity
//                 style={[styles.alertButton, styles.alertPrimaryButton, styles.alertButtonMargin]}
//                 onPress={onPrimary}
//               >
//                 <Text style={styles.alertPrimaryText}>{primaryLabel}</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// export default function Scan() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const router = useRouter();

//   const [locked, setLocked] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isFocused, setIsFocused] = useState(true);
//   const [cameraKey, setCameraKey] = useState(0);
//   const [resultModal, setResultModal] = useState({
//     visible: false,
//     type: "error",
//     title: "",
//     message: "",
//     primaryLabel: null,
//     onPrimary: null,
//   });

//   // Refs back up the state above so the guard inside handleBarCodeScanned is
//   // synchronous and can't be bypassed by a camera callback that fires before
//   // a React state update has actually flushed to the native view.
//   const lockedRef = useRef(false);
//   const lastDataRef = useRef(null);
//   const navigatingRef = useRef(false);
//   const cooldownTimeoutRef = useRef(null);

//   const setLock = (value) => {
//     lockedRef.current = value;
//     setLocked(value);
//   };

//   const clearCooldown = () => {
//     if (cooldownTimeoutRef.current) {
//       clearTimeout(cooldownTimeoutRef.current);
//       cooldownTimeoutRef.current = null;
//     }
//   };

//   // Runs on every screen focus (including first mount). Remounting the
//   // CameraView via `cameraKey` guarantees no stale native scan buffer
//   // carries over from a previous visit to this screen.
//   useFocusEffect(
//     useCallback(() => {
//       setIsFocused(true);
//       setCameraKey((key) => key + 1);
//       setLoading(false);
//       setResultModal((prev) => (prev.visible ? { ...prev, visible: false } : prev));
//       clearCooldown();
//       lastDataRef.current = null;
//       navigatingRef.current = false;
//       setLock(false);

//       if (!permission?.granted) {
//         requestPermission();
//       }

//       return () => {
//         setIsFocused(false);
//         clearCooldown();
//       };
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []),
//   );

//   const rearmScanner = (delayMs = RESCAN_COOLDOWN_MS) => {
//     clearCooldown();
//     cooldownTimeoutRef.current = setTimeout(() => {
//       lastDataRef.current = null;
//       setLock(false);
//       cooldownTimeoutRef.current = null;
//     }, delayMs);
//   };

//   const showResult = ({ type, title, message, primaryLabel = null, onPrimary = null }) => {
//     setLoading(false);
//     setResultModal({ visible: true, type, title, message, primaryLabel, onPrimary });
//   };

//   const dismissModal = () => {
//     setResultModal((prev) => ({ ...prev, visible: false }));
//     rearmScanner();
//   };

//   const runPrimaryAction = () => {
//     const action = resultModal.onPrimary;
//     setResultModal((prev) => ({ ...prev, visible: false }));
//     // Navigating away - do NOT rearm here. useFocusEffect resets everything
//     // cleanly if/when the user returns to this screen.
//     if (action) action();
//   };

//   const navigateAway = (pathname, params) => {
//     setLoading(false);
//     navigatingRef.current = true;
//     router.push({ pathname, params });
//   };

//   const describeApiError = (error) => {
//     if (error?.response?.status === 500) {
//       return { title: "Server Error", message: "The server encountered an error. Please try again." };
//     }
//     if (error?.response?.data?.message) {
//       return { title: "Error", message: error.response.data.message };
//     }
//     if (error?.message) {
//       return { title: "Error", message: error.message };
//     }
//     return { title: "Error", message: "Failed to scan QR code" };
//   };

//   const processScan = async (data) => {
//     setLoading(true);

//     if (data && data.startsWith("data:image/")) {
//       showResult({
//         type: "error",
//         title: "Invalid QR Code Format",
//         message:
//           "This QR code appears to be an image rather than a scannable code.\n\nThe receipt was likely printed with the wrong QR data format.\nPlease reprint the receipt with the correct QR code format.",
//       });
//       return;
//     }

//     try {
//       JSON.parse(data);
//     } catch {
//       showResult({
//         type: "error",
//         title: "Invalid QR Code",
//         message: "The scanned QR code does not contain valid data.\nPlease ensure you're scanning a valid receipt QR code.",
//       });
//       return;
//     }

//     let result;
//     try {
//       result = await TransactionService.validateQR(data);
//     } catch (apiError) {
//       console.error("API Error during QR validation:", apiError);
//       showResult({ type: "error", ...describeApiError(apiError) });
//       return;
//     }

//     if (!result || !result.isValid) {
//       showResult({
//         type: "error",
//         title: "Invalid QR Code",
//         message: result?.error || "This QR code is not valid or expired.",
//       });
//       return;
//     }

//     const { transaction, qrType, nextAction, status } = result;

//     if (!transaction || !transaction._id) {
//       console.error("Transaction missing required fields:", transaction);
//       showResult({
//         type: "error",
//         title: "Invalid Transaction Data",
//         message: "The QR code validation returned incomplete transaction data.\n\nPlease try scanning again or contact support.",
//       });
//       return;
//     }

//     const auto = AUTO_ADVANCE[qrType];
//     if (auto && nextAction === auto.nextAction) {
//       navigateAway(auto.pathname, {
//         transactionId: transaction._id,
//         transactionNumber: transaction.transactionNumber,
//         totalAmount: transaction.totalAmount || 0,
//         itemCount: transaction.items?.length || 0,
//         invoiceNumber: transaction.finalInvoiceNumber || "",
//         qrData: data,
//         mode: auto.mode,
//       });
//       return;
//     }

//     if (qrType === "INVOICE" && nextAction === "COMPLETE_TRANSACTION") {
//       showResult({
//         type: "success",
//         title: "Transaction Complete!",
//         message: `Transaction ${transaction.transactionNumber || "Unknown"} has been completed successfully.`,
//         primaryLabel: "View Receipt",
//         // onPrimary: () =>
//         //   navigateAway("/(app)/(modals)/receipt-preview", {
//         //     transactionId: transaction._id,
//         //     mode: "final",
//         //   }),
//         onPrimary: () =>
//     navigateAway("/(app)/(modals)/receipt-preview", {
//     transactionId: transaction._id,
//     qrType: "FINAL",
//     mode: "final",
//     transactionNumber: transaction.transactionNumber || "",
//     invoiceNumber: transaction.finalInvoiceNumber || "",
//         }),
//       });
//       return;
//     }

//     showResult({
//       type: "success",
//       title: `${qrType || "QR"} Scanned`,
//       message: `Transaction: ${transaction.transactionNumber || "Unknown"}\nStatus: ${status || "Unknown"}\nTotal: $${(transaction.totalAmount || 0).toFixed(2)}`,
//       primaryLabel: "View Details",
//       onPrimary: () =>
//         navigateAway("/(app)/(modals)/transaction-detail", { id: transaction._id }),
//     });
//   };

//   const handleBarCodeScanned = ({ data }) => {
//     if (lockedRef.current || navigatingRef.current) return;
//     if (!data || data === lastDataRef.current) return;

//     lastDataRef.current = data;
//     setLock(true);
//     processScan(data);
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
//           <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//             <Text style={styles.permissionButtonText}>Grant Permission</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const cameraActive = isFocused && !locked;

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.cameraContainer}>
//         {isFocused && (
//           // IMPORTANT: CameraView renders NO children. As of Expo SDK 53+
//           // (new architecture), nesting any content inside <CameraView> is
//           // unsupported and logs "The <CameraView> component does not
//           // support children. This may lead to inconsistent behaviour or
//           // crashes." (see github.com/expo/expo/issues/37150). All overlay
//           // UI below is a separate, absolutely-positioned sibling instead.
//           <CameraView
//             key={cameraKey}
//             style={StyleSheet.absoluteFillObject}
//             facing="back"
//             active={cameraActive}
//             onBarcodeScanned={locked ? undefined : handleBarCodeScanned}
//             barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
//           />
//         )}

//         {/* Overlay UI - a sibling of CameraView, not a child of it */}
//         <View style={styles.cameraOverlay} pointerEvents="box-none">
//           <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
//             <X color={Colors.white} size={24} />
//           </TouchableOpacity>

//           <View style={styles.scanArea} pointerEvents="none">
//             <View style={styles.scanFrame}>
//               <View style={[styles.corner, styles.cornerTL]} />
//               <View style={[styles.corner, styles.cornerTR]} />
//               <View style={[styles.corner, styles.cornerBL]} />
//               <View style={[styles.corner, styles.cornerBR]} />
//             </View>
//             <Text style={styles.scanText}>Position QR code in the frame</Text>
//           </View>

//           {loading && (
//             <View style={styles.loadingOverlay} pointerEvents="none">
//               <ActivityIndicator color={Colors.white} size="large" />
//               <Text style={styles.loadingText}>Validating QR Code...</Text>
//             </View>
//           )}
//         </View>
//       </View>

//       <ScanResultModal
//         visible={resultModal.visible}
//         type={resultModal.type}
//         title={resultModal.title}
//         message={resultModal.message}
//         primaryLabel={resultModal.primaryLabel}
//         onPrimary={runPrimaryAction}
//         onDismiss={dismissModal}
//       />
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
//   cameraContainer: { flex: 1, position: "relative" },
//   cameraOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.3)",
//   },
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
//   cornerTL: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0, borderRadius: 2 },
//   cornerTR: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0, borderRadius: 2 },
//   cornerBL: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0, borderRadius: 2 },
//   cornerBR: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0, borderRadius: 2 },
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

//   // Result modal
//   alertOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: Spacing["2xl"],
//   },
//   alertContainer: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius["2xl"],
//     width: "100%",
//     maxWidth: 380,
//     ...Shadows.lg,
//     overflow: "hidden",
//   },
//   alertHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray100,
//   },
//   alertTitle: {
//     fontSize: Typography.lg,
//     fontWeight: "bold",
//     color: Colors.gray900,
//     flex: 1,
//   },
//   alertCloseButton: { padding: Spacing.xs },
//   alertBody: {
//     padding: Spacing.lg,
//     paddingVertical: Spacing["2xl"],
//     alignItems: "center",
//   },
//   alertIcon: { marginBottom: Spacing.sm },
//   alertMessage: {
//     fontSize: Typography.md,
//     color: Colors.gray700,
//     lineHeight: 24,
//     textAlign: "center",
//   },
//   alertFooter: {
//     flexDirection: "row",
//     padding: Spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray100,
//     justifyContent: "flex-end",
//   },
//   alertButton: {
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing["2xl"],
//     borderRadius: BorderRadius.lg,
//     minWidth: 80,
//     alignItems: "center",
//   },
//   alertButtonMargin: { marginLeft: Spacing.sm },
//   alertPrimaryButton: { backgroundColor: Colors.primary },
//   alertCancelButton: { backgroundColor: Colors.gray200 },
//   alertPrimaryText: {
//     color: Colors.white,
//     fontWeight: "600",
//     fontSize: Typography.sm,
//   },
//   alertCancelText: {
//     color: Colors.gray700,
//     fontWeight: "600",
//     fontSize: Typography.sm,
//   },
// });



































import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter, useFocusEffect } from "expo-router";
import { X, QrCode, CheckCircle, XCircle } from "lucide-react-native";
import TransactionService from "../../../services/transactionService";
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from "../../../constants/theme";

const { width } = Dimensions.get("window");

// How long we wait after a modal is dismissed before we start listening for
// barcodes again. The printed QR / receipt is almost always still sitting in
// the camera's frame right when a modal closes - re-arming instantly let the
// very next camera frame re-scan the same code and re-run the whole flow.
const RESCAN_COOLDOWN_MS = 1500;

// Maps a validated QR's type + nextAction to where we send the user next.
// These three cases never show a modal - they navigate straight through.
const AUTO_ADVANCE = {
  SALES: {
    nextAction: "PROCEED_TO_PAYMENT",
    pathname: "/(app)/(tabs)/finance",
    mode: "pay",
  },
  PAYMENT: {
    nextAction: "PROCEED_TO_WAREHOUSE",
    pathname: "/(app)/(tabs)/warehouse",
    mode: "release",
  },
  RELEASE: {
    nextAction: "PROCEED_TO_INVOICE",
    pathname: "/(app)/(modals)/receipt-preview",
    mode: "invoice",
  },
};

function ScanResultModal({ visible, type, title, message, primaryLabel, onPrimary, onDismiss }) {
  const isSuccess = type === "success";
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.alertOverlay}>
        <View style={styles.alertContainer}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertTitle}>{title}</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.alertCloseButton}>
              <XCircle size={20} color={Colors.gray400} />
            </TouchableOpacity>
          </View>

          <View style={styles.alertBody}>
            {isSuccess ? (
              <CheckCircle size={40} color={Colors.success} style={styles.alertIcon} />
            ) : (
              <XCircle size={40} color={Colors.error} style={styles.alertIcon} />
            )}
            <Text style={styles.alertMessage}>{message}</Text>
          </View>

          <View style={styles.alertFooter}>
            <TouchableOpacity
              style={[styles.alertButton, styles.alertCancelButton]}
              onPress={onDismiss}
            >
              <Text style={styles.alertCancelText}>
                {primaryLabel ? "Scan Again" : "OK"}
              </Text>
            </TouchableOpacity>
            {primaryLabel && (
              <TouchableOpacity
                style={[styles.alertButton, styles.alertPrimaryButton, styles.alertButtonMargin]}
                onPress={onPrimary}
              >
                <Text style={styles.alertPrimaryText}>{primaryLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [cameraKey, setCameraKey] = useState(0);
  const [resultModal, setResultModal] = useState({
    visible: false,
    type: "error",
    title: "",
    message: "",
    primaryLabel: null,
    onPrimary: null,
  });

  // Refs back up the state above so the guard inside handleBarCodeScanned is
  // synchronous and can't be bypassed by a camera callback that fires before
  // a React state update has actually flushed to the native view.
  const lockedRef = useRef(false);
  const lastDataRef = useRef(null);
  const navigatingRef = useRef(false);
  const cooldownTimeoutRef = useRef(null);

  const setLock = (value) => {
    lockedRef.current = value;
    setLocked(value);
  };

  const clearCooldown = () => {
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = null;
    }
  };

  // Runs on every screen focus (including first mount). Remounting the
  // CameraView via `cameraKey` guarantees no stale native scan buffer
  // carries over from a previous visit to this screen.
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      setCameraKey((key) => key + 1);
      setLoading(false);
      setResultModal((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      clearCooldown();
      lastDataRef.current = null;
      navigatingRef.current = false;
      setLock(false);

      if (!permission?.granted) {
        requestPermission();
      }

      return () => {
        setIsFocused(false);
        clearCooldown();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const rearmScanner = (delayMs = RESCAN_COOLDOWN_MS) => {
    clearCooldown();
    cooldownTimeoutRef.current = setTimeout(() => {
      lastDataRef.current = null;
      setLock(false);
      cooldownTimeoutRef.current = null;
    }, delayMs);
  };

  const showResult = ({ type, title, message, primaryLabel = null, onPrimary = null }) => {
    setLoading(false);
    setResultModal({ visible: true, type, title, message, primaryLabel, onPrimary });
  };

  const dismissModal = () => {
    setResultModal((prev) => ({ ...prev, visible: false }));
    rearmScanner();
  };

  const runPrimaryAction = () => {
    const action = resultModal.onPrimary;
    setResultModal((prev) => ({ ...prev, visible: false }));
    // Navigating away - do NOT rearm here. useFocusEffect resets everything
    // cleanly if/when the user returns to this screen.
    if (action) action();
  };

  const navigateAway = (pathname, params) => {
    setLoading(false);
    navigatingRef.current = true;
    router.push({ pathname, params });
  };

  const describeApiError = (error) => {
    if (error?.response?.status === 500) {
      return { title: "Server Error", message: "The server encountered an error. Please try again." };
    }
    if (error?.response?.data?.message) {
      return { title: "Error", message: error.response.data.message };
    }
    if (error?.message) {
      return { title: "Error", message: error.message };
    }
    return { title: "Error", message: "Failed to scan QR code" };
  };

  const processScan = async (data) => {
    setLoading(true);

    if (data && data.startsWith("data:image/")) {
      showResult({
        type: "error",
        title: "Invalid QR Code Format",
        message:
          "This QR code appears to be an image rather than a scannable code.\n\nThe receipt was likely printed with the wrong QR data format.\nPlease reprint the receipt with the correct QR code format.",
      });
      return;
    }

    try {
      JSON.parse(data);
    } catch {
      showResult({
        type: "error",
        title: "Invalid QR Code",
        message: "The scanned QR code does not contain valid data.\nPlease ensure you're scanning a valid receipt QR code.",
      });
      return;
    }

    let result;
    try {
      result = await TransactionService.validateQR(data);
    } catch (apiError) {
      console.error("API Error during QR validation:", apiError);
      showResult({ type: "error", ...describeApiError(apiError) });
      return;
    }

    if (!result || !result.isValid) {
      showResult({
        type: "error",
        title: "Invalid QR Code",
        message: result?.error || "This QR code is not valid or expired.",
      });
      return;
    }

    const { transaction, qrType, nextAction, status } = result;

    if (!transaction || !transaction._id) {
      console.error("Transaction missing required fields:", transaction);
      showResult({
        type: "error",
        title: "Invalid Transaction Data",
        message: "The QR code validation returned incomplete transaction data.\n\nPlease try scanning again or contact support.",
      });
      return;
    }

    const auto = AUTO_ADVANCE[qrType];
    if (auto && nextAction === auto.nextAction) {
      navigateAway(auto.pathname, {
        transactionId: transaction._id,
        transactionNumber: transaction.transactionNumber,
        totalAmount: transaction.totalAmount || 0,
        itemCount: transaction.items?.length || 0,
        invoiceNumber: transaction.finalInvoiceNumber || "",
        qrData: data,
        mode: auto.mode,
      });
      return;
    }

    if (qrType === "INVOICE" && nextAction === "COMPLETE_TRANSACTION") {
      showResult({
        type: "success",
        title: "Transaction Complete!",
        message: `Transaction ${transaction.transactionNumber || "Unknown"} has been completed successfully.`,
        primaryLabel: "View Receipt",
        // onPrimary: () =>
        //   navigateAway("/(app)/(modals)/receipt-preview", {
        //     transactionId: transaction._id,
        //     mode: "final",
        //   }),
        onPrimary: () =>
    navigateAway("/(app)/(modals)/receipt-preview", {
    transactionId: transaction._id,
    qrType: "FINAL",
    mode: "final",
    transactionNumber: transaction.transactionNumber || "",
    invoiceNumber: transaction.finalInvoiceNumber || "",
        }),
      });
      return;
    }

    showResult({
      type: "success",
      title: `${qrType || "QR"} Scanned`,
      message: `Transaction: ${transaction.transactionNumber || "Unknown"}\nStatus: ${status || "Unknown"}\nTotal: $${(transaction.totalAmount || 0).toFixed(2)}`,
      primaryLabel: "View Details",
      onPrimary: () =>
        navigateAway("/(app)/(modals)/transaction-detail", {
          // FIX: transaction-detail.jsx reads `params.transactionId`, but
          // this used to send the value under the key `id` - so it always
          // arrived as undefined no matter what was scanned, which is why
          // every field in the mounted params log showed undefined and the
          // screen could never leave its loading state.
          transactionId: transaction._id,
          transactionNumber: transaction.transactionNumber || "",
          qrType: qrType || "",
        }),
    });
  };

  const handleBarCodeScanned = ({ data }) => {
    if (lockedRef.current || navigatingRef.current) return;
    if (!data || data === lastDataRef.current) return;

    lastDataRef.current = data;
    setLock(true);
    processScan(data);
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

  const cameraActive = isFocused && !locked;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        {isFocused && (
          // IMPORTANT: CameraView renders NO children. As of Expo SDK 53+
          // (new architecture), nesting any content inside <CameraView> is
          // unsupported and logs "The <CameraView> component does not
          // support children. This may lead to inconsistent behaviour or
          // crashes." (see github.com/expo/expo/issues/37150). All overlay
          // UI below is a separate, absolutely-positioned sibling instead.
          <CameraView
            key={cameraKey}
            style={StyleSheet.absoluteFillObject}
            facing="back"
            active={cameraActive}
            onBarcodeScanned={locked ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
        )}

        {/* Overlay UI - a sibling of CameraView, not a child of it */}
        <View style={styles.cameraOverlay} pointerEvents="box-none">
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X color={Colors.white} size={24} />
          </TouchableOpacity>

          <View style={styles.scanArea} pointerEvents="none">
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <Text style={styles.scanText}>Position QR code in the frame</Text>
          </View>

          {loading && (
            <View style={styles.loadingOverlay} pointerEvents="none">
              <ActivityIndicator color={Colors.white} size="large" />
              <Text style={styles.loadingText}>Validating QR Code...</Text>
            </View>
          )}
        </View>
      </View>

      <ScanResultModal
        visible={resultModal.visible}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
        primaryLabel={resultModal.primaryLabel}
        onPrimary={runPrimaryAction}
        onDismiss={dismissModal}
      />
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
  cameraContainer: { flex: 1, position: "relative" },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
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
  cornerTL: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0, borderRadius: 2 },
  cornerTR: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0, borderRadius: 2 },
  cornerBL: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0, borderRadius: 2 },
  cornerBR: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0, borderRadius: 2 },
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

  // Result modal
  alertOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  alertContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius["2xl"],
    width: "100%",
    maxWidth: 380,
    ...Shadows.lg,
    overflow: "hidden",
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  alertTitle: {
    fontSize: Typography.lg,
    fontWeight: "bold",
    color: Colors.gray900,
    flex: 1,
  },
  alertCloseButton: { padding: Spacing.xs },
  alertBody: {
    padding: Spacing.lg,
    paddingVertical: Spacing["2xl"],
    alignItems: "center",
  },
  alertIcon: { marginBottom: Spacing.sm },
  alertMessage: {
    fontSize: Typography.md,
    color: Colors.gray700,
    lineHeight: 24,
    textAlign: "center",
  },
  alertFooter: {
    flexDirection: "row",
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    justifyContent: "flex-end",
  },
  alertButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    minWidth: 80,
    alignItems: "center",
  },
  alertButtonMargin: { marginLeft: Spacing.sm },
  alertPrimaryButton: { backgroundColor: Colors.primary },
  alertCancelButton: { backgroundColor: Colors.gray200 },
  alertPrimaryText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: Typography.sm,
  },
  alertCancelText: {
    color: Colors.gray700,
    fontWeight: "600",
    fontSize: Typography.sm,
  },
});
