import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

const TabView = ({
  tabs,
  initialTab = 0,
  onTabChange,
  style,
  tabStyle,
  contentStyle,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index, tabs[index]);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key || index}
            style={[
              styles.tab,
              activeTab === index && styles.tabActive,
              tabStyle,
            ]}
            onPress={() => handleTabChange(index)}
          >
            {tab.icon && (
              <View style={styles.tabIcon}>
                {tab.icon}
              </View>
            )}
            <Text style={[
              styles.tabText,
              activeTab === index && styles.tabTextActive,
            ]}>
              {tab.label}
            </Text>
            {tab.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{tab.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.content, contentStyle]}>
        {tabs[activeTab]?.component || tabs[activeTab]?.content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabScroll: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  tabContainer: {
    paddingHorizontal: Spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: Colors.transparent,
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: Colors.gray500,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  tabIcon: {
    marginRight: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 1,
    marginLeft: Spacing.xs,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: Typography.xs,
    color: Colors.white,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});

export default TabView;