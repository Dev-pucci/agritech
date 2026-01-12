import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react-native';
import { colors, typography, spacing } from '../../theme';
import useMarketStore from '../../store/useMarketStore';
import { fetchMarketPrices } from '../../services/api/marketPrices';

export default function MarketPricesScreen({ navigation }) {
  const { prices, loading, error, setPrices, setLoading, setError, loadCachedData, isCacheValid } = useMarketStore();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Check cache first
    await loadCachedData();

    if (!isCacheValid()) {
      await fetchData();
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchMarketPrices();
      await setPrices(data.prices);
    } catch (err) {
      setError(err.message || 'Failed to fetch market prices');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color={colors.healthy} size={20} />;
      case 'down':
        return <TrendingDown color={colors.critical} size={20} />;
      default:
        return <Minus color={colors.textSecondary} size={20} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return colors.healthy;
      case 'down': return colors.critical;
      default: return colors.textSecondary;
    }
  };

  if (loading && prices.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading market prices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header with Refresh */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Market Prices</Text>
            <Text style={styles.subtitle}>Real-time crop pricing</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw color={colors.primary} size={24} />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Price Chart for Selected Crop */}
        {selectedCrop && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>{selectedCrop.cropName} Price Trend</Text>
            <LineChart
              data={{
                labels: selectedCrop.history.map(h => h.date.slice(5)),
                datasets: [{
                  data: selectedCrop.history.map(h => h.price),
                }],
              }}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={{
                backgroundColor: colors.surface,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(45, 80, 22, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: colors.primary,
                },
              }}
              bezier
              style={styles.chart}
            />
            <TouchableOpacity
              style={styles.closeChartButton}
              onPress={() => setSelectedCrop(null)}
            >
              <Text style={styles.closeChartText}>Close Chart</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Price Cards */}
        <View style={styles.pricesContainer}>
          {prices.map((price) => (
            <TouchableOpacity
              key={price.cropName}
              style={styles.priceCard}
              onPress={() => setSelectedCrop(price)}
            >
              <View style={styles.priceHeader}>
                <Text style={styles.cropName}>{price.cropName}</Text>
                {getTrendIcon(price.trend)}
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>
                  ${price.currentPrice.toFixed(2)}
                  <Text style={styles.unit}> /{price.unit}</Text>
                </Text>
              </View>

              <View style={styles.changeRow}>
                <Text style={[styles.changeText, { color: getTrendColor(price.trend) }]}>
                  {price.change > 0 ? '+' : ''}{price.change.toFixed(1)}%
                </Text>
                <Text style={styles.lastUpdated}>
                  Updated: {new Date(price.lastUpdated).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    ...typography.caption,
    color: colors.textSecondary,
  },
  refreshButton: {
    padding: spacing.sm,
  },
  errorContainer: {
    backgroundColor: colors.critical,
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: 8,
  },
  errorText: {
    ...typography.body,
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    elevation: 2,
  },
  chartTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  closeChartButton: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  closeChartText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
  pricesContainer: {
    padding: spacing.md,
  },
  priceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cropName: {
    ...typography.h3,
    color: colors.text,
  },
  priceRow: {
    marginBottom: spacing.sm,
  },
  currentPrice: {
    ...typography.h1,
    color: colors.primary,
  },
  unit: {
    ...typography.body,
    color: colors.textSecondary,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeText: {
    ...typography.body,
    fontWeight: '600',
  },
  lastUpdated: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
