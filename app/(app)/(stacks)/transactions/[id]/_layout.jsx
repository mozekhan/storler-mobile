// app/(stacks)/transactions/[id]/_layout.jsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity, View, Text } from 'react-native';
import { ArrowLeft, FileText, CreditCard, Package, Clock, List } from 'lucide-react-native';
import { Colors } from '../../../../../constants/theme';

export default function TransactionDetailLayout() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <Stack
    screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Product Details",
        }}
      />

      <Stack.Screen
        name="items"
        options={{
          title: 'Transaction Items',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="payments"
        options={{
          title: 'Payments',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="receipts"
        options={{
          title: 'Receipts',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}