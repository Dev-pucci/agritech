const MOCK_MODE = true;

// Fertilizer database with N-P-K ratios
const fertilizerDatabase = [
  {
    id: '1',
    name: 'Urea',
    npk: '46-0-0',
    type: 'Nitrogen',
    description: 'High nitrogen content for leafy growth',
    application: 'Apply 100-150 kg/hectare during vegetative stage',
    bestFor: ['Wheat', 'Maize', 'Rice', 'Leafy Vegetables'],
    price: '25-30 per kg',
  },
  {
    id: '2',
    name: 'DAP (Diammonium Phosphate)',
    npk: '18-46-0',
    type: 'Phosphorus',
    description: 'Rich in phosphorus for root development',
    application: 'Apply 100-125 kg/hectare at sowing time',
    bestFor: ['Legumes', 'Root Crops', 'Flowering Plants'],
    price: '35-40 per kg',
  },
  {
    id: '3',
    name: 'Muriate of Potash (MOP)',
    npk: '0-0-60',
    type: 'Potassium',
    description: 'High potassium for fruit/flower quality',
    application: 'Apply 50-75 kg/hectare during flowering',
    bestFor: ['Fruits', 'Vegetables', 'Sugarcane'],
    price: '20-25 per kg',
  },
  {
    id: '4',
    name: 'NPK 19-19-19',
    npk: '19-19-19',
    type: 'Balanced',
    description: 'Balanced nutrients for overall growth',
    application: 'Apply 100-150 kg/hectare every 4-6 weeks',
    bestFor: ['General Crops', 'Mixed Farming', 'Home Gardens'],
    price: '30-35 per kg',
  },
  {
    id: '5',
    name: 'Organic Compost',
    npk: '1-1-1',
    type: 'Organic',
    description: 'Slow-release organic matter for soil health',
    application: 'Apply 5-10 tons/hectare before planting',
    bestFor: ['All Crops', 'Soil Conditioning', 'Organic Farming'],
    price: '5-8 per kg',
  },
  {
    id: '6',
    name: 'SSP (Single Super Phosphate)',
    npk: '16-20-0',
    type: 'Phosphorus',
    description: 'Phosphorus with calcium and sulfur',
    application: 'Apply 125-150 kg/hectare at planting',
    bestFor: ['Oilseeds', 'Pulses', 'Groundnut'],
    price: '12-15 per kg',
  },
];

// Generate recommendations based on soil nutrient levels
function generateRecommendations(soilData) {
  const recommendations = [];
  const { nutrients, pH, soilType } = soilData;

  // Nitrogen recommendations
  if (nutrients.nitrogen === 'low') {
    recommendations.push({
      nutrient: 'Nitrogen',
      severity: 'high',
      fertilizers: [
        fertilizerDatabase[0], // Urea
        fertilizerDatabase[3], // NPK balanced
      ],
      dosage: '100-150 kg/hectare',
      timing: 'Apply in split doses: 50% at sowing, 25% at 30 days, 25% at 60 days',
      urgency: 'Immediate action required',
    });
  } else if (nutrients.nitrogen === 'medium') {
    recommendations.push({
      nutrient: 'Nitrogen',
      severity: 'moderate',
      fertilizers: [fertilizerDatabase[4]], // Organic compost
      dosage: '50-75 kg/hectare',
      timing: 'Apply during vegetative growth stage',
      urgency: 'Maintenance recommended',
    });
  }

  // Phosphorus recommendations
  if (nutrients.phosphorus === 'low') {
    recommendations.push({
      nutrient: 'Phosphorus',
      severity: 'high',
      fertilizers: [
        fertilizerDatabase[1], // DAP
        fertilizerDatabase[5], // SSP
      ],
      dosage: '100-125 kg/hectare',
      timing: 'Apply as basal dose at sowing time',
      urgency: 'Critical for root development',
    });
  } else if (nutrients.phosphorus === 'medium') {
    recommendations.push({
      nutrient: 'Phosphorus',
      severity: 'moderate',
      fertilizers: [fertilizerDatabase[5]], // SSP
      dosage: '50-75 kg/hectare',
      timing: 'Apply at planting',
      urgency: 'Recommended for optimal yield',
    });
  }

  // Potassium recommendations
  if (nutrients.potassium === 'low') {
    recommendations.push({
      nutrient: 'Potassium',
      severity: 'high',
      fertilizers: [fertilizerDatabase[2]], // MOP
      dosage: '75-100 kg/hectare',
      timing: 'Apply at flowering/fruiting stage',
      urgency: 'Important for quality',
    });
  } else if (nutrients.potassium === 'medium') {
    recommendations.push({
      nutrient: 'Potassium',
      severity: 'moderate',
      fertilizers: [fertilizerDatabase[2]], // MOP
      dosage: '40-60 kg/hectare',
      timing: 'Apply during fruit development',
      urgency: 'Recommended for better quality',
    });
  }

  // pH-based recommendations
  if (pH < 6.0) {
    recommendations.push({
      nutrient: 'pH Correction',
      severity: 'moderate',
      fertilizers: [{
        id: 'lime',
        name: 'Agricultural Lime',
        npk: 'pH Adjuster',
        type: 'Soil Amendment',
        description: 'Raises soil pH to optimal range',
        application: 'Apply 2-4 tons/hectare and incorporate',
        bestFor: ['Acidic Soils'],
        price: '3-5 per kg',
      }],
      dosage: '2-4 tons/hectare',
      timing: 'Apply 2-3 months before planting',
      urgency: 'Soil too acidic',
    });
  } else if (pH > 7.5) {
    recommendations.push({
      nutrient: 'pH Correction',
      severity: 'moderate',
      fertilizers: [{
        id: 'sulfur',
        name: 'Elemental Sulfur',
        npk: 'pH Adjuster',
        type: 'Soil Amendment',
        description: 'Lowers soil pH to optimal range',
        application: 'Apply 100-200 kg/hectare',
        bestFor: ['Alkaline Soils'],
        price: '15-20 per kg',
      }],
      dosage: '100-200 kg/hectare',
      timing: 'Apply 3-4 months before planting',
      urgency: 'Soil too alkaline',
    });
  }

  // Always recommend organic matter for soil health
  if (!recommendations.some(r => r.fertilizers.some(f => f.type === 'Organic'))) {
    recommendations.push({
      nutrient: 'Soil Health',
      severity: 'low',
      fertilizers: [fertilizerDatabase[4]], // Organic compost
      dosage: '3-5 tons/hectare',
      timing: 'Apply before planting and incorporate',
      urgency: 'Recommended for long-term soil health',
    });
  }

  return recommendations;
}

export async function getFertilizerRecommendations(soilData) {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const recommendations = generateRecommendations(soilData);

    return {
      soilSummary: {
        type: soilData.soilType,
        pH: soilData.pH,
        nitrogen: soilData.nutrients.nitrogen,
        phosphorus: soilData.nutrients.phosphorus,
        potassium: soilData.nutrients.potassium,
      },
      recommendations,
      generalTips: [
        'Test soil every 6-12 months for accurate recommendations',
        'Apply fertilizers when soil is moist for better absorption',
        'Avoid over-fertilization to prevent nutrient runoff',
        'Combine organic and inorganic fertilizers for best results',
        'Store fertilizers in cool, dry place away from moisture',
      ],
      estimatedCost: calculateEstimatedCost(recommendations),
    };
  }

  const response = await fetch('http://localhost:5000/api/v1/fertilizer/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ soilData }),
  });

  if (!response.ok) {
    throw new Error('Failed to get recommendations');
  }

  return response.json();
}

function calculateEstimatedCost(recommendations) {
  let minCost = 0;
  let maxCost = 0;

  recommendations.forEach(rec => {
    if (rec.fertilizers && rec.fertilizers.length > 0) {
      const fertilizer = rec.fertilizers[0];
      const dosageMatch = rec.dosage.match(/(\d+)-?(\d+)?/);
      if (dosageMatch && fertilizer.price) {
        const [_, min, max] = dosageMatch;
        const priceMatch = fertilizer.price.match(/(\d+)-?(\d+)?/);
        if (priceMatch) {
          const [__, priceMin, priceMax] = priceMatch;
          minCost += parseInt(min) * parseInt(priceMin);
          maxCost += parseInt(max || min) * parseInt(priceMax || priceMin);
        }
      }
    }
  });

  return `₹${minCost.toLocaleString()} - ₹${maxCost.toLocaleString()} per hectare`;
}

export { fertilizerDatabase };
