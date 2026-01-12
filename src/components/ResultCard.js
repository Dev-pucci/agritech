import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { colors, typography, spacing } from '../theme';

export default function ResultCard({ result, type }) {
  const getStatusIcon = () => {
    if (type === 'crop') {
      switch (result.healthStatus) {
        case 'healthy':
          return <CheckCircle color={colors.healthy} size={32} />;
        case 'warning':
          return <AlertTriangle color={colors.warning} size={32} />;
        case 'critical':
          return <AlertCircle color={colors.critical} size={32} />;
        default:
          return null;
      }
    }
    return <CheckCircle color={colors.healthy} size={32} />;
  };

  const getStatusColor = () => {
    if (type === 'crop') {
      switch (result.healthStatus) {
        case 'healthy':
          return colors.healthy;
        case 'warning':
          return colors.warning;
        case 'critical':
          return colors.critical;
        default:
          return colors.primary;
      }
    }
    return colors.primary;
  };

  const renderCropHealth = () => (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>Crop:</Text>
        <Text style={styles.value}>{result.cropName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Health Status:</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{result.healthStatus.toUpperCase()}</Text>
        </View>
      </View>

      {result.disease && (
        <View style={styles.row}>
          <Text style={styles.label}>Issue:</Text>
          <Text style={[styles.value, { color: colors.critical }]}>{result.disease}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Confidence:</Text>
        <Text style={styles.value}>{result.confidence}%</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations:</Text>
        {result.recommendations.map((rec, index) => (
          <Text key={index} style={styles.recommendation}>• {rec}</Text>
        ))}
      </View>
    </>
  );

  const renderSoilAnalysis = () => (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>Soil Type:</Text>
        <Text style={styles.value}>{result.soilType}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>pH Level:</Text>
        <Text style={styles.value}>{result.pH}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Moisture:</Text>
        <Text style={styles.value}>{result.moisture.toUpperCase()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrients:</Text>
        <Text style={styles.nutrient}>Nitrogen: {result.nutrients.nitrogen}</Text>
        <Text style={styles.nutrient}>Phosphorus: {result.nutrients.phosphorus}</Text>
        <Text style={styles.nutrient}>Potassium: {result.nutrients.potassium}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations:</Text>
        {result.recommendations.map((rec, index) => (
          <Text key={index} style={styles.recommendation}>• {rec}</Text>
        ))}
      </View>
    </>
  );

  const renderPestDetection = () => (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>Pest:</Text>
        <Text style={styles.value}>{result.pestName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Scientific Name:</Text>
        <Text style={styles.value}>{result.scientificName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Severity:</Text>
        <View style={[styles.statusBadge, {
          backgroundColor: result.severity === 'high' ? colors.critical :
                          result.severity === 'medium' ? colors.warning : colors.healthy
        }]}>
          <Text style={styles.statusText}>{result.severity.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Treatment Methods:</Text>
        {result.treatmentMethods.map((method, index) => (
          <Text key={index} style={styles.recommendation}>• {method}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Organic Options:</Text>
        {result.organicOptions.map((option, index) => (
          <Text key={index} style={styles.recommendation}>• {option}</Text>
        ))}
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {getStatusIcon()}
        <Text style={styles.title}>Analysis Results</Text>
      </View>

      <View style={styles.content}>
        {type === 'crop' && renderCropHealth()}
        {type === 'soil' && renderSoilAnalysis()}
        {type === 'pest' && renderPestDetection()}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    marginLeft: spacing.md,
  },
  content: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  value: {
    ...typography.body,
    color: colors.text,
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
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  recommendation: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
  },
  nutrient: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
});
