const MOCK_MODE = true;

const mockData = {
  pestName: 'Aphids',
  scientificName: 'Aphidoidea',
  severity: 'medium',
  confidence: 92,
  lifecycle: 'Adults and nymphs present year-round in warm climates',
  treatmentMethods: [
    'Spray with insecticidal soap',
    'Use neem oil solution',
    'Introduce natural predators (ladybugs)',
  ],
  organicOptions: [
    'Neem oil spray',
    'Garlic spray solution',
    'Release beneficial insects',
  ],
  preventionTips: [
    'Regular plant inspection',
    'Remove affected plant parts',
    'Maintain plant health with proper nutrition',
  ],
};

export async function detectPest(imageUri, location = null) {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockData;
  }

  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'pest.jpg',
  });

  if (location) {
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lon);
  }

  const response = await fetch('http://localhost:5000/api/v1/analyze/pest', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
}
