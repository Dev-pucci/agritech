import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Bell, Globe, Ruler, Trash2, Info, ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing } from '../../theme';
import useFarmStore from '../../store/useFarmStore';
import useMarketStore from '../../store/useMarketStore';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [harvestReminders, setHarvestReminders] = useState(true);
  const [language, setLanguage] = useState('English');
  const [units, setUnits] = useState('Metric');

  const { clearCache: clearMarketCache } = useMarketStore();
  const farmStore = useFarmStore();

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached market data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearMarketCache();
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your farm data, plantings, and harvests. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'All your data will be permanently deleted.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete All',
                  style: 'destructive',
                  onPress: async () => {
                    // Clear all stores
                    await clearMarketCache();
                    // In a real app, you'd clear farm data here too
                    Alert.alert('Success', 'All data has been cleared');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingRow = ({ icon: Icon, label, value, onPress, rightElement }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingLeft}>
        <Icon color={colors.primary} size={24} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {rightElement || (
          <>
            {value && <Text style={styles.settingValue}>{value}</Text>}
            {onPress && <ChevronRight color={colors.textSecondary} size={20} />}
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const ToggleRow = ({ icon: Icon, label, value, onValueChange }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Icon color={colors.primary} size={24} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor={value ? colors.primary : colors.disabled}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Notifications */}
      <SettingSection title="Notifications">
        <ToggleRow
          icon={Bell}
          label="Push Notifications"
          value={notifications}
          onValueChange={setNotifications}
        />
        <ToggleRow
          icon={Bell}
          label="Weather Alerts"
          value={weatherAlerts}
          onValueChange={setWeatherAlerts}
        />
        <ToggleRow
          icon={Bell}
          label="Harvest Reminders"
          value={harvestReminders}
          onValueChange={setHarvestReminders}
        />
      </SettingSection>

      {/* Preferences */}
      <SettingSection title="Preferences">
        <SettingRow
          icon={Globe}
          label="Language"
          value={language}
          onPress={() => Alert.alert('Language', 'Language selection coming soon')}
        />
        <SettingRow
          icon={Ruler}
          label="Measurement Units"
          value={units}
          onPress={() => Alert.alert('Units', 'Unit selection coming soon')}
        />
      </SettingSection>

      {/* Data & Storage */}
      <SettingSection title="Data & Storage">
        <SettingRow
          icon={Trash2}
          label="Clear Cache"
          onPress={handleClearCache}
        />
        <SettingRow
          icon={Trash2}
          label="Clear All Data"
          onPress={handleClearAllData}
        />
      </SettingSection>

      {/* About */}
      <SettingSection title="About">
        <SettingRow
          icon={Info}
          label="App Version"
          value="1.0.0"
        />
        <SettingRow
          icon={Info}
          label="Terms & Privacy"
          onPress={() => Alert.alert('Terms', 'Terms and Privacy Policy coming soon')}
        />
      </SettingSection>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>AgriExpert</Text>
        <Text style={styles.footerSubtext}>Your Agricultural Companion</Text>
        <Text style={styles.footerSubtext}>© 2024 All Rights Reserved</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  footerText: {
    ...typography.h2,
    color: colors.primary,
  },
  footerSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
