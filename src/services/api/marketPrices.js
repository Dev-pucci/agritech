const MOCK_MODE = true;

const mockPrices = [
  {
    cropName: 'Tomato',
    currentPrice: 45.5,
    unit: 'kg',
    change: 5.2,
    trend: 'up',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: '2024-01-01', price: 40 },
      { date: '2024-01-08', price: 42 },
      { date: '2024-01-15', price: 43 },
      { date: '2024-01-22', price: 45.5 },
    ],
  },
  {
    cropName: 'Wheat',
    currentPrice: 28.0,
    unit: 'kg',
    change: -2.1,
    trend: 'down',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: '2024-01-01', price: 30 },
      { date: '2024-01-08', price: 29 },
      { date: '2024-01-15', price: 28.5 },
      { date: '2024-01-22', price: 28 },
    ],
  },
  {
    cropName: 'Rice',
    currentPrice: 32.5,
    unit: 'kg',
    change: 0.0,
    trend: 'stable',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: '2024-01-01', price: 32.5 },
      { date: '2024-01-08', price: 32.5 },
      { date: '2024-01-15', price: 32.5 },
      { date: '2024-01-22', price: 32.5 },
    ],
  },
  {
    cropName: 'Corn',
    currentPrice: 18.75,
    unit: 'kg',
    change: 3.8,
    trend: 'up',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: '2024-01-01', price: 16 },
      { date: '2024-01-08', price: 17 },
      { date: '2024-01-15', price: 18 },
      { date: '2024-01-22', price: 18.75 },
    ],
  },
  {
    cropName: 'Potato',
    currentPrice: 22.0,
    unit: 'kg',
    change: 1.5,
    trend: 'up',
    lastUpdated: new Date().toISOString(),
    history: [
      { date: '2024-01-01', price: 20 },
      { date: '2024-01-08', price: 21 },
      { date: '2024-01-15', price: 21.5 },
      { date: '2024-01-22', price: 22 },
    ],
  },
];

export async function fetchMarketPrices(region = null, crop = null) {
  if (MOCK_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let filteredPrices = mockPrices;

    if (crop) {
      filteredPrices = mockPrices.filter(p =>
        p.cropName.toLowerCase().includes(crop.toLowerCase())
      );
    }

    return {
      prices: filteredPrices,
      region: region || 'All Regions',
      lastUpdated: new Date().toISOString(),
    };
  }

  // Real API implementation
  const params = new URLSearchParams();
  if (region) params.append('region', region);
  if (crop) params.append('crop', crop);

  const response = await fetch(
    `http://localhost:5000/api/v1/market/prices?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch market prices');
  }

  return response.json();
}
