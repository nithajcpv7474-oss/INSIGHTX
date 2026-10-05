import assert from 'node:assert';
import {
  extractValidPairs,
  computeRanks,
  interpretCorrelation,
  calculateCorrelation,
} from './src/statistics/correlation.js';

console.log('🧪 Starting INSIGHTX Phase 4 Correlation Test Suite...\n');

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
  }
}

// -------------------------------------------------------------
// Case 1: Pairwise Complete Extraction & Zero Preservation
// -------------------------------------------------------------
test('extractValidPairs preserves 0 and 0.0, excludes null, undefined, NaN, empty strings, and non-numeric', () => {
  const x = [0, 10, null, 20, 'hello', 30, '40', undefined, 50];
  const y = [5, 0,  15,   25, 35,      NaN,  '45', 55,        65];
  const { validPairs, excludedCount, totalCount } = extractValidPairs(x, y);

  // Valid pairs should be:
  // (0, 5) -> index 0: valid
  // (10, 0) -> index 1: valid (0 preserved!)
  // (null, 15) -> index 2: excluded
  // (20, 25) -> index 3: valid
  // ('hello', 35) -> index 4: excluded
  // (30, NaN) -> index 5: excluded
  // ('40', '45') -> index 6: valid (numeric strings coerced)
  // (undefined, 55) -> index 7: excluded
  // (50, 65) -> index 8: valid
  assert.strictEqual(totalCount, 9);
  assert.strictEqual(excludedCount, 4);
  assert.strictEqual(validPairs.length, 5);

  assert.strictEqual(validPairs[0].x, 0);
  assert.strictEqual(validPairs[0].y, 5);
  assert.strictEqual(validPairs[1].x, 10);
  assert.strictEqual(validPairs[1].y, 0);
  assert.strictEqual(validPairs[3].x, 40);
  assert.strictEqual(validPairs[3].y, 45);
});

// -------------------------------------------------------------
// Case 2: Fractional Average Ranks with Ties
// -------------------------------------------------------------
test('computeRanks calculates correct average ranks for tied and untied values', () => {
  // Untied: [10, 20, 30] -> ranks [1, 2, 3]
  const ranks1 = computeRanks([10, 20, 30]);
  assert.deepStrictEqual(ranks1, [1, 2, 3]);

  // Two-way tie: [10, 10, 20] -> positions 1, 2 have average rank 1.5
  const ranks2 = computeRanks([10, 10, 20]);
  assert.deepStrictEqual(ranks2, [1.5, 1.5, 3]);

  // Three-way tie: [5, 20, 5, 5, 30] -> sorted: 5 (pos 1), 5 (pos 2), 5 (pos 3), 20 (pos 4), 30 (pos 5)
  // average of (1+2+3)/3 = 2.0
  const ranks3 = computeRanks([5, 20, 5, 5, 30]);
  assert.deepStrictEqual(ranks3, [2, 4, 2, 2, 5]);
});

// -------------------------------------------------------------
// Case A: Perfect Positive Correlation
// -------------------------------------------------------------
test('Case A: Perfect positive linear relationship (r = 1.0, rho = 1.0)', () => {
  const x = [1, 2, 3, 4, 5];
  const y = [2, 4, 6, 8, 10];
  const res = calculateCorrelation(x, y, 'X', 'Y');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.n, 5);
  assert.strictEqual(res.pearsonR, 1.0);
  assert.strictEqual(res.spearmanRho, 1.0);
  assert.strictEqual(res.rSquared, 1.0);
  assert.strictEqual(res.interpretation.strength, 'Very Strong');
  assert.strictEqual(res.interpretation.direction, 'Positive (Direct)');
  assert.strictEqual(res.visualTrendline.slope, 2);
  assert.strictEqual(res.visualTrendline.intercept, 0);
});

// -------------------------------------------------------------
// Case B: Perfect Negative Correlation
// -------------------------------------------------------------
test('Case B: Perfect negative linear relationship (r = -1.0, rho = -1.0)', () => {
  const x = [1, 2, 3, 4, 5];
  const y = [10, 8, 6, 4, 2];
  const res = calculateCorrelation(x, y, 'X', 'Y');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.n, 5);
  assert.strictEqual(res.pearsonR, -1.0);
  assert.strictEqual(res.spearmanRho, -1.0);
  assert.strictEqual(res.rSquared, 1.0);
  assert.strictEqual(res.interpretation.strength, 'Very Strong');
  assert.strictEqual(res.interpretation.direction, 'Negative (Inverse)');
  assert.strictEqual(res.visualTrendline.slope, -2);
  assert.strictEqual(res.visualTrendline.intercept, 12);
});

// -------------------------------------------------------------
// Case C: Non-linear Symmetry (Zero Linear Association)
// -------------------------------------------------------------
test('Case C: Symmetric parabola has zero linear correlation (r = 0.0)', () => {
  // y = x^2 with symmetric x: [-2, -1, 0, 1, 2]
  // meanX = 0, y = [4, 1, 0, 1, 4]
  // SP_xy = -2(4) + -1(1) + 0(0) + 1(1) + 2(4) = -8 - 1 + 0 + 1 + 8 = 0
  const x = [-2, -1, 0, 1, 2];
  const y = [4, 1, 0, 1, 4];
  const res = calculateCorrelation(x, y, 'X', 'Y');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.pearsonR, 0);
  assert.strictEqual(res.rSquared, 0);
  assert.strictEqual(res.interpretation.direction, 'None (Zero Linear Association)');
});

// -------------------------------------------------------------
// Case D: Tied Ranks Verification
// -------------------------------------------------------------
test('Case D: Spearman rank correlation with tied ranks', () => {
  const x = [1, 1, 2, 3];
  const y = [4, 3, 2, 1];
  const res = calculateCorrelation(x, y, 'X', 'Y');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.pairedRows[0].rankX, 1.5);
  assert.strictEqual(res.pairedRows[1].rankX, 1.5);
  assert.strictEqual(res.pairedRows[2].rankX, 3);
  assert.strictEqual(res.pairedRows[3].rankX, 4);

  // Inverse monotonic trend with ties
  assert(res.spearmanRho < -0.9);
});

// -------------------------------------------------------------
// Case E: Pairwise Incomplete / Missing Values
// -------------------------------------------------------------
test('Case E: Missing values handled pairwise with correct excluded count', () => {
  const x = [1, 2, null, 4];
  const y = [2, 4, 6, 8];
  const res = calculateCorrelation(x, y, 'X', 'Y');

  assert.strictEqual(res.totalCount, 4);
  assert.strictEqual(res.excludedCount, 1);
  assert.strictEqual(res.n, 3);
  assert.strictEqual(res.pearsonR, 1.0);
});

// -------------------------------------------------------------
// Case F: Constant Column (Zero Variance / Undefined)
// -------------------------------------------------------------
test('Case F: Constant variable produces null/undefined correlation, NOT misleading 0.0', () => {
  const x = [5, 5, 5, 5, 5];
  const y = [1, 2, 3, 4, 5];
  const res = calculateCorrelation(x, y, 'X', 'Y');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.isUndefined, true);
  assert.strictEqual(res.isXConstant, true);
  assert.strictEqual(res.isYConstant, false);
  assert.strictEqual(res.pearsonR, null);
  assert.strictEqual(res.spearmanRho, null);
  assert.strictEqual(res.rSquared, null);
  assert.strictEqual(res.interpretation.strength, 'Undefined');
});

// -------------------------------------------------------------
// Case G: Insufficient Observations (n < 2)
// -------------------------------------------------------------
test('Case G: Insufficient observations (n = 0 or n = 1) returns hasData: false', () => {
  const res0 = calculateCorrelation([], []);
  assert.strictEqual(res0.hasData, false);

  const res1 = calculateCorrelation([42], [99]);
  assert.strictEqual(res1.hasData, false);
  assert.strictEqual(res1.n, 1);
});

// -------------------------------------------------------------
// Case H: Sample vs Population Covariance
// -------------------------------------------------------------
test('Case H: Sample and population covariance calculation and Bessel correction', () => {
  // X = [1, 2, 3], Y = [2, 4, 6]
  // meanX = 2, meanY = 4
  // devX = [-1, 0, 1], devY = [-2, 0, 2]
  // crossProducts = [2, 0, 2], sumCrossProducts = 4
  // Population Cov = 4 / 3 ≈ 1.3333
  // Sample Cov = 4 / (3 - 1) = 2.0
  const x = [1, 2, 3];
  const y = [2, 4, 6];
  const res = calculateCorrelation(x, y, 'X', 'Y');

  assert.strictEqual(res.sumCrossProducts, 4);
  assert.strictEqual(res.sampleCovariance, 2.0);
  assert.strictEqual(res.populationCovariance, 1.3333);
});

// -------------------------------------------------------------
// Case I: Decimal, Negative Values, and Autocorrelation
// -------------------------------------------------------------
test('Case I: Decimal, negative values, and autocorrelation (X with X)', () => {
  const vals = [-2.5, 0.0, 3.25, 7.8, -1.1];
  const res = calculateCorrelation(vals, vals, 'Test', 'Test');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.n, 5);
  assert.strictEqual(res.pearsonR, 1.0);
  assert.strictEqual(res.spearmanRho, 1.0);
  assert.strictEqual(res.rSquared, 1.0);
});

console.log(`\n========================================`);
console.log(`Results: ${passedTests}/${totalTests} tests passed.`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
