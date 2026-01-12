import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Sprout, CalendarDays, TrendingUp, Plus } from 'lucide-react-native';
import { colors, typography, spacing } from '../../theme';
import useFarmStore from '../../store/useFarmStore';

export default function FarmDashboardScreen({ navigation }) {
  const { plantings, harvests, loading, loadFarmData, getActivePlantings, getUpcomingHarvests } = useFarmStore();

  useEffect(() => {
    loadFarmData();
  }, []);

  const activePlantings = getActivePlantings();
  const upcomingHarvests = getUpcomingHarvests();
  const totalYield = harvests.reduce((sum, h) => sum + (h.yield || 0), 0);

  const features = [
    {
      id: 'planting',
      title: 'Planting Schedule',
      subtitle: `${activePlantings.length} active crops`,
      icon: CalendarDays,
      color: colors.primary,
      screen: 'Planting',
    },
    {
      id: 'harvest',
      title: 'Harvest Tracking',
      subtitle: `${harvests.length} records`,
      icon: Sprout,
      color: colors.healthy,
      screen: 'Harvest',
    },
  ];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading farm data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Farm</Text>
        <Text style={styles.subtitle}>Manage your agricultural operations</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Sprout color={colors.primary} size={32} />
          <Text style={styles.statValue}>{activePlantings.length}</Text>
          <Text style={styles.statLabel}>Active Crops</Text>
        </View>

        <View style={styles.statCard}>
          <CalendarDays color={colors.warning} size={32} />
          <Text style={styles.statValue}>{upcomingHarvests.length}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>

        <View style={styles.statCard}>
          <TrendingUp color={colors.healthy} size={32} />
          <Text style={styles.statValue}>{totalYield.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Total Yield (kg)</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[styles.card, { borderLeftColor: feature.color }]}
            onPress={() => navigation.navigate(feature.screen)}
          >
            <feature.icon color={feature.color} size={40} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
            </View>
            <Plus color={colors.textSecondary} size={24} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Harvests */}
      {upcomingHarvests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Harvests (Next 2 Weeks)</Text>
          {upcomingHarvests.map((planting) => (
            <View key={planting.id} style={styles.upcomingCard}>
              <View>
                <Text style={styles.cropName}>{planting.cropName}</Text>
                <Text style={styles.cropDate}>
                  Expected: {new Date(planting.expectedHarvestDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.warning }]}>
                <Text style={styles.statusText}>READY SOON</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  upcomingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  cropName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  cropDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  statusText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: 'bold',
  },
});
