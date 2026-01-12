import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

/**
 * Request camera permissions
 */
export async function requestCameraPermission() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Camera Access Required',
      'AgriExpert needs camera access to analyze your crops. Please enable it in settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  }

  return true;
}

/**
 * Request media library permissions
 */
export async function requestMediaLibraryPermission() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Gallery Access Required',
      'AgriExpert needs gallery access to select photos. Please enable it in settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  }

  return true;
}
