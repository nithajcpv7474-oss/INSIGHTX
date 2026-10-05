import * as XLSX from 'xlsx';
import { analyzeDataMatrix, parseWorkbook, findHeaderRowIndex, selectBestWorksheet } from './src/utils/dataParser.js';
import { calculateDescriptiveStatistics } from './src/statistics/descriptive.js';
import { calculateCorrelation } from './src/statistics/correlation.js';
import { calculateRegression } from './src/statistics/regression.js';

console.log('=== RUNNING EXCEL PARSER REGRESSION & SOLAR DATASET VERIFICATION SUITE ===\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// =========================================================================
// TEST A: Normal Excel (Header row = first row)
// =========================================================================
try {
  const normalMatrix = [
    ['product_name', 'price', 'quantity', 'discount_pct'],
    ['Widget A', 29.99, 150, 0.10],
    ['Widget B', 49.50, 80, 0.05],
    ['Widget C', 12.00, 300, 0.15]
  ];
  const idx = findHeaderRowIndex(normalMatrix);
  assert(idx === 0, 'Test A: Header row index is 0 (first row)');
  const res = analyzeDataMatrix(normalMatrix, 'normal.xlsx');
  assert(res.rowCount === 3, 'Test A: Row count is 3');
  assert(res.headers.length === 4, 'Test A: Column count is 4');
  assert(res.numericalColumns.length === 3, 'Test A: Exactly 3 numerical columns (price, quantity, discount_pct)');
  assert(res.categoricalColumns.includes('product_name'), 'Test A: product_name is categorical');
} catch (e) {
  assert(false, `Test A failed: ${e.message}`);
}

// =========================================================================
// TEST B: Excel with introductory title/description rows
// =========================================================================
try {
  const titledMatrix = [
    ['Quarterly Regional Telemetry Summary Report', null, null, null],
    ['Collected by Sensor Network Group — Academic Demonstration', null, null, null],
    ['timestamp', 'voltage_v', 'current_a', 'power_w'],
    ['2026-01-01', 230.1, 4.5, 1035.45],
    ['2026-01-02', 229.8, 4.8, 1103.04],
    ['2026-01-03', 231.0, 4.2, 970.20]
  ];
  const idx = findHeaderRowIndex(titledMatrix);
  assert(idx === 2, `Test B: Header row correctly identified at index 2 (got ${idx})`);
  const res = analyzeDataMatrix(titledMatrix, 'titled.xlsx');
  assert(res.rowCount === 3, `Test B: Extracted 3 data rows below header (got ${res.rowCount})`);
  assert(res.headers[0] === 'timestamp', 'Test B: First header is "timestamp"');
  assert(res.headers[1] === 'voltage_v', 'Test B: Second header is "voltage_v"');
  assert(res.numericalColumns.includes('voltage_v'), 'Test B: voltage_v is numerical');
  assert(res.numericalColumns.includes('current_a'), 'Test B: current_a is numerical');
  assert(res.numericalColumns.includes('power_w'), 'Test B: power_w is numerical');
} catch (e) {
  assert(false, `Test B failed: ${e.message}`);
}

// =========================================================================
// TEST C: Mixed numeric and date columns
// =========================================================================
try {
  const mixedDateMatrix = [
    ['observation_date', 'temperature_c', 'humidity_pct'],
    ['01-01-2026', 22.4, 55.0],
    ['02-01-2026', 23.1, 52.3],
    ['03-01-2026', 21.8, 58.1]
  ];
  const res = analyzeDataMatrix(mixedDateMatrix, 'dates.xlsx');
  assert(res.columnTypes['observation_date'] === 'date/time', 'Test C: observation_date classified as date/time');
  assert(res.dateColumns.includes('observation_date'), 'Test C: observation_date in dateColumns');
  assert(res.numericalColumns.includes('temperature_c'), 'Test C: temperature_c in numericalColumns');
  assert(res.numericalColumns.includes('humidity_pct'), 'Test C: humidity_pct in numericalColumns');
} catch (e) {
  assert(false, `Test C failed: ${e.message}`);
}

// =========================================================================
// TEST D: Numeric values stored as Excel numbers
// =========================================================================
try {
  const excelNumbersMatrix = [
    ['metric_a', 'metric_b', 'metric_c'],
    [100, 0.05, -12.4],
    [200, 0.08, -8.2],
    [300, 0.12, 0.0]
  ];
  const res = analyzeDataMatrix(excelNumbersMatrix, 'numbers.xlsx');
  assert(res.numericalColumns.length === 3, 'Test D: All 3 columns classified as numerical');
  assert(res.originalRows[2].metric_c === 0.0, 'Test D: Zero 0.0 preserved');
  assert(res.originalRows[0].metric_c === -12.4, 'Test D: Negative decimal preserved');
} catch (e) {
  assert(false, `Test D failed: ${e.message}`);
}

// =========================================================================
// TEST E: Numeric-looking strings safely recognized
// =========================================================================
try {
  const stringNumMatrix = [
    ['reading_str', 'val_str'],
    ['100', ' 25.5 '],
    ['200', '30.2'],
    ['300', '42.8']
  ];
  const res = analyzeDataMatrix(stringNumMatrix, 'string_numbers.xlsx');
  assert(res.numericalColumns.includes('reading_str'), 'Test E: reading_str classified as numerical');
  assert(res.numericalColumns.includes('val_str'), 'Test E: val_str classified as numerical');
  assert(res.processedRows[0].val_str === 25.5, 'Test E: Trimmed and converted to 25.5 in processedRows');
} catch (e) {
  assert(false, `Test E failed: ${e.message}`);
}

// =========================================================================
// TEST F: Categorical text columns preserved
// =========================================================================
try {
  const categoricalMatrix = [
    ['country', 'status', 'tier'],
    ['United States', 'Active', 'Gold'],
    ['Canada', 'Pending', 'Silver'],
    ['United Kingdom', 'Active', 'Platinum']
  ];
  const res = analyzeDataMatrix(categoricalMatrix, 'categories.xlsx');
  assert(res.numericalColumns.length === 0, 'Test F: 0 numerical columns');
  assert(res.categoricalColumns.length === 3, 'Test F: All 3 columns classified as categorical');
  assert(res.categoricalColumns.includes('country'), 'Test F: country is categorical');
} catch (e) {
  assert(false, `Test F failed: ${e.message}`);
}

// =========================================================================
// TEST G: Missing cells and valid zero handling
// =========================================================================
try {
  const missingMatrix = [
    ['feature_x', 'feature_y'],
    [10, null],
    [0, 50],
    ['NA', 0.0],
    [40, undefined]
  ];
  const res = analyzeDataMatrix(missingMatrix, 'missing.xlsx');
  assert(res.missingValueCount === 3, `Test G: 3 missing values counted (got ${res.missingValueCount})`);
  assert(res.originalRows[1].feature_x === 0, 'Test G: 0 is preserved in row 2');
  assert(res.originalRows[2].feature_y === 0.0, 'Test G: 0.0 is preserved in row 3');
  assert(res.numericalColumns.includes('feature_x'), 'Test G: feature_x is numerical despite NA');
  assert(res.numericalColumns.includes('feature_y'), 'Test G: feature_y is numerical despite null');
} catch (e) {
  assert(false, `Test G failed: ${e.message}`);
}

// =========================================================================
// TEST H: Multiple worksheets (Observations vs Documentation)
// =========================================================================
try {
  const docData = [
    ['Title', 'System Manual'],
    ['Author', 'Research Team'],
    ['Rows', 100]
  ];
  const obsData = [
    ['Report Header', null, null],
    ['sensor_id', 'frequency_ghz', 'signal_dbm'],
    ['S1', 2.4, -45.2],
    ['S2', 5.0, -38.1],
    ['S3', 6.0, -52.4]
  ];

  const wb1 = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb1, XLSX.utils.aoa_to_sheet(docData), 'Dataset Info');
  XLSX.utils.book_append_sheet(wb1, XLSX.utils.aoa_to_sheet(obsData), 'Observations');

  const selected1 = selectBestWorksheet(wb1);
  assert(selected1.sheetName === 'Observations', `Test H1: Selected "Observations" when doc is first sheet (got "${selected1.sheetName}")`);

  const wb2 = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb2, XLSX.utils.aoa_to_sheet(obsData), 'Observations');
  XLSX.utils.book_append_sheet(wb2, XLSX.utils.aoa_to_sheet(docData), 'Dataset Info');

  const selected2 = selectBestWorksheet(wb2);
  assert(selected2.sheetName === 'Observations', `Test H2: Selected "Observations" when data is first sheet (got "${selected2.sheetName}")`);

  const parsedWb = parseWorkbook(wb1, 'telemetry.xlsx');
  assert(parsedWb.rowCount === 3, `Test H3: Parsed 3 observation rows from multi-sheet workbook (got ${parsedWb.rowCount})`);
  assert(parsedWb.numericalColumns.includes('frequency_ghz'), 'Test H4: frequency_ghz is numerical');
  assert(parsedWb.numericalColumns.includes('signal_dbm'), 'Test H5: signal_dbm is numerical');
} catch (e) {
  assert(false, `Test H failed: ${e.message}`);
}

import fs from 'fs';

// =========================================================================
// TEST I: VERIFICATION WITH ACTUAL SOLAR DATASET
// `INSIGHTX_Solar_Energy_Dataset.xlsx`
// =========================================================================
try {
  const solarPath = 'C:/Users/manuj/Downloads/INSIGHTX_Solar_Energy_Dataset.xlsx';
  const fileBuffer = fs.readFileSync(solarPath);
  const solarWb = XLSX.read(fileBuffer, { type: 'buffer', cellDates: false, raw: true });

  assert(solarWb.SheetNames.includes('Solar Dataset'), 'Solar Test: Workbook contains "Solar Dataset" sheet');
  assert(solarWb.SheetNames.includes('Dataset Info'), 'Solar Test: Workbook contains "Dataset Info" sheet');

  const parsedSolar = parseWorkbook(solarWb, 'INSIGHTX_Solar_Energy_Dataset.xlsx', 7414);

  assert(parsedSolar.columnCount === 7, `Solar Test: Exactly 7 columns detected (got ${parsedSolar.columnCount})`);
  assert(parsedSolar.rowCount === 20, `Solar Test: Exactly 20 observation rows detected (got ${parsedSolar.rowCount})`);
  assert(parsedSolar.numericalColumns.length === 6, `Solar Test: Exactly 6 numerical columns detected (got ${parsedSolar.numericalColumns.length})`);
  assert(parsedSolar.dateColumns.length === 1, `Solar Test: Exactly 1 date column detected (got ${parsedSolar.dateColumns.length})`);
  assert(parsedSolar.dateColumns[0] === 'Date', 'Solar Test: Date column is "Date"');
  assert(parsedSolar.columnTypes['Date'] === 'date/time', 'Solar Test: "Date" classified as date/time');

  const expectedNumericals = [
    'Solar Irradiance (W/m²)',
    'Temperature (°C)',
    'Humidity (%)',
    'Wind Speed (m/s)',
    'Panel Temperature (°C)',
    'Power Output (kW)'
  ];

  expectedNumericals.forEach(col => {
    assert(parsedSolar.numericalColumns.includes(col), `Solar Test: "${col}" classified as numerical`);
    assert(parsedSolar.columnTypes[col] === 'numerical', `Solar Test: columnTypes["${col}"] === 'numerical'`);
  });

  // Test Mathematical Engines with Parsed Solar Dataset
  const powerVals = parsedSolar.originalRows.map(r => r['Power Output (kW)']);
  const irrVals = parsedSolar.originalRows.map(r => r['Solar Irradiance (W/m²)']);

  const statsPower = calculateDescriptiveStatistics(powerVals, 'Power Output (kW)');
  assert(statsPower.hasData === true, 'Solar Math: Descriptive statistics calculated successfully');
  assert(statsPower.n === 20, `Solar Math: Valid sample size n = 20 (got ${statsPower.n})`);
  assert(Math.abs(statsPower.mean - 3.885) < 1e-3, `Solar Math: Power Output Mean is 3.885 (got ${statsPower.mean})`);
  assert(Math.abs(statsPower.sampleSD - 1.0137) < 1e-3, `Solar Math: Power Output Sample SD is 1.0137 (got ${statsPower.sampleSD})`);

  const corrRes = calculateCorrelation(irrVals, powerVals, 'Irradiance', 'Power');
  assert(corrRes.hasData === true, 'Solar Math: Correlation calculated successfully');
  assert(corrRes.n === 20, `Solar Math: Correlation valid pair count n = 20 (got ${corrRes.n})`);
  assert(corrRes.pearsonR > 0.99, `Solar Math: Strong Pearson correlation r = ${corrRes.pearsonR} > 0.99`);

  const regRes = calculateRegression(irrVals, powerVals, 'Irradiance', 'Power');
  assert(regRes.hasData === true, 'Solar Math: Regression calculated successfully');
  assert(regRes.n === 20, `Solar Math: Regression n = 20 (got ${regRes.n})`);
  assert(regRes.rSquared > 0.98, `Solar Math: Regression R2 = ${regRes.rSquared} > 0.98`);
  assert(regRes.slope > 0, `Solar Math: Positive slope = ${regRes.slope} > 0`);

} catch (e) {
  assert(false, `Solar Test failed: ${e.message}`);
}

console.log(`\n=== REGRESSION TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
if (failed > 0) {
  process.exit(1);
}
