import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Droplets, Calendar, Clock, Plus } from 'lucide-react-native';
import { colors, typography, spacing } from '../../theme';

export default function IrrigationScreen() {
  const [autoIrrigation, setAutoIrrigation] = useState(false);
  const [schedules, setSchedules] = useState([
    {
      id: '1',
      field: 'Field A',
      days: ['Mon', 'Wed', 'Fri'],
      time: '06:00 AM',
      duration: 30,
      active: true,
    },
    {
      id: '2',
      field: 'Field B',
      days: ['Tue', 'Thu', 'Sat'],
      time: '07:00 AM',
      duration: 45,
      active: true,
    },
  ]);

  const totalWeeklyWater = schedules.reduce((sum, s) => {
    if (!s.active) return sum;
    const daysPerWeek = s.days.length;
    const litersPerMinute = 10; // Assumed flow rate
    return sum + (s.duration * litersPerMinute * daysPerWeek);
  }, 0);

  const toggleSchedule = (id) => {
    setSchedules(schedules.map(s =>
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Droplets color={colors.primary} size={32} />
            <Text style={styles.statValue}>{totalWeeklyWater.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Liters/Week</Text>
          </View>

          <View style={styles.statCard}>
            <Calendar color={colors.healthy} size={32} />
            <Text style={styles.statValue}>{schedules.filter(s => s.active).length}</Text>
            <Text style={styles.statLabel}>Active Schedules</Text>
          </View>
        </View>

        {/* Auto Irrigation Toggle */}
        <View style={styles.autoSection}>
          <View style={styles.autoHeader}>
            <View>
              <Text style={styles.autoTitle}>Auto Irrigation</Text>
              <Text style={styles.autoSubtitle}>Weather-based adjustments</Text>
            </View>
            <Switch
              value={autoIrrigation}
              onValueChange={setAutoIrrigation}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={autoIrrigation ? colors.primary : colors.disabled}
            />
          </View>
          {autoIrrigation && (
            <View style={styles.autoInfo}>
              <Text style={styles.autoInfoText}>
                System will automatically adjust watering based on rainfall and weather forecasts.
              </Text>
            </View>
          )}
        </View>

        {/* Irrigation Schedules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Irrigation Schedules</Text>

          {schedules.map((schedule) => (
            <View key={schedule.id} style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldName}>{schedule.field}</Text>
                  <View style={styles.scheduleDetails}>
                    <Clock color={colors.textSecondary} size={16} />
                    <Text style={styles.scheduleTime}>{schedule.time}</Text>
                    <Text style={styles.scheduleDuration}>• {schedule.duration} min</Text>
                  </View>
                </View>
                <Switch
                  value={schedule.active}
                  onValueChange={() => toggleSchedule(schedule.id)}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={schedule.active ? colors.healthy : colors.disabled}
                />
              </View>

              {/* Days of Week */}
              <View style={styles.daysContainer}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <View
                    key={day}
                    style={[
                      styles.dayBadge,
                      schedule.days.includes(day) && styles.dayBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        schedule.days.includes(day) && styles.dayTextActive,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Water Usage Estimate */}
              <View style={styles.usageContainer}>
                <Droplets color={colors.primary} size={16} />
                <Text style={styles.usageText}>
                  ~{schedule.duration * 10 * schedule.days.length} L/week
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Add Schedule Button */}
        <TouchableOpacity style={styles.addButton}>
          <Plus color={colors.primary} size={24} />
          <Text style={styles.addButtonText}>Add New Schedule</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  autoSection: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    elevation: 2,
  },
  autoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoTitle: {
    ...typography.h3,
    color: colors.text,
  },
  autoSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  autoInfo: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.accent + '20',
    borderRadius: 8,
  },
  autoInfoText: {
    ...typography.caption,
    color: colors.text,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  scheduleCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fieldName: {
    ...typography.h3,
    color: colors.text,
  },
  scheduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  scheduleTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  scheduleDuration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  daysContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  dayBadge: {
    flex: 1,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayBadgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  dayTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  usageText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    gap: spacing.sm,
  },
  addButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
