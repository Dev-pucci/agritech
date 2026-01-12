const MOCK_MODE = true;

const mockNews = [
  {
    id: '1',
    title: 'New Irrigation Techniques Boost Crop Yields',
    summary: 'Farmers report 30% increase in productivity using drip irrigation systems.',
    content: 'Recent studies show that modern drip irrigation techniques can significantly improve water efficiency and crop yields. Farmers who adopted this technology reported a 30% increase in productivity while reducing water consumption by 40%.',
    category: 'technology',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'AgriTech News',
  },
  {
    id: '2',
    title: 'Organic Farming: Best Practices for 2024',
    summary: 'Expert tips on transitioning to organic agriculture methods.',
    content: 'Industry experts share valuable insights on making the transition to organic farming. Key recommendations include soil preparation, natural pest control methods, and certification requirements.',
    category: 'tips',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'Organic Farmers Magazine',
  },
  {
    id: '3',
    title: 'Weather Forecast: Heavy Rains Expected',
    summary: 'Meteorologists predict significant rainfall in agricultural regions.',
    content: 'The weather service has issued advisories for heavy rainfall expected in major agricultural regions over the next week. Farmers are advised to prepare drainage systems and protect vulnerable crops.',
    category: 'weather',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'Agricultural Weather Service',
  },
  {
    id: '4',
    title: 'Market Update: Rice Prices Stabilize',
    summary: 'Rice market shows stability after months of volatility.',
    content: 'After experiencing significant price fluctuations over the past quarter, the rice market has stabilized. Analysts attribute this to improved supply chain management and favorable weather conditions.',
    category: 'market',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'Market Analysis Daily',
  },
  {
    id: '5',
    title: 'Smart Sensors Transform Precision Agriculture',
    summary: 'IoT devices help farmers monitor soil conditions in real-time.',
    content: 'The adoption of smart sensors and IoT technology is revolutionizing precision agriculture. These devices provide real-time data on soil moisture, temperature, and nutrient levels, enabling farmers to make data-driven decisions.',
    category: 'technology',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    source: 'AgriTech Innovation',
  },
];

export async function fetchNews(category = null, limit = 10) {
  if (MOCK_MODE) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    let filteredNews = mockNews;

    if (category && category !== 'all') {
      filteredNews = mockNews.filter(n => n.category === category);
    }

    return {
      articles: filteredNews.slice(0, limit),
      total: filteredNews.length,
    };
  }

  // Real API implementation
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (limit) params.append('limit', limit.toString());

  const response = await fetch(
    `http://localhost:5000/api/v1/news?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  return response.json();
}
