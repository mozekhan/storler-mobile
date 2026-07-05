import { Stack } from "expo-router";

export default function ProductDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Product Details",
        }}
      />
      <Stack.Screen
        name="inventory"
        options={{
          title: "Inventory",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="movements"
        options={{
          title: "Stock Movements",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
