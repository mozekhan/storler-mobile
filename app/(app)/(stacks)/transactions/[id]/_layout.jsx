// import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
// import { TouchableOpacity, View, Text } from 'react-native';
// import { ArrowLeft, FileText, CreditCard, Package, Clock, List } from 'lucide-react-native';
// import { Colors } from '../../../../../constants/theme';

// export default function TransactionDetailLayout() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();

//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="index"
//         options={{
//           title: "Transaction Details",
//         }}
//       />

//       <Stack.Screen
//         name="items"
//         options={{
//           title: 'Transaction Items',
//           presentation: 'card',
//           headerShown: true,
//           headerStyle: {
//             backgroundColor: Colors.white,
//           },
//           headerTitleStyle: {
//             color: Colors.gray900,
//             fontWeight: '600',
//           },
//           headerLeft: () => (
//             <TouchableOpacity
//               onPress={() => router.back()}
//               style={{ marginLeft: 8 }}
//             >
//               <ArrowLeft size={24} color={Colors.gray900} />
//             </TouchableOpacity>
//           ),
//         }}
//       />
      
//       <Stack.Screen
//         name="payments"
//         options={{
//           title: 'Payments',
//           presentation: 'card',
//           headerShown: true,
//           headerStyle: {
//             backgroundColor: Colors.white,
//           },
//           headerTitleStyle: {
//             color: Colors.gray900,
//             fontWeight: '600',
//           },
//           headerLeft: () => (
//             <TouchableOpacity
//               onPress={() => router.back()}
//               style={{ marginLeft: 8 }}
//             >
//               <ArrowLeft size={24} color={Colors.gray900} />
//             </TouchableOpacity>
//           ),
//         }}
//       />
      
//       <Stack.Screen
//         name="receipts"
//         options={{
//           title: 'Receipts',
//           presentation: 'card',
//           headerShown: true,
//           headerStyle: {
//             backgroundColor: Colors.white,
//           },
//           headerTitleStyle: {
//             color: Colors.gray900,
//             fontWeight: '600',
//           },
//           headerLeft: () => (
//             <TouchableOpacity
//               onPress={() => router.back()}
//               style={{ marginLeft: 8 }}
//             >
//               <ArrowLeft size={24} color={Colors.gray900} />
//             </TouchableOpacity>
//           ),
//         }}
//       />
      
//       <Stack.Screen
//         name="timeline"
//         options={{
//           title: 'Timeline',
//           presentation: 'card',
//           headerShown: true,
//           headerStyle: {
//             backgroundColor: Colors.white,
//           },
//           headerTitleStyle: {
//             color: Colors.gray900,
//             fontWeight: '600',
//           },
//           headerLeft: () => (
//             <TouchableOpacity
//               onPress={() => router.back()}
//               style={{ marginLeft: 8 }}
//             >
//               <ArrowLeft size={24} color={Colors.gray900} />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//     </Stack>
//   );
// }