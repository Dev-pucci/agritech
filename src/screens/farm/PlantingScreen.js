import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Plus, X, Trash2 } from 'lucide-react-native';
import { colors, typography, spacing } from '../../theme';
import useFarmStore from '../../store/useFarmStore';

export default function PlantingScreen() {
  const { plantings, addPlanting, deletePlanting, loadFarmData } = useFarmStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    area: '',
  });

  useEffect(() => {
    loadFarmData();
  }, []);

  const markedDates = {};
  plantings.forEach(p => {
    if (p.plantingDate) {
      markedDates[p.plantingDate] = {
        marked: true,
        dotColor: colors.primary,
      };
    }
    if (p.expectedHarvestDate) {
      markedDates[p.expectedHarvestDate] = {
        ...markedDates[p.expectedHarvestDate],
        marked: true,
        dotColor: colors.healthy,
      };
    }
  });

  const handleAddPlanting = async () => {
    if (!formData.cropName || !formData.plantingDate) {
      Alert.alert('Error', 'Please fill in crop name and planting date');
      return;
    }

    await addPlanting(formData);
    setModalVisible(false);
    setFormData({
      cropName: '',
      variety: '',
      plantingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '',
      area: '',
    });
  };

  const handleDeletePlanting = (id, cropName) => {
    Alert.alert(
      'Delete Planting',
      `Are you sure you want to delete ${cropName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePlanting(id) },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planned': return colors.primary;
      case 'planted': return colors.healthy;
      case 'growing': return colors.warning;
      case 'ready': return colors.accent;
      case 'harvested': return colors.textSecondary;
      default: return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#fff',
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.disabled,
              dotColor: colors.primary,
              selectedDotColor: '#fff',
              arrowColor: colors.primary,
              monthTextColor: colors.primary,
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
          />
        </View>

        {/* Plantings List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            All Plantings ({plantings.length})
          </Text>

          {plantings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No plantings yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button to add your first planting</Text>
            </View>
          ) : (
            plantings.map((planting) => (
              <View key={planting.id} style={styles.plantingCard}>
                <View style={styles.plantingHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.plantingCrop}>{planting.cropName}</Text>
                    {planting.variety && (
                      <Text style={styles.plantingVariety}>{planting.variety}</Text>
                    )}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(planting.status) }]}>
                    <Text style={styles.statusText}>{planting.status.toUpperCase()}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePlanting(planting.id, planting.cropName)}
                  >
                    <Trash2 color={colors.critical} size={20} />
                  </TouchableOpacity>
                </View>

                <View style={styles.plantingDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Planted:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(planting.plantingDate).toLocaleDateString()}
                    </Text>
                  </View>
                  {planting.expectedHarvestDate && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Expected Harvest:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(planting.expectedHarvestDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  {planting.area && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Area:</Text>
                      <Text style={styles.detailValue}>{planting.area} hectares</Text>
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

      {/* Add Planting Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Planting</Text>
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

              <Text style={styles.inputLabel}>Variety</Text>
              <TextInput
                style={styles.input}
                value={formData.variety}
                onChangeText={(text) => setFormData({ ...formData, variety: text })}
                placeholder="e.g., Cherry Tomato"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Planting Date *</Text>
              <TextInput
                style={styles.input}
                value={formData.plantingDate}
                onChangeText={(text) => setFormData({ ...formData, plantingDate: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Expected Harvest Date</Text>
              <TextInput
                style={styles.input}
                value={formData.expectedHarvestDate}
                onChangeText={(text) => setFormData({ ...formData, expectedHarvestDate: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Area (hectares)</Text>
              <TextInput
                style={styles.input}
                value={formData.area}
                onChangeText={(text) => setFormData({ ...formData, area: text })}
                placeholder="e.g., 2.5"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />

              <TouchableOpacity style={styles.addButton} onPress={handleAddPlanting}>
                <Text style={styles.addButtonText}>Add Planting</Text>
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
  calendarContainer: {
    backgroundColor: colors.surface,
    elevation: 2,
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
  plantingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
  },
  plantingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  plantingCrop: {
    ...typography.h3,
    color: colors.text,
  },
  plantingVariety: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: spacing.xs,
  },
  plantingDetails: {
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
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
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
  addButton: {
    backgroundColor: colors.primary,
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
