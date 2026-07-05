// // app/(stacks)/transactions/_layout.jsx
// import { Stack } from "expo-router";

// export default function TransactionsLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="index"
//         options={{
//           title: "Recepts",
//         }}
//       />
//       <Stack.Screen
//         name="[id]"
//         options={{
//           title: "Receipt Details",
//         }}
//       />
//     </Stack>
//   );
// }























// app/(stacks)/receipts/_layout.jsx
import { Stack } from "expo-router";

export default function ReceiptsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Receipts",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Receipt Details",
        }}
      />
    </Stack>
  );
}
