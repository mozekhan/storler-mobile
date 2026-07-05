// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

// const Card = ({ children, style, ...props }) => {
//   return (
//     <View style={[styles.card, style]} {...props}>
//       {children}
//     </View>
//   );
// };

// Card.Header = ({ children, style, ...props }) => (
//   <View style={[styles.header, style]} {...props}>
//     {children}
//   </View>
// );

// Card.Title = ({ children, style, ...props }) => (
//   <Text style={[styles.title, style]} {...props}>
//     {children}
//   </Text>
// );

// Card.Body = ({ children, style, ...props }) => (
//   <View style={[styles.body, style]} {...props}>
//     {children}
//   </View>
// );

// Card.Footer = ({ children, style, ...props }) => (
//   <View style={[styles.footer, style]} {...props}>
//     {children}
//   </View>
// );

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   header: {
//     marginBottom: Spacing.md,
//   },
//   title: {
//     fontSize: Typography.lg,
//     fontWeight: '600',
//     color: Colors.gray900,
//   },
//   body: {},
//   footer: {
//     marginTop: Spacing.md,
//     paddingTop: Spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: Colors.gray200,
//   },
// });

// export default Card;























import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

const Card = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

Card.Header = ({ children, style, ...props }) => (
  <View style={[styles.header, style]} {...props}>
    {children}
  </View>
);

Card.Title = ({ children, style, ...props }) => (
  <Text style={[styles.title, style]} {...props}>
    {children}
  </Text>
);

Card.Body = ({ children, style, ...props }) => (
  <View style={[styles.body, style]} {...props}>
    {children}
  </View>
);

Card.Footer = ({ children, style, ...props }) => (
  <View style={[styles.footer, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.gray900,
  },
  body: {},
  footer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
});

export default Card;