import assert from 'node:assert';
import { calculateRegression } from './src/statistics/regression.js';

console.log('🧪 Starting INSIGHTX Phase 5 Regression Test Suite...\n');

let totalTests = 0;
let passedTests = 0;
const EPSILON = 1e-4;

function approxEqual(actual, expected, msg, tol = EPSILON) {
  assert(
    Math.abs(actual - expected) <= tol,
    `${msg} — Expected ~${expected}, got ${actual} (diff: ${Math.abs(actual - expected)})`
  );
}

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
// Test A: Perfect Positive Linear Relationship
// -------------------------------------------------------------
test('Test A: Perfect positive relationship (X=[1,2,3,4,5], Y=[2,4,6,8,10])', () => {
  const x = [1, 2, 3, 4, 5];
  const y = [2, 4, 6, 8, 10];
  const res = calculateRegression(x, y, 'X', 'Y');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.n, 5);
  approxEqual(res.slope, 2.0, 'Slope should be 2.0');
  approxEqual(res.intercept, 0.0, 'Intercept should be 0.0');
  approxEqual(res.rSquared, 1.0, 'R² should be 1.0');
  approxEqual(res.rmse, 0.0, 'RMSE should be 0.0');
  approxEqual(res.mae, 0.0, 'MAE should be 0.0');
  approxEqual(res.sse, 0.0, 'SSE should be 0.0');
  approxEqual(res.residualSum, 0.0, 'Residual sum should be 0.0');
  assert.strictEqual(res.predict(6), 12);
  assert.strictEqual(res.predict(0), 0);
});

// -------------------------------------------------------------
// Test B: Perfect Negative Linear Relationship
// -------------------------------------------------------------
test('Test B: Perfect negative relationship (X=[1,2,3,4,5], Y=[10,8,6,4,2])', () => {
  const x = [1, 2, 3, 4, 5];
  const y = [10, 8, 6, 4, 2];
  const res = calculateRegression(x, y, 'X', 'Y');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.n, 5);
  approxEqual(res.slope, -2.0, 'Slope should be -2.0');
  approxEqual(res.intercept, 12.0, 'Intercept should be 12.0');
  approxEqual(res.rSquared, 1.0, 'R² should be 1.0');
  approxEqual(res.rmse, 0.0, 'RMSE should be 0.0');
  approxEqual(res.mae, 0.0, 'MAE should be 0.0');
  assert.strictEqual(res.predict(6), 0);
  assert.strictEqual(res.predict(0), 12);
});

// -------------------------------------------------------------
// Test C: Non-perfect Relationship (Analytical Validation)
// -------------------------------------------------------------
test('Test C: Non-perfect relationship (X=[1,2,3], Y=[1,2,2])', () => {
  const x = [1, 2, 3];
  const y = [1, 2, 2];
  const res = calculateRegression(x, y, 'X', 'Y');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.n, 3);

  // Analytical expectations:
  // meanX = 2.0, meanY = 1.6667
  // SS_x = 2.0, SP_xy = 1.0, SST = 2/3 ≈ 0.6667
  // slope = 0.5, intercept = 2/3 ≈ 0.6667
  // SSE = 1/6 ≈ 0.1667, SSR = 0.5
  // R² = 0.75
  // RMSE = sqrt(1/18) ≈ 0.2357
  // MAE = 2/9 ≈ 0.2222
  approxEqual(res.slope, 0.5, 'Slope should be 0.5');
  approxEqual(res.intercept, 2 / 3, 'Intercept should be 2/3');
  approxEqual(res.sst, 2 / 3, 'SST should be 2/3');
  approxEqual(res.sse, 1 / 6, 'SSE should be 1/6');
  approxEqual(res.ssr, 0.5, 'SSR should be 0.5');
  approxEqual(res.rSquared, 0.75, 'R² should be 0.75');
  approxEqual(res.rmse, Math.sqrt(1 / 18), 'RMSE should be sqrt(1/18)');
  approxEqual(res.mae, 2 / 9, 'MAE should be 2/9');
  approxEqual(res.residualSum, 0.0, 'Sum of residuals should equal 0');

  // Check individual predictions and residuals
  approxEqual(res.rows[0].yHat, 7 / 6, 'ŷ₁ should be 7/6');
  approxEqual(res.rows[0].residual, -1 / 6, 'e₁ should be -1/6');
  approxEqual(res.rows[1].yHat, 5 / 3, 'ŷ₂ should be 5/3');
  approxEqual(res.rows[1].residual, 1 / 3, 'e₂ should be 1/3');
  approxEqual(res.rows[2].yHat, 13 / 6, 'ŷ₃ should be 13/6');
  approxEqual(res.rows[2].residual, -1 / 6, 'e₃ should be -1/6');
});

// -------------------------------------------------------------
// Test D: Constant X (Undefined Slope & Equation)
// -------------------------------------------------------------
test('Test D: Constant X (X=[3,3,3,3], Y=[1,2,3,4]) reports undefined slope', () => {
  const x = [3, 3, 3, 3];
  const y = [1, 2, 3, 4];
  const res = calculateRegression(x, y, 'X', 'Y');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.isXConstant, true);
  assert.strictEqual(res.isUndefined, true);
  assert.strictEqual(res.slope, null);
  assert.strictEqual(res.intercept, null);
  assert.strictEqual(res.rSquared, null);
  assert(res.equation.includes('Undefined'));
  assert.strictEqual(res.predict(3), null);
});

// -------------------------------------------------------------
// Test E: Constant Y (Zero Slope & Indeterminate R²)
// -------------------------------------------------------------
test('Test E: Constant Y (X=[1,2,3,4], Y=[5,5,5,5]) has zero slope and zero residuals', () => {
  const x = [1, 2, 3, 4];
  const y = [5, 5, 5, 5];
  const res = calculateRegression(x, y, 'X', 'Y');

  assert.strictEqual(res.hasData, true);
  assert.strictEqual(res.isYConstant, true);
  approxEqual(res.slope, 0.0, 'Slope should be 0.0');
  approxEqual(res.intercept, 5.0, 'Intercept should be 5.0');
  approxEqual(res.sse, 0.0, 'SSE should be 0.0');
  approxEqual(res.rmse, 0.0, 'RMSE should be 0.0');
  approxEqual(res.mae, 0.0, 'MAE should be 0.0');
  assert.strictEqual(res.rSquared, null); // SST = 0 -> R² is indeterminate (0/0)
  assert.strictEqual(res.predict(10), 5.0);
});

// -------------------------------------------------------------
// Test F: Missing and Invalid Values (Pairwise Complete)
// -------------------------------------------------------------
test('Test F: Missing and invalid values handled pairwise with correct exclusion count', () => {
  const x = [1, null, 3, 'hello', 5, undefined, 7];
  const y = [2, 4,    6, 8,       10, 12,       14];
  const res = calculateRegression(x, y, 'X', 'Y');

  assert.strictEqual(res.totalCount, 7);
  assert.strictEqual(res.excludedCount, 3);
  assert.strictEqual(res.n, 4);
  approxEqual(res.slope, 2.0, 'Slope should be 2.0 for pairs (1,2), (3,6), (5,10), (7,14)');
  approxEqual(res.intercept, 0.0, 'Intercept should be 0.0');
  approxEqual(res.rSquared, 1.0, 'R² should be 1.0');
});

// -------------------------------------------------------------
// Test G: Edge Cases (Empty, n=1, Negatives, Decimals, Zeros, Large Dataset)
// -------------------------------------------------------------
test('Test G1: Empty array and n=1 return hasData: false', () => {
  const emptyRes = calculateRegression([], []);
  assert.strictEqual(emptyRes.hasData, false);

  const oneRes = calculateRegression([10], [20]);
  assert.strictEqual(oneRes.hasData, false);
  assert.strictEqual(oneRes.n, 1);
});

test('Test G2: Negative and decimal values', () => {
  const x = [-2.5, -1.0, 0.0, 1.5, 3.0];
  // y = 1.5x - 4.2
  const y = x.map((v) => Number((1.5 * v - 4.2).toFixed(4)));
  const res = calculateRegression(x, y, 'X', 'Y');

  approxEqual(res.slope, 1.5, 'Slope should be 1.5');
  approxEqual(res.intercept, -4.2, 'Intercept should be -4.2');
  approxEqual(res.rSquared, 1.0, 'R² should be 1.0');
  approxEqual(res.rmse, 0.0, 'RMSE should be 0.0');
});

test('Test G3: Large dataset scalability (n=10,000)', () => {
  const N = 10000;
  const x = new Array(N);
  const y = new Array(N);
  for (let i = 0; i < N; i++) {
    x[i] = i;
    y[i] = 3.5 * i + 10.0;
  }
  const t0 = performance.now();
  const res = calculateRegression(x, y, 'X', 'Y');
  const t1 = performance.now();

  assert.strictEqual(res.n, N);
  approxEqual(res.slope, 3.5, 'Slope should be 3.5');
  approxEqual(res.intercept, 10.0, 'Intercept should be 10.0');
  approxEqual(res.rSquared, 1.0, 'R² should be 1.0');
  assert(t1 - t0 < 200, `Execution took ${t1 - t0}ms, should be < 200ms`);
});

console.log(`\n========================================`);
console.log(`Results: ${passedTests}/${totalTests} tests passed.`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
