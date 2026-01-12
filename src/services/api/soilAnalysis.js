const MOCK_MODE = true;

const mockData = {
  soilType: 'Loamy',
  pH: 6.5,
  moisture: 'medium',
  nutrients: {
    nitrogen: 'low',
    phosphorus: 'medium',
    potassium: 'high',
  },
  recommendations: [
    'Add nitrogen-rich fertilizer',
    'Maintain current watering schedule',
    'Soil quality is good for most crops',
  ],
  fertilizerNeeded: true,
};

export async function analyzeSoil(imageUri, location = null) {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockData;
  }

  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'soil.jpg',
  });

  if (location) {
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lon);
  }

  const response = await fetch('http://localhost:5000/api/v1/analyze/soil', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
}
