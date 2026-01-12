import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import ResultCard from '../../components/ResultCard';
import useImageStore from '../../store/useImageStore';
import { analyzeSoil } from '../../services/api/soilAnalysis';

export default function SoilAnalysisScreen() {
  const {
    selectedImage,
    result,
    loading,
    error,
    setImage,
    setAnalysisType,
    setResult,
    setLoading,
    setError,
    resetAnalysis
  } = useImageStore();

  React.useEffect(() => {
    setAnalysisType('soil');
  }, []);

  const handleImageSelected = async (uri) => {
    setImage(uri);

    try {
      setLoading(true);
      const analysisResult = await analyzeSoil(uri);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    }
  };

  const handleRetry = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);
      setError(null);
      const analysisResult = await analyzeSoil(selectedImage);
      setResult(analysisResult);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Analyzing soil composition...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetAnalysis}>
          <Text style={styles.resetButtonText}>Select New Image</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (result) {
    return (
      <View style={styles.container}>
        <ResultCard result={result} type="soil" />
        <TouchableOpacity style={styles.newAnalysisButton} onPress={resetAnalysis}>
          <Text style={styles.newAnalysisButtonText}>New Analysis</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImagePickerComponent
        imageUri={selectedImage}
        onImageSelected={handleImageSelected}
        onReset={resetAnalysis}
      />
    </View>
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
    padding: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.critical,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  retryButtonText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  newAnalysisButton: {
    backgroundColor: colors.primary,
    margin: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  newAnalysisButtonText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
});
