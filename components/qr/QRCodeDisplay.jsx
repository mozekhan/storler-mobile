// // components/QRCodeDisplay.jsx

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Share,
//   Dimensions,
// } from 'react-native';
// import { QrCode, Share2, Download } from 'lucide-react-native';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

// const { width } = Dimensions.get('window');

// export default function QRCodeDisplay({ qrData, transactionNumber, onClose }) {
//   const [loading, setLoading] = useState(false);

//   const handleShare = async () => {
//     if (!qrData) return;
    
//     try {
//       setLoading(true);
//       // Share the QR code image
//       const result = await Share.share({
//         message: `Scan this QR code for transaction ${transactionNumber}`,
//         url: qrData, // On some platforms, this will share the image
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Failed to share QR code');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     if (!qrData) return;
    
//     try {
//       setLoading(true);
//       // Download the QR code image
//       const filename = `qr_${transactionNumber}_${Date.now()}.png`;
//       const fileUri = FileSystem.documentDirectory + filename;
      
//       // Convert base64 to file
//       const base64Data = qrData.replace(/^data:image\/\w+;base64,/, '');
//       await FileSystem.writeAsStringAsync(fileUri, base64Data, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
      
//       // Share the file
//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(fileUri);
//       } else {
//         Alert.alert('Downloaded', `QR code saved to ${fileUri}`);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to download QR code');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!qrData) {
//     return (
//       <View style={styles.placeholderContainer}>
//         <QrCode size={64} color={Colors.gray400} />
//         <Text style={styles.placeholderText}>No QR code available</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Image 
//         source={{ uri: qrData }}
//         style={styles.qrImage}
//         resizeMode="contain"
//       />
      
//       <View style={styles.actions}>
//         <TouchableOpacity 
//           style={[styles.actionButton, styles.shareButton]} 
//           onPress={handleShare}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color={Colors.white} size="small" />
//           ) : (
//             <>
//               <Share2 size={16} color={Colors.white} />
//               <Text style={styles.actionText}>Share</Text>
//             </>
//           )}
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={[styles.actionButton, styles.downloadButton]} 
//           onPress={handleDownload}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color={Colors.white} size="small" />
//           ) : (
//             <>
//               <Download size={16} color={Colors.white} />
//               <Text style={styles.actionText}>Download</Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     padding: Spacing.md,
//   },
//   qrImage: {
//     width: width * 0.6,
//     height: width * 0.6,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//   },
//   actions: {
//     flexDirection: 'row',
//     marginTop: Spacing.md,
//     gap: Spacing.sm,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: Spacing.lg,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//   },
//   shareButton: {
//     backgroundColor: Colors.primary,
//   },
//   downloadButton: {
//     backgroundColor: Colors.success,
//   },
//   actionText: {
//     color: Colors.white,
//     fontWeight: '500',
//     marginLeft: Spacing.xs,
//   },
//   placeholderContainer: {
//     width: width * 0.6,
//     height: width * 0.6,
//     backgroundColor: Colors.gray100,
//     borderRadius: BorderRadius.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   placeholderText: {
//     marginTop: Spacing.sm,
//     color: Colors.gray500,
//   },
// });
























import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { QrCode, Share2, Download, X } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

const QRCodeDisplay = ({ qrData, title = 'QR Code', onClose, showActions = true }) => {
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!qrData) return;

    try {
      setLoading(true);
      const result = await Share.share({
        message: `Scan this QR code`,
        url: qrData,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!qrData) return;

    try {
      setLoading(true);
      const filename = `qr_code_${Date.now()}.png`;
      const fileUri = FileSystem.documentDirectory + filename;

      const base64Data = qrData.replace(/^data:image\/\w+;base64,/, '');
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Downloaded', `QR code saved to ${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download QR code');
    } finally {
      setLoading(false);
    }
  };

  if (!qrData) {
    return (
      <View style={styles.placeholderContainer}>
        <QrCode size={48} color={Colors.gray400} />
        <Text style={styles.placeholderText}>No QR code available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <View style={styles.qrContainer}>
        <Image
          source={{ uri: qrData }}
          style={styles.qrImage}
          resizeMode="contain"
        />
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Share2 size={16} color={Colors.white} />
                <Text style={styles.actionText}>Share</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton]}
            onPress={handleDownload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Download size={16} color={Colors.white} />
                <Text style={styles.actionText}>Download</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={20} color={Colors.gray500} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.md,
    position: 'relative',
  },
  title: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.gray900,
    marginBottom: Spacing.md,
  },
  qrContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  qrImage: {
    width: width * 0.5,
    height: width * 0.5,
  },
  actions: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  shareButton: {
    backgroundColor: Colors.primary,
  },
  downloadButton: {
    backgroundColor: Colors.success,
  },
  actionText: {
    color: Colors.white,
    fontWeight: '500',
    marginLeft: Spacing.xs,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    padding: Spacing.sm,
  },
  placeholderContainer: {
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.lg,
    padding: Spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: Spacing.sm,
    color: Colors.gray500,
  },
});

export default QRCodeDisplay;