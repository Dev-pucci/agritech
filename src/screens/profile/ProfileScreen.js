import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, Settings, BookOpen, HelpCircle, ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing } from '../../theme';

export default function ProfileScreen({ navigation }) {
  const menuItems = [
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Notifications, language, units',
      icon: Settings,
      screen: 'Settings',
    },
    {
      id: 'guide',
      title: 'User Guide',
      subtitle: 'Learn how to use AgriExpert',
      icon: BookOpen,
      onPress: () => alert('User guide coming soon'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      icon: HelpCircle,
      onPress: () => alert('Support coming soon'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User color="#fff" size={48} />
        </View>
        <Text style={styles.userName}>Farmer</Text>
        <Text style={styles.userEmail}>farmer@agriexpert.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => {
              if (item.screen) {
                navigation.navigate(item.screen);
              } else if (item.onPress) {
                item.onPress();
              }
            }}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconContainer}>
                <item.icon color={colors.primary} size={24} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <ChevronRight color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.appName}>AgriExpert</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>© 2024 AgriExpert. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
  },
  menuContainer: {
    marginTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  appName: {
    ...typography.h3,
    color: colors.primary,
  },
  version: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  copyright: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
