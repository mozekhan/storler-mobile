// import React from 'react';
// import { Stack } from 'expo-router';
// import { Colors } from '../../constants/theme';

// export default function AuthLayout() {
//   return (
//     <Stack>
//       <Stack.Screen 
//         name="login" 
//         options={{ 
//           headerShown: false 
//         }} 
//       />
//       <Stack.Screen 
//         name="forgot-password" 
//         options={{ 
//           title: 'Forgot Password',
//           headerBackTitle: 'Back',
//           headerStyle: { backgroundColor: Colors.white },
//           headerTintColor: Colors.gray800,
//         }} 
//       />
//     </Stack>
//   );
// }






















import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Forgot Password',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.gray800,
        }} 
      />
      <Stack.Screen 
        name="change-password" 
        options={{ 
          title: 'Change Password',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.gray800,
        }} 
      />
    </Stack>
  );
}