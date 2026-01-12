import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Leaf, Droplet, Bug } from 'lucide-react-native';
import { colors, typography, spacing } from '../../theme';

export default function ScannerHomeScreen({ navigation }) {
  const features = [
    {
      id: 'crop',
      title: 'Crop Health',
      subtitle: 'Detect diseases and issues',
      icon: Leaf,
      color: colors.healthy,
      screen: 'CropHealth',
    },
    {
      id: 'soil',
      title: 'Soil Analysis',
      subtitle: 'Check soil composition',
      icon: Droplet,
      color: colors.warning,
      screen: 'SoilAnalysis',
    },
    {
      id: 'pest',
      title: 'Pest Identification',
      subtitle: 'Identify and treat pests',
      icon: Bug,
      color: colors.critical,
      screen: 'PestDetection',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Scanner</Text>
      <Text style={styles.subtitle}>Select analysis type</Text>

      <View style={styles.cardsContainer}>
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
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  cardsContainer: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderLeftWidth: 4,
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
});
