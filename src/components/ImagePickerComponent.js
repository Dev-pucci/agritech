import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import * as ImagePickerExpo from 'expo-image-picker';
import { Camera, ImageIcon, X } from 'lucide-react-native';
import { colors, typography, spacing } from '../theme';
import { requestCameraPermission, requestMediaLibraryPermission } from '../utils/permissions';
import { compressImage } from '../utils/imageCompression';

export default function ImagePickerComponent({ imageUri, onImageSelected, onReset }) {
  const pickFromCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePickerExpo.launchCameraAsync({
      mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const compressedUri = await compressImage(result.assets[0].uri);
      onImageSelected(compressedUri);
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePickerExpo.launchImageLibraryAsync({
      mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const compressedUri = await compressImage(result.assets[0].uri);
      onImageSelected(compressedUri);
    }
  };

  if (imageUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <X color="#fff" size={24} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Image Source</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={pickFromCamera}>
          <Camera color={colors.primary} size={32} />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
          <ImageIcon color={colors.primary} size={32} />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  label: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 120,
  },
  buttonText: {
    ...typography.body,
    color: colors.primary,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  previewContainer: {
    position: 'relative',
    margin: spacing.md,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  resetButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.critical,
    borderRadius: 20,
    padding: spacing.sm,
  },
});
