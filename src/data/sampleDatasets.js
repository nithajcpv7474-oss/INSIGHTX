import { analyzeDataMatrix } from '../utils/dataParser.js';

/**
 * 5 Standard Sample Datasets for Mathematical Analytics Demonstration
 * Note: Clearly labeled as synthetic sample data for educational use.
 */

export const SAMPLE_DATASETS_CONFIG = [
  {
    id: 'solar',
    title: 'Solar Energy Analytics',
    category: 'Renewable Engineering',
    color: '#f59e0b',
    description: 'Hourly solar irradiance, ambient temperature, cloud cover, and photovoltaic power output.',
    filename: 'solar_energy_sample.csv',
    sampleLabel: 'Synthetic Academic Demonstration Data',
    rows: [
      ['record_id', 'hour_of_day', 'solar_radiation_wm2', 'ambient_temp_c', 'cloud_cover_pct', 'power_output_kw'],
      [1, 6, 85.0, 18.2, 10.0, 0.42],
      [2, 7, 210.5, 20.1, 15.0, 1.15],
      [3, 8, 380.0, 22.4, 20.0, 2.05],
      [4, 9, 540.2, 24.8, 12.0, 3.12],
      [5, 10, 680.0, 27.1, 8.0, 4.02],
      [6, 11, 790.4, 29.3, 5.0, 4.78],
      [7, 12, 850.0, 31.0, 0.0, 5.25],
      [8, 13, 830.2, 31.8, 5.0, 5.08],
      [9, 14, 740.0, 31.2, 15.0, 4.45],
      [10, 15, 610.8, 30.1, 25.0, 3.52],
      [11, 16, 440.0, 28.5, 30.0, 2.45],
      [12, 17, 260.4, 26.2, 20.0, 1.38],
      [13, 18, 95.0, 23.5, 15.0, 0.48],
      [14, 19, 12.0, 21.0, 10.0, 0.05],
      [15, 7, 195.0, 19.5, 40.0, 0.88],
      [16, 8, 350.2, 21.8, 45.0, 1.62],
      [17, 9, 490.0, 23.9, 35.0, 2.55],
      [18, 10, 620.5, 26.0, 30.0, 3.34],
      [19, 11, 720.0, 28.2, 20.0, 4.15],
      [20, 12, 810.3, 30.5, 15.0, 4.82],
      [21, 13, 795.0, 31.0, 18.0, 4.70],
      [22, 14, 705.2, 30.4, 22.0, 4.10],
      [23, 15, 580.0, 29.2, 28.0, 3.25],
      [24, 16, 410.5, 27.5, 32.0, 2.18]
    ]
  },
  {
    id: 'traffic',
    title: 'Urban Traffic Congestion',
    category: 'Civil Infrastructure',
    color: '#06b6d4',
    description: 'Bivariate vehicle densities, average flow speed, precipitation, and congestion indices across urban nodes.',
    filename: 'urban_traffic_sample.csv',
    sampleLabel: 'Synthetic Academic Demonstration Data',
    rows: [
      ['sensor_code', 'hour_period', 'vehicle_count', 'avg_speed_kmh', 'precipitation_mm', 'congestion_index'],
      ['S_01', 6, 320, 58.5, 0.0, 1.8],
      ['S_02', 7, 750, 42.0, 0.0, 4.5],
      ['S_03', 8, 1120, 24.5, 0.2, 8.2],
      ['S_04', 9, 1280, 18.2, 0.0, 9.4],
      ['S_05', 10, 890, 36.4, 0.0, 5.3],
      ['S_06', 11, 710, 46.8, 0.5, 4.1],
      ['S_07', 12, 820, 39.5, 1.2, 5.0],
      ['S_08', 13, 780, 41.2, 0.0, 4.7],
      ['S_09', 14, 840, 38.0, 0.0, 5.2],
      ['S_10', 15, 960, 31.5, 0.8, 6.8],
      ['S_11', 16, 1220, 21.0, 2.4, 8.9],
      ['S_12', 17, 1390, 15.5, 1.5, 9.8],
      ['S_13', 18, 1340, 17.0, 0.0, 9.5],
      ['S_14', 19, 1080, 28.2, 0.0, 7.4],
      ['S_15', 20, 790, 43.5, 0.0, 4.8],
      ['S_16', 21, 560, 51.0, 0.0, 3.2],
      ['S_17', 22, 410, 56.2, 0.0, 2.3],
      ['S_18', 23, 290, 60.5, 0.0, 1.5],
      ['S_19', 7, 810, 39.2, 3.5, 6.1],
      ['S_20', 8, 1190, 20.1, 4.2, 9.1],
      ['S_21', 16, 1290, 18.4, 3.8, 9.3],
      ['S_22', 17, 1420, 13.8, 2.0, 10.0]
    ]
  },
  {
    id: 'housing',
    title: 'Real Estate House Prices',
    category: 'Economic Valuation',
    color: '#ec4899',
    description: 'Living area, bedroom counts, transit distance, age, and evaluated property transaction price.',
    filename: 'housing_valuation_sample.csv',
    sampleLabel: 'Synthetic Academic Demonstration Data',
    rows: [
      ['property_key', 'area_sqft', 'bedrooms', 'bathrooms', 'dist_to_center_km', 'age_years', 'price_usd_thousands'],
      ['P-101', 850, 2, 1, 12.5, 15, 210.0],
      ['P-102', 1100, 2, 1, 9.2, 10, 265.0],
      ['P-103', 1350, 3, 2, 8.0, 8, 320.0],
      ['P-104', 1600, 3, 2, 6.5, 12, 385.0],
      ['P-105', 1850, 4, 2, 5.2, 5, 460.0],
      ['P-106', 2100, 4, 3, 4.0, 3, 540.0],
      ['P-107', 2400, 4, 3, 3.5, 2, 620.0],
      ['P-108', 920, 2, 1, 14.0, 20, 195.0],
      ['P-109', 1250, 3, 2, 10.1, 14, 290.0],
      ['P-110', 1450, 3, 2, 7.8, 9, 345.0],
      ['P-111', 1750, 3, 2, 6.0, 7, 415.0],
      ['P-112', 1980, 4, 3, 4.8, 4, 495.0],
      ['P-113', 2250, 4, 3, 3.8, 3, 580.0],
      ['P-114', 2600, 5, 4, 2.5, 1, 690.0],
      ['P-115', 780, 1, 1, 15.2, 25, 175.0],
      ['P-116', 1020, 2, 1, 11.0, 18, 235.0],
      ['P-117', 1520, 3, 2, 7.0, 11, 360.0],
      ['P-118', 2050, 4, 3, 4.5, 6, 510.0],
      ['P-119', 2350, 4, 3, 3.2, 2, 605.0],
      ['P-120', 2750, 5, 4, 2.0, 1, 735.0]
    ]
  },
  {
    id: 'sales',
    title: 'Retail Business Performance',
    category: 'Commercial Operations',
    color: '#a855f7',
    description: 'Advertising spend, retail footfall, customer discount percentages, and quarterly revenue earnings.',
    filename: 'retail_sales_sample.csv',
    sampleLabel: 'Synthetic Academic Demonstration Data',
    rows: [
      ['store_id', 'marketing_spend_k', 'store_footfall', 'discount_rate_pct', 'online_visits', 'quarterly_revenue_k'],
      ['STR_01', 12.5, 3400, 5.0, 12500, 145.2],
      ['STR_02', 15.0, 3900, 6.5, 14200, 168.0],
      ['STR_03', 18.2, 4500, 8.0, 17800, 198.5],
      ['STR_04', 22.0, 5200, 10.0, 21500, 234.0],
      ['STR_05', 25.5, 5900, 10.0, 25000, 268.4],
      ['STR_06', 28.0, 6400, 12.5, 28400, 298.0],
      ['STR_07', 31.5, 7100, 15.0, 32100, 332.6],
      ['STR_08', 35.0, 7800, 15.0, 36000, 365.0],
      ['STR_09', 14.0, 3650, 5.5, 13400, 156.8],
      ['STR_10', 17.5, 4200, 7.0, 16500, 186.2],
      ['STR_11', 20.0, 4850, 9.0, 19800, 218.0],
      ['STR_12', 24.0, 5600, 10.0, 23600, 252.5],
      ['STR_13', 27.0, 6150, 12.0, 27200, 284.0],
      ['STR_14', 30.0, 6800, 14.0, 30500, 318.2],
      ['STR_15', 33.5, 7450, 15.0, 34200, 351.0],
      ['STR_16', 38.0, 8200, 18.0, 39500, 392.4],
      ['STR_17', 10.5, 2950, 4.0, 10800, 128.5],
      ['STR_18', 16.2, 4050, 7.5, 15400, 175.4],
      ['STR_19', 21.5, 5050, 9.5, 20900, 226.8],
      ['STR_20', 29.2, 6600, 13.0, 29100, 305.5]
    ]
  },
  {
    id: 'agriculture',
    title: 'Agricultural Crop Yield',
    category: 'Agronomy & Soil Science',
    color: '#10b981',
    description: 'Nitrogen input, rainfall, soil pH, irrigation volume, and harvested crop output.',
    filename: 'crop_yield_sample.csv',
    sampleLabel: 'Synthetic Academic Demonstration Data',
    rows: [
      ['plot_id', 'nitrogen_kg_ha', 'rainfall_mm', 'soil_ph', 'irrigation_m3', 'crop_yield_tonnes'],
      ['PLT_01', 45, 180.5, 6.2, 250, 3.45],
      ['PLT_02', 60, 210.0, 6.4, 280, 4.12],
      ['PLT_03', 75, 245.2, 6.5, 310, 4.85],
      ['PLT_04', 90, 280.0, 6.7, 340, 5.50],
      ['PLT_05', 105, 315.8, 6.8, 370, 6.18],
      ['PLT_06', 120, 350.0, 6.8, 400, 6.75],
      ['PLT_07', 135, 385.4, 6.9, 430, 7.22],
      ['PLT_08', 150, 410.0, 7.0, 450, 7.55],
      ['PLT_09', 50, 195.0, 6.3, 260, 3.75],
      ['PLT_10', 65, 225.5, 6.4, 290, 4.38],
      ['PLT_11', 80, 260.0, 6.6, 320, 5.08],
      ['PLT_12', 95, 295.2, 6.7, 350, 5.72],
      ['PLT_13', 110, 330.0, 6.8, 380, 6.35],
      ['PLT_14', 125, 365.0, 6.9, 410, 6.92],
      ['PLT_15', 140, 395.5, 6.9, 435, 7.38],
      ['PLT_16', 40, 170.0, 6.1, 240, 3.15],
      ['PLT_17', 70, 235.0, 6.5, 305, 4.65],
      ['PLT_18', 100, 308.0, 6.7, 360, 5.95],
      ['PLT_19', 130, 375.0, 6.8, 420, 7.08],
      ['PLT_20', 145, 405.0, 7.0, 445, 7.48]
    ]
  }
];

/**
 * Creates structured dataset object from sample dataset ID
 */
export function getSampleDataset(datasetId) {
  const cfg = SAMPLE_DATASETS_CONFIG.find(d => d.id === datasetId);
  if (!cfg) {
    throw new Error(`Sample dataset "${datasetId}" was not found.`);
  }

  // Calculate synthetic byte size
  const csvString = cfg.rows.map(r => r.join(',')).join('\n');
  const size = csvString.length;

  const analyzed = analyzeDataMatrix(cfg.rows, cfg.filename, size);
  analyzed.sourceType = 'sample';
  analyzed.category = cfg.category;
  analyzed.sampleTitle = cfg.title;
  analyzed.sampleLabel = cfg.sampleLabel;

  return analyzed;
}
