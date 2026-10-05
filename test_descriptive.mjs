import {
  calculateDescriptiveStatistics,
  extractValidNumbers,
  calculateQuantile,
  calculateMode,
  calculateFrequencyDistribution
} from './src/statistics/descriptive.js';

console.log('=== RUNNING RIGOROUS PHASE 3 MATHEMATICAL VERIFICATION TESTS ===\n');

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

function approxEqual(val1, val2, tolerance = 0.001) {
  return Math.abs(val1 - val2) < tolerance;
}

// ----------------------------------------------------
// TEST 1: Specification Dataset A: [2, 4, 6, 8, 10]
// ----------------------------------------------------
console.log('--- TEST SET 1: Specification Dataset A [2, 4, 6, 8, 10] ---');
const dataA = [2, 4, 6, 8, 10];
const resA = calculateDescriptiveStatistics(dataA, 'DatasetA');

assert(resA.n === 5, `Dataset A: n = 5 (got ${resA.n})`);
assert(resA.sum === 30, `Dataset A: Sum = 30 (got ${resA.sum})`);
assert(resA.mean === 6, `Dataset A: Mean = 6 (got ${resA.mean})`);
assert(resA.median === 6, `Dataset A: Median = 6 (got ${resA.median})`);
assert(resA.min === 2, `Dataset A: Min = 2 (got ${resA.min})`);
assert(resA.max === 10, `Dataset A: Max = 10 (got ${resA.max})`);
assert(resA.range === 8, `Dataset A: Range = 8 (got ${resA.range})`);
assert(resA.populationVariance === 8, `Dataset A: Population Variance = 8 (got ${resA.populationVariance})`);
assert(approxEqual(resA.populationSD, Math.sqrt(8)), `Dataset A: Population SD = sqrt(8) ≈ 2.8284 (got ${resA.populationSD})`);
assert(resA.sampleVariance === 10, `Dataset A: Sample Variance = 10 (got ${resA.sampleVariance})`);
assert(approxEqual(resA.sampleSD, Math.sqrt(10)), `Dataset A: Sample SD = sqrt(10) ≈ 3.1623 (got ${resA.sampleSD})`);

// Method 7 Quartiles for [2, 4, 6, 8, 10]:
// n = 5. p = 0.25 -> index = (5 - 1)*0.25 = 1.0 -> sorted[1] = 4
// p = 0.75 -> index = (5 - 1)*0.75 = 3.0 -> sorted[3] = 8
assert(resA.q1 === 4, `Dataset A: Q1 = 4 (got ${resA.q1})`);
assert(resA.q3 === 8, `Dataset A: Q3 = 8 (got ${resA.q3})`);
assert(resA.iqr === 4, `Dataset A: IQR = 4 (got ${resA.iqr})`);

// ----------------------------------------------------
// TEST 2: Specification Dataset B: [0, 0, 2, 2, 2, 4]
// ----------------------------------------------------
console.log('\n--- TEST SET 2: Specification Dataset B [0, 0, 2, 2, 2, 4] ---');
const dataB = [0, 0, 2, 2, 2, 4];
const resB = calculateDescriptiveStatistics(dataB, 'DatasetB');

assert(resB.n === 6, `Dataset B: n = 6 observations (got ${resB.n})`);
assert(resB.excludedCount === 0, 'Dataset B: 0 was preserved, zero excluded');
assert(resB.sum === 10, `Dataset B: Sum = 10 (got ${resB.sum})`);
assert(approxEqual(resB.mean, 10 / 6), `Dataset B: Mean = 10/6 ≈ 1.6667 (got ${resB.mean})`);
assert(resB.median === 2, `Dataset B: Median = 2 (got ${resB.median})`);
assert(resB.mode.hasRepeatedMode === true, 'Dataset B: Has repeated mode');
assert(resB.mode.modes.length === 1 && resB.mode.modes[0] === 2, `Dataset B: Mode = 2 (got ${resB.mode.modes})`);
assert(resB.mode.maxFrequency === 3, `Dataset B: Mode frequency = 3 (got ${resB.mode.maxFrequency})`);
assert(approxEqual(resB.populationVariance, 1.8889), `Dataset B: Population Variance ≈ 1.8889 (got ${resB.populationVariance})`);
assert(approxEqual(resB.sampleVariance, 2.2667), `Dataset B: Sample Variance ≈ 2.2667 (got ${resB.sampleVariance})`);
assert(approxEqual(resB.populationSD, Math.sqrt(1.888888)), `Dataset B: Population SD ≈ 1.3744 (got ${resB.populationSD})`);
assert(approxEqual(resB.sampleSD, Math.sqrt(2.266666)), `Dataset B: Sample SD ≈ 1.5055 (got ${resB.sampleSD})`);

// ----------------------------------------------------
// TEST 3: Edge Cases (Empty, Nulls, Missing, Whitespace)
// ----------------------------------------------------
console.log('\n--- TEST SET 3: Missing Values & Empty Inputs ---');
const emptyRes = calculateDescriptiveStatistics([], 'EmptyCol');
assert(emptyRes.hasData === false, 'Empty array correctly returns hasData: false');
assert(emptyRes.n === 0, 'Empty array has n = 0');

const dataWithNulls = [null, 10, 'NA', '  ', 20, undefined, 30, NaN];
const resNulls = calculateDescriptiveStatistics(dataWithNulls, 'NullsCol');
assert(resNulls.n === 3, `Nulls: Exactly 3 valid numbers [10, 20, 30] extracted (got ${resNulls.n})`);
assert(resNulls.excludedCount === 5, `Nulls: Exactly 5 values excluded (got ${resNulls.excludedCount})`);
assert(resNulls.mean === 20, `Nulls: Mean = 20 (got ${resNulls.mean})`);

// ----------------------------------------------------
// TEST 4: Single Observation (n = 1)
// ----------------------------------------------------
console.log('\n--- TEST SET 4: Single Observation n = 1 ---');
const singleData = [42];
const resSingle = calculateDescriptiveStatistics(singleData, 'SingleCol');
assert(resSingle.n === 1, 'Single: n = 1');
assert(resSingle.mean === 42, 'Single: Mean = 42');
assert(resSingle.populationVariance === 0, 'Single: Population Variance = 0');
assert(resSingle.sampleVariance === null, 'Single: Sample Variance is null (avoids 1/(1-1) division by zero)');
assert(resSingle.sampleSD === null, 'Single: Sample SD is null');

// ----------------------------------------------------
// TEST 5: Constant Column (Zero Variance)
// ----------------------------------------------------
console.log('\n--- TEST SET 5: Constant Column ---');
const constantData = [5, 5, 5, 5, 5];
const resConst = calculateDescriptiveStatistics(constantData, 'ConstantCol');
assert(resConst.mean === 5, 'Constant: Mean = 5');
assert(resConst.range === 0, 'Constant: Range = 0');
assert(resConst.populationVariance === 0, 'Constant: Population Variance = 0');
assert(resConst.sampleVariance === 0, 'Constant: Sample Variance = 0');
assert(resConst.mode.modes[0] === 5, 'Constant: Mode is 5');

// ----------------------------------------------------
// TEST 6: Negative and Decimal Values
// ----------------------------------------------------
console.log('\n--- TEST SET 6: Negative & Decimal Numbers ---');
const negDecData = [-10.5, -5.5, 0.0, 5.5, 10.5];
const resNegDec = calculateDescriptiveStatistics(negDecData, 'NegDecCol');
assert(resNegDec.mean === 0, `NegDec: Mean = 0 (got ${resNegDec.mean})`);
assert(resNegDec.sum === 0, `NegDec: Sum = 0 (got ${resNegDec.sum})`);
assert(resNegDec.median === 0, `NegDec: Median = 0 (got ${resNegDec.median})`);
assert(resNegDec.min === -10.5, `NegDec: Min = -10.5 (got ${resNegDec.min})`);
assert(resNegDec.max === 10.5, `NegDec: Max = 10.5 (got ${resNegDec.max})`);
assert(resNegDec.range === 21, `NegDec: Range = 21 (got ${resNegDec.range})`);

// ----------------------------------------------------
// TEST 7: Multiple Modes & No Repeated Mode
// ----------------------------------------------------
console.log('\n--- TEST SET 7: Multimodal vs No Repeated Mode ---');
const noRepeats = [1, 2, 3, 4, 5];
const resNoRepeats = calculateMode(noRepeats);
assert(resNoRepeats.hasRepeatedMode === false, 'No repeats: hasRepeatedMode is false');

const bimodal = [1, 1, 2, 3, 3, 4];
const resBimodal = calculateMode(bimodal);
assert(resBimodal.isMultimodal === true, 'Bimodal: isMultimodal is true');
assert(resBimodal.modes.length === 2 && resBimodal.modes[0] === 1 && resBimodal.modes[1] === 3, 'Bimodal: Modes are [1, 3]');

// ----------------------------------------------------
// TEST 8: Deviations Summation Proof: sum(x_i - mean) = 0
// ----------------------------------------------------
console.log('\n--- TEST SET 8: Fundamental Theorem: sum(x_i - mean) = 0 ---');
const theoremData = [12.4, 25.1, 7.8, 99.2, 45.6, 18.0, 33.3];
const resTheorem = calculateDescriptiveStatistics(theoremData, 'TheoremCol');
const sumDevs = resTheorem.deviations.reduce((acc, d) => acc + d.deviation, 0);
assert(approxEqual(sumDevs, 0, 1e-8), `Deviations theorem: sum(x - mean) = 0 (got ${sumDevs})`);

// ----------------------------------------------------
// TEST 9: High Volume Scale Test (10,000 Numbers)
// ----------------------------------------------------
console.log('\n--- TEST SET 9: Performance Test (10,000 observations) ---');
const largeData = Array.from({ length: 10000 }, (_, i) => i + 1); // 1 to 10,000
const t0 = Date.now();
const resLarge = calculateDescriptiveStatistics(largeData, 'LargeCol');
const elapsed = Date.now() - t0;
assert(resLarge.n === 10000, 'Large: n = 10,000');
assert(resLarge.mean === 5000.5, `Large: Mean = 5000.5 (got ${resLarge.mean})`);
assert(resLarge.median === 5000.5, `Large: Median = 5000.5 (got ${resLarge.median})`);
assert(elapsed < 100, `Large: Computed in < 100ms (took ${elapsed}ms)`);

// ----------------------------------------------------
// TEST 10: Step-by-Step Derivation Structure Verification
// ----------------------------------------------------
console.log('\n--- TEST SET 10: Step-by-Step Derivation Structure Verification ---');
// Dataset A: [2, 4, 6, 8, 10] (odd n=5)
assert(resA.explanations.mean.n === 5, 'Derivation Mean: n = 5');
assert(resA.explanations.mean.sum === 30, 'Derivation Mean: sum = 30');
assert(resA.explanations.mean.result === 6, 'Derivation Mean: result = 6');

assert(resA.explanations.median.isOdd === true, 'Derivation Median: isOdd is true for n = 5');
assert(resA.explanations.median.middlePosition === 3, 'Derivation Median: middlePosition = 3');
assert(resA.explanations.median.middleValue === 6, 'Derivation Median: middleValue = 6');

// Dataset B: [0, 0, 2, 2, 2, 4] (even n=6)
assert(resB.explanations.median.isOdd === false, 'Derivation Median: isOdd is false for n = 6');
assert(resB.explanations.median.pos1 === 3 && resB.explanations.median.pos2 === 4, 'Derivation Median: middle ranks 3 and 4');
assert(resB.explanations.median.val1 === 2 && resB.explanations.median.val2 === 2, 'Derivation Median: middle values 2 and 2');

assert(resB.explanations.mode.hasRepeatedMode === true, 'Derivation Mode: hasRepeatedMode is true');
assert(resB.explanations.mode.maxFrequency === 3, 'Derivation Mode: maxFrequency = 3');
assert(resB.explanations.mode.frequencyTable.length === 3, 'Derivation Mode: frequencyTable has 3 distinct values');
assert(resB.explanations.mode.frequencyTable[0].value === 2 && resB.explanations.mode.frequencyTable[0].frequency === 3, 'Derivation Mode: Top frequency entry is 2 (freq 3)');

assert(resA.explanations.sampleVariance.mean === 6, 'Derivation Variance: mean = 6');
assert(resA.explanations.sampleVariance.df === 4, 'Derivation Variance: df = 4');
assert(resA.explanations.sampleVariance.sumOfSquares === 40, 'Derivation Variance: sumOfSquares = 40');
assert(resA.explanations.sampleVariance.deviations.length === 5, 'Derivation Variance: deviations array length = 5');

assert(resA.explanations.sampleSD.variance === 10, 'Derivation SD: variance reference = 10');
assert(approxEqual(resA.explanations.sampleSD.result, Math.sqrt(10)), 'Derivation SD: result = sqrt(10)');

assert(resA.explanations.range.min === 2 && resA.explanations.range.max === 10, 'Derivation Range: min = 2, max = 10');
assert(resA.explanations.range.result === 8, 'Derivation Range: result = 8');

assert(resA.explanations.iqr.q1 === 4 && resA.explanations.iqr.q3 === 8, 'Derivation IQR: Q1 = 4, Q3 = 8');
assert(resA.explanations.iqr.q1Details !== null && resA.explanations.iqr.q1Details.p === 0.25, 'Derivation IQR: Q1 details p = 0.25');
assert(resA.explanations.iqr.q3Details !== null && resA.explanations.iqr.q3Details.p === 0.75, 'Derivation IQR: Q3 details p = 0.75');
assert(resA.explanations.iqr.result === 4, 'Derivation IQR: result = 4');

console.log(`\n=== ALL MODULE I STATISTICAL TESTS PASSED: ${testsPassed} PASSED, ${testsFailed} FAILED ===`);
if (testsFailed > 0) {
  process.exit(1);
}
