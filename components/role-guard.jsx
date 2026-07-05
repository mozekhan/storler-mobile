// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { useAuth } from '../hooks/useAuth';
// import { Colors, Spacing, Typography } from '../constants/theme';

// const RoleGuard = ({
//   children,
//   roles = [],
//   fallback = null
// }) => {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return null;
//   }

//   if (!user) {
//     return fallback || null;
//   }

//   const hasAccess = roles.length === 0 || roles.includes(user.role);

//   if (!hasAccess) {
//     return fallback || (
//       <View style={styles.container}>
//         <Text style={styles.text}>
//           You don't have permission to view this content.
//         </Text>
//       </View>
//     );
//   }

//   return children;
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: Spacing.md,
//   },
//   text: {
//     color: Colors.gray500,
//     textAlign: 'center',
//     fontSize: Typography.md,
//   },
// });

// export default RoleGuard;


























import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { Colors, Spacing, Typography } from '../constants/theme';

const RoleGuard = ({ children, roles = [], fallback = null }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return fallback || null;
  }

  const hasAccess = roles.length === 0 || roles.includes(user.role);

  if (!hasAccess) {
    return fallback || (
      <View style={styles.container}>
        <Text style={styles.text}>You don't have permission to view this content.</Text>
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  text: {
    color: Colors.gray500,
    textAlign: 'center',
    fontSize: Typography.md,
  },
});

export default RoleGuard;