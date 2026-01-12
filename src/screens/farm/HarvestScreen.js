import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Plus, X, Trash2 } from 'lucide-react-native';
import { colors, typography, spacing } from '../../theme';
import useFarmStore from '../../store/useFarmStore';

export default function HarvestScreen() {
  const { harvests, plantings, addHarvest, deleteHarvest, loadFarmData } = useFarmStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    harvestDate: new Date().toISOString().split('T')[0],
    yield: '',
    unit: 'kg',
    quality: 'average',
    notes: '',
    plantingId: null,
  });

  useEffect(() => {
    loadFarmData();
  }, []);

  const handleAddHarvest = async () => {
    if (!formData.cropName || !formData.harvestDate || !formData.yield) {
      Alert.alert('Error', 'Please fill in crop name, date, and yield');
      return;
    }

    await addHarvest({
      ...formData,
      yield: parseFloat(formData.yield),
    });

    setModalVisible(false);
    setFormData({
      cropName: '',
      harvestDate: new Date().toISOString().split('T')[0],
      yield: '',
      unit: 'kg',
      quality: 'average',
      notes: '',
      plantingId: null,
    });
  };

  const handleDeleteHarvest = (id, cropName) => {
    Alert.alert(
      'Delete Harvest',
      `Are you sure you want to delete ${cropName} harvest?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteHarvest(id) },
      ]
    );
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return colors.healthy;
      case 'good': return colors.accent;
      case 'average': return colors.warning;
      case 'poor': return colors.critical;
      default: return colors.textSecondary;
    }
  };

  const totalYield = harvests.reduce((sum, h) => sum + (h.yield || 0), 0);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{harvests.length}</Text>
            <Text style={styles.statLabel}>Total Harvests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalYield.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Total Yield (kg)</Text>
          </View>
        </View>

        {/* Harvests List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Harvest Records ({harvests.length})
          </Text>

          {harvests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No harvest records yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button to record your first harvest</Text>
            </View>
          ) : (
            harvests
              .sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate))
              .map((harvest) => (
                <View key={harvest.id} style={styles.harvestCard}>
                  <View style={styles.harvestHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.harvestCrop}>{harvest.cropName}</Text>
                      <Text style={styles.harvestDate}>
                        {new Date(harvest.harvestDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(harvest.quality) }]}>
                      <Text style={styles.qualityText}>{harvest.quality.toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteHarvest(harvest.id, harvest.cropName)}
                    >
                      <Trash2 color={colors.critical} size={20} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.harvestDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Yield:</Text>
                      <Text style={styles.detailValue}>
                        {harvest.yield} {harvest.unit}
                      </Text>
                    </View>
                    {harvest.notes && (
                      <View style={styles.notesContainer}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText}>{harvest.notes}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
          )}
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Plus color="#fff" size={32} />
      </TouchableOpacity>

      {/* Add Harvest Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Harvest</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color={colors.text} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.inputLabel}>Crop Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.cropName}
                onChangeText={(text) => setFormData({ ...formData, cropName: text })}
                placeholder="e.g., Tomato"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Harvest Date *</Text>
              <TextInput
                style={styles.input}
                value={formData.harvestDate}
                onChangeText={(text) => setFormData({ ...formData, harvestDate: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Yield *</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { flex: 2, marginRight: spacing.sm }]}
                  value={formData.yield}
                  onChangeText={(text) => setFormData({ ...formData, yield: text })}
                  placeholder="e.g., 150"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={formData.unit}
                  onChangeText={(text) => setFormData({ ...formData, unit: text })}
                  placeholder="kg"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <Text style={styles.inputLabel}>Quality</Text>
              <View style={styles.qualityButtons}>
                {['excellent', 'good', 'average', 'poor'].map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={[
                      styles.qualityButton,
                      formData.quality === q && { backgroundColor: getQualityColor(q) }
                    ]}
                    onPress={() => setFormData({ ...formData, quality: q })}
                  >
                    <Text style={[
                      styles.qualityButtonText,
                      formData.quality === q && { color: '#fff' }
                    ]}>
                      {q.charAt(0).toUpperCase() + q.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Any observations or notes"
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.textSecondary}
              />

              <TouchableOpacity style={styles.addButton} onPress={handleAddHarvest}>
                <Text style={styles.addButtonText}>Record Harvest</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  harvestCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
  },
  harvestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  harvestCrop: {
    ...typography.h3,
    color: colors.text,
  },
  harvestDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  qualityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginRight: spacing.sm,
  },
  qualityText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: spacing.xs,
  },
  harvestDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  notesContainer: {
    marginTop: spacing.sm,
  },
  notesLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notesText: {
    ...typography.caption,
    color: colors.text,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.healthy,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.primary,
  },
  inputLabel: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  qualityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  qualityButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    alignItems: 'center',
  },
  qualityButtonText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: colors.healthy,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  addButtonText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
});
