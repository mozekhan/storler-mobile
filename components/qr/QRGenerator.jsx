// import React, { useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Share,
//   Alert,
//   Platform,
//   StyleSheet
// } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import { Download, Share2 } from 'lucide-react-native';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import Card from './Card';
// import Button from './Button';
// import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

// const QRGenerator = ({
//   value,
//   title = 'QR Code',
//   size = 200,
//   showDownload = true,
//   showShare = true,
//   onGenerate
// }) => {
//   const [qrRef, setQrRef] = React.useState(null);

//   const handleDownload = async () => {
//     if (!qrRef) return;

//     try {
//       const uri = await qrRef.toDataURL();
//       const fileUri = FileSystem.documentDirectory + 'qr-code.png';
      
//       const base64 = uri.split(',')[1];
//       await FileSystem.writeAsStringAsync(fileUri, base64, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       if (Platform.OS === 'ios') {
//         await Sharing.shareAsync(fileUri);
//       } else {
//         Alert.alert('Success', 'QR Code saved to device');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to download QR code');
//     }
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: `QR Code: ${value}`,
//         title: title
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Failed to share QR code');
//     }
//   };

//   if (!value) {
//     return (
//       <Card>
//         <Card.Body>
//           <Text style={styles.emptyText}>
//             No data to generate QR code
//           </Text>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       {title && (
//         <Card.Header>
//           <Card.Title>{title}</Card.Title>
//         </Card.Header>
//       )}
//       <Card.Body>
//         <View style={styles.container}>
//           <View style={styles.qrContainer}>
//             <QRCode
//               value={value}
//               size={size}
//               color={Colors.black}
//               backgroundColor={Colors.white}
//               getRef={(ref) => setQrRef(ref)}
//             />
//           </View>

//           <View style={styles.buttonRow}>
//             {showDownload && (
//               <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handleDownload}>
//                 <Download size={16} color={Colors.primary} />
//                 <Text style={styles.outlineButtonText}>Download</Text>
//               </TouchableOpacity>
//             )}
//             {showShare && (
//               <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handleShare}>
//                 <Share2 size={16} color={Colors.primary} />
//                 <Text style={styles.outlineButtonText}>Share</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {value && (
//             <Text style={styles.valueText} numberOfLines={1}>
//               {value}
//             </Text>
//           )}
//         </View>
//       </Card.Body>
//     </Card>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//   },
//   qrContainer: {
//     backgroundColor: Colors.white,
//     padding: Spacing.md,
//     borderRadius: BorderRadius.lg,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     marginTop: Spacing.md,
//     gap: Spacing.sm,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//   },
//   outlineButton: {
//     borderWidth: 1,
//     borderColor: Colors.primary,
//     backgroundColor: Colors.transparent,
//   },
//   outlineButtonText: {
//     color: Colors.primary,
//     fontWeight: '500',
//     marginLeft: Spacing.sm,
//     fontSize: Typography.sm,
//   },
//   valueText: {
//     fontSize: Typography.xs,
//     color: Colors.gray500,
//     marginTop: Spacing.md,
//     textAlign: 'center',
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: Colors.gray500,
//     paddingVertical: Spacing['3xl'],
//   },
// });

// export default QRGenerator;

























import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  StyleSheet
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Download, Share2 } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const QRGenerator = ({
  value,
  title = 'QR Code',
  size = 200,
  showDownload = true,
  showShare = true,
}) => {
  const [qrRef, setQrRef] = useState(null);

  const handleDownload = async () => {
    if (!qrRef) return;

    try {
      const uri = await qrRef.toDataURL();
      const fileUri = FileSystem.documentDirectory + 'qr-code.png';
      const base64 = uri.split(',')[1];
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', 'QR Code saved to device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download QR code');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `QR Code: ${value}`,
        title: title
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  if (!value) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data to generate QR code</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.qrContainer}>
        <QRCode
          value={value}
          size={size}
          color={Colors.black}
          backgroundColor={Colors.white}
          getRef={(ref) => setQrRef(ref)}
        />
      </View>

      <View style={styles.buttonRow}>
        {showDownload && (
          <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handleDownload}>
            <Download size={16} color={Colors.primary} />
            <Text style={styles.outlineButtonText}>Download</Text>
          </TouchableOpacity>
        )}
        {showShare && (
          <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={handleShare}>
            <Share2 size={16} color={Colors.primary} />
            <Text style={styles.outlineButtonText}>Share</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.valueText} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  emptyContainer: { padding: Spacing.md, alignItems: 'center' },
  emptyText: { color: Colors.gray500, fontSize: Typography.sm },
  title: { fontSize: Typography.lg, fontWeight: '600', color: Colors.gray900, marginBottom: Spacing.md },
  qrContainer: { backgroundColor: Colors.white, padding: Spacing.md, borderRadius: BorderRadius.lg },
  buttonRow: { flexDirection: 'row', marginTop: Spacing.md, gap: Spacing.sm },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg },
  outlineButton: { borderWidth: 1, borderColor: Colors.primary, backgroundColor: Colors.transparent },
  outlineButtonText: { color: Colors.primary, fontWeight: '500', marginLeft: Spacing.sm, fontSize: Typography.sm },
  valueText: { fontSize: Typography.xs, color: Colors.gray500, marginTop: Spacing.md, textAlign: 'center' },
});

export default QRGenerator;