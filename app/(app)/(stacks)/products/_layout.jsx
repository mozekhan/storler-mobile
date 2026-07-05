// app/(stacks)/products/_layout.jsx
import { Stack } from "expo-router";

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Products",
        //   headerShown: true,
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: "New Product",
          presentation: "modal",
        //   headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Product Details",
        //   headerShown: true,
        }}
      />
    </Stack>
  );
}
