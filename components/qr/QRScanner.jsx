// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   StyleSheet
// } from 'react-native';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { X, Scan } from 'lucide-react-native';
// import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

// const QRScanner = ({ onScan, onClose, title = 'Scan QR Code' }) => {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scanning, setScanning] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const scannerRef = useRef(null);

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
//       if (onScan) {
//         await onScan(data);
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to scan QR code');
//       setScanning(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!permission?.granted) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>
//           Camera permission is required to scan QR codes
//         </Text>
//         <TouchableOpacity
//           style={styles.permissionButton}
//           onPress={requestPermission}
//         >
//           <Text style={styles.permissionButtonText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView
//         ref={scannerRef}
//         style={styles.camera}
//         onBarcodeScanned={handleBarCodeScanned}
//         barcodeScannerSettings={{
//           barcodeTypes: ['qr'],
//         }}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.header}>
//             <Text style={styles.headerTitle}>{title}</Text>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={onClose}
//             >
//               <X color={Colors.white} size={24} />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.scanArea}>
//             <View style={styles.scanFrame}>
//               <View style={[styles.corner, styles.cornerTL]} />
//               <View style={[styles.corner, styles.cornerTR]} />
//               <View style={[styles.corner, styles.cornerBL]} />
//               <View style={[styles.corner, styles.cornerBR]} />
//             </View>
//           </View>

//           <View style={styles.instructions}>
//             {loading ? (
//               <ActivityIndicator color={Colors.white} size="large" />
//             ) : (
//               <>
//                 <Scan color={Colors.white} size={24} />
//                 <Text style={styles.instructionsText}>
//                   Position QR code in the frame
//                 </Text>
//               </>
//             )}
//           </View>
//         </View>
//       </CameraView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.black,
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.gray50,
//     paddingHorizontal: Spacing['2xl'],
//   },
//   permissionText: {
//     fontSize: Typography.lg,
//     color: Colors.gray700,
//     textAlign: 'center',
//   },
//   permissionButton: {
//     marginTop: Spacing.md,
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing['2xl'],
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   permissionButtonText: {
//     color: Colors.white,
//     fontWeight: '600',
//   },
//   header: {
//     position: 'absolute',
//     top: Spacing['3xl'],
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: Spacing.md,
//   },
//   headerTitle: {
//     color: Colors.white,
//     fontSize: Typography.lg,
//     fontWeight: '600',
//   },
//   closeButton: {
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: Spacing.sm,
//     borderRadius: BorderRadius.full,
//   },
//   scanArea: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scanFrame: {
//     width: 256,
//     height: 256,
//     borderWidth: 2,
//     borderColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//   },
//   corner: {
//     position: 'absolute',
//     width: 32,
//     height: 32,
//     borderColor: Colors.primary,
//   },
//   cornerTL: {
//     top: 0,
//     left: 0,
//     borderTopWidth: 4,
//     borderLeftWidth: 4,
//   },
//   cornerTR: {
//     top: 0,
//     right: 0,
//     borderTopWidth: 4,
//     borderRightWidth: 4,
//   },
//   cornerBL: {
//     bottom: 0,
//     left: 0,
//     borderBottomWidth: 4,
//     borderLeftWidth: 4,
//   },
//   cornerBR: {
//     bottom: 0,
//     right: 0,
//     borderBottomWidth: 4,
//     borderRightWidth: 4,
//   },
//   instructions: {
//     position: 'absolute',
//     bottom: Spacing['3xl'],
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   instructionsText: {
//     color: Colors.white,
//     textAlign: 'center',
//     marginTop: Spacing.sm,
//   },
// });

// export default QRScanner;






















import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X, Scan } from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const QRScanner = ({ onScan, onClose, title = 'Scan QR Code' }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);

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
      if (onScan) {
        await onScan(data);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to scan QR code');
      setScanning(true);
    } finally {
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={scannerRef}
        style={styles.camera}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color={Colors.white} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          </View>

          <View style={styles.instructions}>
            {loading ? (
              <ActivityIndicator color={Colors.white} size="large" />
            ) : (
              <>
                <Scan color={Colors.white} size={24} />
                <Text style={styles.instructionsText}>Position QR code in the frame</Text>
              </>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  camera: { flex: 1 },
  overlay: { flex: 1 },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.gray50, paddingHorizontal: Spacing['2xl'] },
  permissionText: { fontSize: Typography.lg, color: Colors.gray700, textAlign: 'center' },
  permissionButton: { marginTop: Spacing.md, backgroundColor: Colors.primary, paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.md, borderRadius: BorderRadius.lg },
  permissionButtonText: { color: Colors.white, fontWeight: '600' },
  header: { position: 'absolute', top: Spacing['3xl'], left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md },
  headerTitle: { color: Colors.white, fontSize: Typography.lg, fontWeight: '600' },
  closeButton: { backgroundColor: 'rgba(0,0,0,0.5)', padding: Spacing.sm, borderRadius: BorderRadius.full },
  scanArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 256, height: 256, borderWidth: 2, borderColor: Colors.white, borderRadius: BorderRadius.lg },
  corner: { position: 'absolute', width: 32, height: 32, borderColor: Colors.primary },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  instructions: { position: 'absolute', bottom: Spacing['3xl'], left: 0, right: 0, alignItems: 'center' },
  instructionsText: { color: Colors.white, textAlign: 'center', marginTop: Spacing.sm },
});

export default QRScanner;