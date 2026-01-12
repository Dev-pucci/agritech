const MOCK_MODE = true;

const mockData = {
  cropName: 'Tomato',
  healthStatus: 'warning',
  disease: 'Early Blight',
  confidence: 87,
  recommendations: [
    'Remove affected leaves immediately',
    'Apply copper-based fungicide',
    'Ensure proper air circulation',
    'Avoid overhead watering',
  ],
  affectedArea: 25,
  timestamp: new Date().toISOString(),
};

export async function analyzeCrop(imageUri, location = null) {
  if (MOCK_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockData;
  }

  // Real API implementation
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'crop.jpg',
  });

  if (location) {
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lon);
  }

  const response = await fetch('http://localhost:5000/api/v1/analyze/crop', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
}
