import * as XLSX from 'xlsx';
import { analyzeDataMatrix, isIdentifierColumn, isValueMissing } from './src/utils/dataParser.js';
import { SAMPLE_DATASETS_CONFIG, getSampleDataset } from './src/data/sampleDatasets.js';

console.log('=== RUNNING RIGOROUS PHASE 2 DATASET VERIFICATION TESTS ===\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${message}`);
    testsFailed++;
  }
}

// Test 1: Zero value preservation
try {
  const matrixWithZeros = [
    ['id_code', 'value_x', 'value_y'],
    ['A1', 0, 10.5],
    ['A2', 0.0, 0],
    ['A3', 25.0, 100]
  ];
  const result = analyzeDataMatrix(matrixWithZeros, 'zero_test.csv', 100);
  assert(result.rowCount === 3, 'Zero test: Correct row count (3 rows)');
  assert(result.numericalColumns.includes('value_x'), 'Zero test: value_x is recognized as numerical');
  assert(result.numericalColumns.includes('value_y'), 'Zero test: value_y is recognized as numerical');
  assert(result.originalRows[0].value_x === 0, 'Zero test: Exact 0 preserved in originalRows');
  assert(result.processedRows[0].value_x === 0, 'Zero test: Exact 0 preserved in processedRows');
  assert(result.originalRows[1].value_y === 0, 'Zero test: Exact 0 preserved in row 2');
  assert(result.missingValueCount === 0, 'Zero test: 0 was NOT counted as missing value');
} catch (e) {
  assert(false, `Zero test threw error: ${e.message}`);
}

// Test 2: Missing values & whitespace cells detection
try {
  const matrixWithNulls = [
    ['item', 'measurement', 'score'],
    ['Item 1', 12.5, null],
    ['Item 2', '   ', 88.0],
    ['Item 3', 'NA', 95.0],
    ['Item 4', 15.0, undefined]
  ];
  const result = analyzeDataMatrix(matrixWithNulls, 'null_test.csv', 120);
  assert(result.missingValueCount === 4, `Null test: Correctly counted 4 missing values (got ${result.missingValueCount})`);
  assert(result.originalRows[0].score === null, 'Null test: null converted to null');
  assert(result.originalRows[1].measurement === null, 'Null test: whitespace-only string converted to null');
  assert(result.originalRows[2].measurement === null, 'Null test: "NA" string converted to null');
  assert(result.originalRows[3].score === null, 'Null test: undefined converted to null');
  assert(result.numericalColumns.includes('measurement'), 'Null test: non-missing entries in measurement are numerical');
  assert(result.numericalColumns.includes('score'), 'Null test: non-missing entries in score are numerical');
} catch (e) {
  assert(false, `Null test threw error: ${e.message}`);
}

// Test 3: Identifier column detection
try {
  assert(isIdentifierColumn('student_id') === true, 'ID test: student_id is identifier');
  assert(isIdentifierColumn('user_code') === true, 'ID test: user_code is identifier');
  assert(isIdentifierColumn('ISBN') === true, 'ID test: ISBN is identifier');
  assert(isIdentifierColumn('id') === true, 'ID test: id is identifier');
  assert(isIdentifierColumn('temperature_c') === false, 'ID test: temperature_c is NOT identifier');
  assert(isIdentifierColumn('solar_radiation') === false, 'ID test: solar_radiation is NOT identifier');
  
  const matrixWithId = [
    ['student_id', 'exam_score'],
    [101, 85],
    [102, 92],
    [103, 78]
  ];
  const result = analyzeDataMatrix(matrixWithId, 'students.csv', 150);
  assert(result.categoricalColumns.includes('student_id'), 'ID test: student_id placed in categoricalColumns');
  assert(result.numericalColumns.includes('exam_score'), 'ID test: exam_score placed in numericalColumns');
} catch (e) {
  assert(false, `Identifier test threw error: ${e.message}`);
}

// Test 4: Duplicate header names handling
try {
  const matrixWithDupeHeaders = [
    ['temperature', 'temperature', 'humidity', 'temperature'],
    [22.5, 23.0, 60, 21.8],
    [24.1, 24.5, 58, 23.9]
  ];
  const result = analyzeDataMatrix(matrixWithDupeHeaders, 'dupe_headers.csv', 200);
  assert(result.headers[0] === 'temperature', 'Dupe header test: First remains "temperature"');
  assert(result.headers[1] === 'temperature (2)', 'Dupe header test: Second renamed to "temperature (2)"');
  assert(result.headers[2] === 'humidity', 'Dupe header test: Third remains "humidity"');
  assert(result.headers[3] === 'temperature (3)', 'Dupe header test: Fourth renamed to "temperature (3)"');
} catch (e) {
  assert(false, `Duplicate header test threw error: ${e.message}`);
}

// Test 5: Mixed numeric and text detection
try {
  const mixedMatrix = [
    ['reading_id', 'speed_mixed'],
    ['R1', 45.5],
    ['R2', 'UNKNOWN'],
    ['R3', 62.0]
  ];
  const result = analyzeDataMatrix(mixedMatrix, 'mixed.csv', 100);
  assert(result.categoricalColumns.includes('speed_mixed'), 'Mixed test: speed_mixed classified as categorical for safety');
  assert(result.qualityWarnings.some(w => w.message.includes('mixed numeric and text')), 'Mixed test: Warning logged for mixed column');
} catch (e) {
  assert(false, `Mixed test threw error: ${e.message}`);
}

// Test 6: Duplicate rows detection
try {
  const dupeMatrix = [
    ['feature_a', 'feature_b'],
    [10, 20],
    [15, 30],
    [10, 20], // Duplicate of row 1
    [25, 50]
  ];
  const result = analyzeDataMatrix(dupeMatrix, 'duplicates.csv', 100);
  assert(result.duplicateRowCount === 1, `Dupe rows test: Correctly found 1 duplicate row (got ${result.duplicateRowCount})`);
} catch (e) {
  assert(false, `Duplicate rows test threw error: ${e.message}`);
}

// Test 7: Empty files rejection
try {
  let threw = false;
  try {
    analyzeDataMatrix([], 'empty.csv', 0);
  } catch (err) {
    threw = true;
  }
  assert(threw, 'Empty file test: Successfully rejected empty array');

  let headerOnlyThrew = false;
  try {
    analyzeDataMatrix([['col_a', 'col_b']], 'headers_only.csv', 20);
  } catch (err) {
    headerOnlyThrew = true;
  }
  assert(headerOnlyThrew, 'Header only test: Successfully rejected file with no data rows below header');
} catch (e) {
  assert(false, `Empty file test threw error: ${e.message}`);
}

// Test 8: All 5 Built-in Sample Datasets
try {
  const sampleKeys = ['solar', 'traffic', 'housing', 'sales', 'agriculture'];
  assert(SAMPLE_DATASETS_CONFIG.length === 5, 'Sample datasets: Exactly 5 configurations present');
  
  sampleKeys.forEach(key => {
    const data = getSampleDataset(key);
    assert(data.rowCount >= 20, `Sample "${key}": Has >= 20 rows (has ${data.rowCount})`);
    assert(data.numericalColumns.length >= 3, `Sample "${key}": Has >= 3 numerical columns (has ${data.numericalColumns.length})`);
    assert(data.sourceType === 'sample', `Sample "${key}": Has sourceType "sample"`);
  });
} catch (e) {
  assert(false, `Sample dataset test threw error: ${e.message}`);
}

// Test 9: SheetJS XLSX workbook generation and read-back simulation
try {
  // Create an in-memory workbook
  const testData = [
    { reading_no: 'M-01', voltage: 12.4, current: 2.1, status: 'OK' },
    { reading_no: 'M-02', voltage: 12.6, current: 0.0, status: 'STANDBY' },
    { reading_no: 'M-03', voltage: 12.1, current: 3.5, status: 'ACTIVE' }
  ];
  const ws = XLSX.utils.json_to_sheet(testData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const xlsxBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  
  // Read back
  const readWb = XLSX.read(xlsxBuffer, { type: 'array' });
  const rawRows = XLSX.utils.sheet_to_json(readWb.Sheets['Sheet1'], { header: 1, defval: null, blankrows: false });
  const result = analyzeDataMatrix(rawRows, 'generated_test.xlsx', xlsxBuffer.byteLength);
  
  assert(result.rowCount === 3, 'XLSX roundtrip: 3 rows parsed');
  assert(result.numericalColumns.includes('voltage'), 'XLSX roundtrip: voltage is numerical');
  assert(result.numericalColumns.includes('current'), 'XLSX roundtrip: current is numerical');
  assert(result.categoricalColumns.includes('reading_no'), 'XLSX roundtrip: reading_no is categorical identifier');
  assert(result.originalRows[1].current === 0, 'XLSX roundtrip: 0 current value preserved');
} catch (e) {
  assert(false, `XLSX test threw error: ${e.message}`);
}

console.log(`\n=== TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED ===`);
if (testsFailed > 0) {
  process.exit(1);
}
