import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { colors, typography, spacing } from '../../theme';
import useMarketStore from '../../store/useMarketStore';
import { fetchNews } from '../../services/api/news';

export default function NewsScreen() {
  const { news, loading, setNews, setLoading, setError, loadCachedData, isCacheValid } = useMarketStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'tips', label: 'Tips' },
    { id: 'weather', label: 'Weather' },
    { id: 'market', label: 'Market' },
    { id: 'technology', label: 'Technology' },
  ];

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    await loadCachedData();

    if (!isCacheValid() || selectedCategory !== 'all') {
      await fetchData();
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchNews(selectedCategory);
      await setNews(data.articles);
    } catch (err) {
      setError(err.message || 'Failed to fetch news');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'tips': return colors.healthy;
      case 'weather': return colors.warning;
      case 'market': return colors.primary;
      case 'technology': return colors.accent;
      default: return colors.textSecondary;
    }
  };

  if (loading && news.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Refresh */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Agricultural News</Text>
          <Text style={styles.subtitle}>Latest updates and tips</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw color={colors.primary} size={24} />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScrollView}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategory === cat.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat.id && styles.categoryButtonTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* News List */}
      <ScrollView style={styles.newsContainer}>
        {news.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No news articles found</Text>
          </View>
        ) : (
          news.map((article) => (
            <TouchableOpacity key={article.id} style={styles.newsCard}>
              {/* Article Image */}
              {article.imageUrl && (
                <Image
                  source={{ uri: article.imageUrl }}
                  style={styles.newsImage}
                  resizeMode="cover"
                />
              )}

              <View style={styles.newsContent}>
                {/* Category Badge */}
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(article.category) },
                  ]}
                >
                  <Text style={styles.categoryBadgeText}>
                    {article.category.toUpperCase()}
                  </Text>
                </View>

                {/* Article Title */}
                <Text style={styles.newsTitle}>{article.title}</Text>

                {/* Article Summary */}
                <Text style={styles.newsSummary} numberOfLines={2}>
                  {article.summary}
                </Text>

                {/* Article Footer */}
                <View style={styles.newsFooter}>
                  <Text style={styles.newsSource}>{article.source}</Text>
                  <Text style={styles.newsDate}>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
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
  categoryScrollView: {
    maxHeight: 50,
    backgroundColor: colors.surface,
  },
  categoryContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  newsContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  newsCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  newsContent: {
    padding: spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  categoryBadgeText: {
    ...typography.caption,
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  newsTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  newsSummary: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  newsSource: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  newsDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
