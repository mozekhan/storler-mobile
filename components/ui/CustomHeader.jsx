import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
  createStyles,
} from '../../constants/theme';

const CustomHeader = ({
  title,
  showBack = true,
  onBackPress,
  rightComponent,
  backgroundColor = Colors.white,
  titleColor = Colors.textPrimary,
  iconColor = Colors.textPrimary,
}) => {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 8,
          backgroundColor,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.side}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={handleBack}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={iconColor}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text
          numberOfLines={1}
          style={[styles.title, { color: titleColor }]}
        >
          {title}
        </Text>

        <View style={styles.side}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = createStyles({
  // wrapper: {
  //   ...Shadows.md,
  //   borderBottomLeftRadius: BorderRadius.xl,
  //   borderBottomRightRadius: BorderRadius.xl,
  // },

  container: {
    height: 50,
    // paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },

  side: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.xl,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});