
// import React, { useEffect } from 'react';
// import { Stack } from 'expo-router';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';
// import useAuthStore from '../stores/authStore';

// export default function RootLayout() {
//   useEffect(() => {
//     // Initialize auth on app start
//     useAuthStore.getState().initialize();
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <StatusBar style="auto" />
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="index" />
//         <Stack.Screen name="(auth)" />
//         <Stack.Screen name="(app)" />
//         <Stack.Screen name="(admin)" />
//       </Stack>
//     </SafeAreaProvider>
//   );
// }























import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Buffer } from 'buffer';


import { ThemeProvider } from '../context/ThemeContext';
import useAuthStore from '../stores/authStore';

global.Buffer = global.Buffer || Buffer;

export default function RootLayout() {
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* <AuthProvider> */}
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
            <Stack.Screen name="(admin)" />
          </Stack>
        {/* </AuthProvider> */}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}