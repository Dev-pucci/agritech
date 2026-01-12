import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AlertCircle, CheckCircle, Leaf, DollarSign, Clock, TrendingUp } from 'lucide-react-native';
import { colors, typography, spacing } from '../../theme';
import { getFertilizerRecommendations } from '../../services/api/fertilizerRecommendation';

export default function FertilizerScreen({ route, navigation }) {
  const { soilData } = route.params;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getFertilizerRecommendations(soilData);
      setData(result);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', 'Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return colors.critical;
      case 'moderate': return colors.warning;
      case 'low': return colors.healthy;
      default: return colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Analyzing soil data...</Text>
        <Text style={styles.loadingSubtext}>Generating personalized fertilizer recommendations</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <AlertCircle color={colors.critical} size={64} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadRecommendations}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Soil Summary Header */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Soil Analysis Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Type</Text>
            <Text style={styles.summaryValue}>{data.soilSummary.type}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>pH Level</Text>
            <Text style={styles.summaryValue}>{data.soilSummary.pH}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nitrogen (N)</Text>
            <Text style={[styles.summaryValue, styles.nutrientBadge, { color: getSeverityColor(data.soilSummary.nitrogen === 'low' ? 'high' : 'low') }]}>
              {data.soilSummary.nitrogen.toUpperCase()}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Phosphorus (P)</Text>
            <Text style={[styles.summaryValue, styles.nutrientBadge, { color: getSeverityColor(data.soilSummary.phosphorus === 'low' ? 'high' : 'low') }]}>
              {data.soilSummary.phosphorus.toUpperCase()}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Potassium (K)</Text>
            <Text style={[styles.summaryValue, styles.nutrientBadge, { color: getSeverityColor(data.soilSummary.potassium === 'low' ? 'high' : 'low') }]}>
              {data.soilSummary.potassium.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Cost Estimate */}
      <View style={[styles.card, { borderLeftColor: colors.accent }]}>
        <View style={styles.cardHeader}>
          <DollarSign color={colors.accent} size={24} />
          <Text style={styles.cardTitle}>Estimated Cost</Text>
        </View>
        <Text style={styles.costText}>{data.estimatedCost}</Text>
        <Text style={styles.costSubtext}>Based on recommended fertilizers</Text>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fertilizer Recommendations</Text>
        <Text style={styles.sectionSubtitle}>
          {data.recommendations.length} recommendation{data.recommendations.length !== 1 ? 's' : ''} for your soil
        </Text>

        {data.recommendations.map((rec, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.recommendationCard, { borderLeftColor: getSeverityColor(rec.severity) }]}
            onPress={() => toggleCard(index)}
            activeOpacity={0.7}
          >
            {/* Header */}
            <View style={styles.recHeader}>
              <View style={styles.recHeaderLeft}>
                <Leaf color={getSeverityColor(rec.severity)} size={24} />
                <View style={styles.recHeaderText}>
                  <Text style={styles.recNutrient}>{rec.nutrient}</Text>
                  <Text style={styles.recUrgency}>{rec.urgency}</Text>
                </View>
              </View>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(rec.severity) }]}>
                <Text style={styles.severityText}>{rec.severity.toUpperCase()}</Text>
              </View>
            </View>

            {/* Dosage & Timing */}
            <View style={styles.recInfo}>
              <View style={styles.recInfoRow}>
                <TrendingUp color={colors.textSecondary} size={16} />
                <Text style={styles.recInfoText}>{rec.dosage}</Text>
              </View>
              <View style={styles.recInfoRow}>
                <Clock color={colors.textSecondary} size={16} />
                <Text style={styles.recInfoText}>{rec.timing}</Text>
              </View>
            </View>

            {/* Expanded Details */}
            {expandedCards[index] && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedTitle}>Recommended Fertilizers:</Text>
                {rec.fertilizers.map((fert, fertIndex) => (
                  <View key={fertIndex} style={styles.fertilizerCard}>
                    <View style={styles.fertilizerHeader}>
                      <Text style={styles.fertilizerName}>{fert.name}</Text>
                      <Text style={styles.fertilizerNPK}>{fert.npk}</Text>
                    </View>
                    <Text style={styles.fertilizerType}>{fert.type}</Text>
                    <Text style={styles.fertilizerDesc}>{fert.description}</Text>
                    <View style={styles.fertilizerDetails}>
                      <View style={styles.fertilizerDetailRow}>
                        <Text style={styles.fertilizerDetailLabel}>Application:</Text>
                        <Text style={styles.fertilizerDetailValue}>{fert.application}</Text>
                      </View>
                      <View style={styles.fertilizerDetailRow}>
                        <Text style={styles.fertilizerDetailLabel}>Price:</Text>
                        <Text style={styles.fertilizerDetailValue}>₹{fert.price}</Text>
                      </View>
                      {fert.bestFor && (
                        <View style={styles.fertilizerDetailRow}>
                          <Text style={styles.fertilizerDetailLabel}>Best for:</Text>
                          <Text style={styles.fertilizerDetailValue}>{fert.bestFor.join(', ')}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
                <Text style={styles.tapHint}>Tap to collapse</Text>
              </View>
            )}

            {!expandedCards[index] && (
              <Text style={styles.tapHint}>Tap for fertilizer details</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* General Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Tips</Text>
        {data.generalTips.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <CheckCircle color={colors.healthy} size={20} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Back to Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('SoilAnalysis')}
        >
          <Text style={styles.primaryButtonText}>New Analysis</Text>
        </TouchableOpacity>
      </View>
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
    padding: spacing.lg,
  },
  loadingText: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
  },
  loadingSubtext: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.critical,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginTop: spacing.lg,
  },
  retryButtonText: {
    ...typography.button,
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    margin: spacing.md,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  nutrientBadge: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  costText: {
    ...typography.h2,
    color: colors.accent,
    marginVertical: spacing.xs,
  },
  costSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  recommendationCard: {
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
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  recHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recHeaderText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  recNutrient: {
    ...typography.h3,
    color: colors.text,
  },
  recUrgency: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  severityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  severityText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  recInfo: {
    marginBottom: spacing.sm,
  },
  recInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  recInfoText: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  expandedContent: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  expandedTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  fertilizerCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  fertilizerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  fertilizerName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  fertilizerNPK: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: 'bold',
  },
  fertilizerType: {
    ...typography.caption,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  fertilizerDesc: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  fertilizerDetails: {
    marginTop: spacing.sm,
  },
  fertilizerDetailRow: {
    marginBottom: spacing.xs,
  },
  fertilizerDetailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  fertilizerDetailValue: {
    ...typography.body,
    color: colors.text,
    fontSize: 13,
  },
  tapHint: {
    ...typography.caption,
    color: colors.accent,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  tipText: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  primaryButtonText: {
    ...typography.button,
    color: '#fff',
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.primary,
  },
});
