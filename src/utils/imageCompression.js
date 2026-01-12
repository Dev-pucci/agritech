import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Compresses image to reduce file size for faster uploads
 * @param {string} uri - Image URI from camera or gallery
 * @returns {Promise<string>} - Compressed image URI
 */
export async function compressImage(uri) {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }], // Max width 1024px, maintains aspect ratio
      {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG
      }
    );

    return manipResult.uri;
  } catch (error) {
    console.error('Image compression failed:', error);
    return uri; // Return original if compression fails
  }
}
