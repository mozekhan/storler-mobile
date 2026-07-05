// // app/(stacks)/transactions/[id]/_layout.jsx
// import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
// import { TouchableOpacity, View, Text } from 'react-native';
// import { ArrowLeft, FileText, CreditCard, Package, Clock, List } from 'lucide-react-native';
// import { Colors } from '../../../../../constants/theme';

// export default function TransactionDetailLayout() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();

//   return (
//     <Stack
//     screenOptions={{
//         headerShown: false,
//       }}>
//       <Stack.Screen
//         name="index"
//         options={{
//           title: "Receipt Details",
//         }}
//       />

//       <Stack.Screen
//         name="items"
//         options={{
//           title: 'Receipt Preview',
//           presentation: 'modal',
//         }}
//       />
//     </Stack>
//   );
// }





















// app/(stacks)/receipts/[id]/_layout.jsx
import { Stack } from "expo-router";

export default function ReceiptDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Receipt Details",
        }}
      />
      <Stack.Screen
        name="preview"
        options={{
          title: "Receipt Preview",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
