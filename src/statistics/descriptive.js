/**
 * INSIGHTX — Module I: Descriptive Statistics Mathematical Engine
 *
 * Implements rigorous mathematical algorithms for univariate analysis:
 * - Central Tendency: Mean, Median, Mode (unimodal, bimodal, multimodal, or no repeated mode)
 * - Dispersion: Range, Variance (Population & Sample), Standard Deviation (Population & Sample), IQR
 * - Position: Quartiles (Q1, Q2, Q3) and Percentiles (P10, P25, P50, P75, P90)
 * - Frequency Distributions & Histogram Binning
 *
 * Quantile Convention Documented:
 * Uses Method 7 (standard convention in NumPy, R `type=7`, Excel `PERCENTILE.INC`).
 * For rank p in [0, 1] with n observations:
 * index = (n - 1) * p
 * lower = floor(index), upper = ceil(index), weight = index - lower
 * Q(p) = (1 - weight) * sorted[lower] + weight * sorted[upper]
 */

import { isValueMissing } from '../utils/dataParser.js';

/**
 * Validates and extracts finite numerical values from raw input array.
 * Explicitly preserves 0 and 0.0.
 */
export function extractValidNumbers(rawValues) {
  if (!rawValues || !Array.isArray(rawValues)) {
    return {
      validNumbers: [],
      excludedCount: 0,
      totalCount: 0
    };
  }

  const validNumbers = [];
  let excludedCount = 0;

  for (let i = 0; i < rawValues.length; i++) {
    const v = rawValues[i];

    if (isValueMissing(v)) {
      excludedCount++;
      continue;
    }

    if (typeof v === 'number') {
      if (!isNaN(v) && isFinite(v)) {
        validNumbers.push(v);
      } else {
        excludedCount++;
      }
    } else if (typeof v === 'string') {
      const trimmed = v.trim();
      if (trimmed !== '') {
        const num = Number(trimmed);
        if (!isNaN(num) && isFinite(num)) {
          validNumbers.push(num);
        } else {
          excludedCount++;
        }
      } else {
        excludedCount++;
      }
    } else {
      excludedCount++;
    }
  }

  return {
    validNumbers,
    excludedCount,
    totalCount: rawValues.length
  };
}

/**
 * Computes quantile using Method 7 (linear interpolation on (n-1)*p).
 * Assumes sorted array in ascending order.
 */
export function calculateQuantile(sortedNumbers, p) {
  const n = sortedNumbers.length;
  if (n === 0) return null;
  if (n === 1) return sortedNumbers[0];
  if (p <= 0) return sortedNumbers[0];
  if (p >= 1) return sortedNumbers[n - 1];

  const index = (n - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) {
    return sortedNumbers[lower];
  }

  return (1 - weight) * sortedNumbers[lower] + weight * sortedNumbers[upper];
}

/**
 * Calculates mode(s) with frequency analysis.
 */
export function calculateMode(numbers) {
  if (!numbers || numbers.length === 0) {
    return {
      modes: [],
      maxFrequency: 0,
      isMultimodal: false,
      hasRepeatedMode: false,
      description: 'No observations'
    };
  }

  const freqMap = new Map();
  for (const num of numbers) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  let maxFrequency = 0;
  for (const count of freqMap.values()) {
    if (count > maxFrequency) {
      maxFrequency = count;
    }
  }

  const frequencyTable = [];
  for (const [val, count] of freqMap.entries()) {
    frequencyTable.push({
      value: val,
      frequency: count,
      percentage: Number(((count / numbers.length) * 100).toFixed(2))
    });
  }
  // Sort frequency table: highest frequency first, then by ascending value
  frequencyTable.sort((a, b) => b.frequency - a.frequency || a.value - b.value);

  // If every unique value appears exactly once, there is no repeated mode
  if (maxFrequency === 1) {
    return {
      modes: [],
      maxFrequency: 1,
      isMultimodal: false,
      hasRepeatedMode: false,
      description: 'All values occur once (no repeated mode)',
      frequencyTable
    };
  }

  const modes = [];
  for (const [val, count] of freqMap.entries()) {
    if (count === maxFrequency) {
      modes.push(val);
    }
  }

  // Sort modes numerically
  modes.sort((a, b) => a - b);

  const isMultimodal = modes.length > 1;
  const description = isMultimodal
    ? `Multimodal (${modes.length} modes, frequency = ${maxFrequency})`
    : `Unimodal (mode = ${modes[0]}, frequency = ${maxFrequency})`;

  return {
    modes,
    maxFrequency,
    isMultimodal,
    hasRepeatedMode: true,
    description,
    frequencyTable
  };
}

/**
 * Computes frequency distribution & histogram bins.
 * Uses Sturges' Rule for bin count: k = ceil(1 + log2(n)), with fallback to min 3 bins.
 */
export function calculateFrequencyDistribution(sortedNumbers) {
  const n = sortedNumbers.length;
  if (n === 0) return { bins: [], binWidth: 0, binCount: 0 };

  const min = sortedNumbers[0];
  const max = sortedNumbers[n - 1];

  // If all values are identical (constant column)
  if (min === max) {
    return {
      binCount: 1,
      binWidth: 1,
      bins: [
        {
          index: 1,
          lower: min,
          upper: max,
          center: min,
          label: `${min}`,
          frequency: n,
          relativeFrequency: 1.0,
          relativeFrequencyPct: 100,
          cumulativeFrequency: n,
          cumulativeFrequencyPct: 100
        }
      ]
    };
  }

  // Sturges' Rule
  let binCount = Math.max(3, Math.min(15, Math.ceil(1 + Math.log2(n))));
  let rawBinWidth = (max - min) / binCount;

  // Pretty rounding for bin width
  const binWidth = Number(rawBinWidth.toFixed(4));
  const bins = [];
  let cumulative = 0;

  for (let i = 0; i < binCount; i++) {
    const lower = Number((min + i * rawBinWidth).toFixed(4));
    const upper = Number((min + (i + 1) * rawBinWidth).toFixed(4));
    const center = Number(((lower + upper) / 2).toFixed(4));

    // For the last bin, include the maximum value with <=
    const isLast = i === binCount - 1;
    let count = 0;

    for (let j = 0; j < n; j++) {
      const val = sortedNumbers[j];
      if (isLast ? (val >= lower && val <= upper) : (val >= lower && val < upper)) {
        count++;
      }
    }

    cumulative += count;
    const relFreq = count / n;

    bins.push({
      index: i + 1,
      lower,
      upper,
      center,
      label: `${lower} - ${upper}`,
      frequency: count,
      relativeFrequency: Number(relFreq.toFixed(4)),
      relativeFrequencyPct: Number((relFreq * 100).toFixed(2)),
      cumulativeFrequency: cumulative,
      cumulativeFrequencyPct: Number(((cumulative / n) * 100).toFixed(2))
    });
  }

  return {
    binCount,
    binWidth,
    bins
  };
}

/**
 * Master descriptive statistics calculation routine.
 * Produces complete metrics, step-by-step mathematical substitutions, and deviation rows.
 */
export function calculateDescriptiveStatistics(rawValues, columnName = 'Variable') {
  const extraction = extractValidNumbers(rawValues);
  const { validNumbers, excludedCount, totalCount } = extraction;
  const n = validNumbers.length;

  if (n === 0) {
    return {
      hasData: false,
      columnName,
      n: 0,
      excludedCount,
      totalCount,
      error: 'No valid finite numerical observations found in the selected column.'
    };
  }

  // Sort ascending
  const sorted = [...validNumbers].sort((a, b) => a - b);

  // 1. Sum and Mean
  const sum = validNumbers.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  // 2. Median (P50)
  const median = calculateQuantile(sorted, 0.5);

  // 3. Extremes and Range
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // 4. Mode
  const modeResult = calculateMode(validNumbers);

  // 5. Deviations & Sum of Squared Deviations
  // SS = sum((x_i - mean)^2)
  let sumOfSquares = 0;
  const deviations = validNumbers.map((x, idx) => {
    const diff = x - mean;
    const diffSq = diff * diff;
    sumOfSquares += diffSq;
    return {
      index: idx + 1,
      x,
      deviation: diff,
      deviationSquared: diffSq
    };
  });

  // 6. Variance and Standard Deviation
  // Population Variance: denominator = n
  const populationVariance = sumOfSquares / n;
  const populationSD = Math.sqrt(populationVariance);

  // Sample Variance: denominator = n - 1 (Bessel's correction)
  // When n < 2, sample variance is mathematically undefined (division by 0)
  const sampleVariance = n >= 2 ? sumOfSquares / (n - 1) : null;
  const sampleSD = sampleVariance !== null ? Math.sqrt(sampleVariance) : null;

  // 7. Quartiles and Percentiles (Method 7)
  const q1 = calculateQuantile(sorted, 0.25);
  const q3 = calculateQuantile(sorted, 0.75);
  const iqr = q3 !== null && q1 !== null ? q3 - q1 : null;

  const p10 = calculateQuantile(sorted, 0.10);
  const p25 = q1;
  const p50 = median;
  const p75 = q3;
  const p90 = calculateQuantile(sorted, 0.90);

  // Box-Plot Whiskers (Tukey's standard: 1.5 * IQR)
  let lowerWhisker = min;
  let upperWhisker = max;
  let outliers = [];

  if (iqr !== null) {
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    // Lowest observation >= lowerFence
    for (let i = 0; i < n; i++) {
      if (sorted[i] >= lowerFence) {
        lowerWhisker = sorted[i];
        break;
      }
    }

    // Highest observation <= upperFence
    for (let i = n - 1; i >= 0; i--) {
      if (sorted[i] <= upperFence) {
        upperWhisker = sorted[i];
        break;
      }
    }

    // Outliers outside [lowerFence, upperFence]
    outliers = sorted.filter(v => v < lowerFence || v > upperFence);
  }

  // 8. Frequency distribution
  const frequencyDistribution = calculateFrequencyDistribution(sorted);

  // 9. Skewness heuristic
  let skewnessLabel = 'Symmetric';
  const meanMedianDiff = mean - median;
  const tolerance = (sampleSD || 1) * 0.05;

  if (meanMedianDiff > tolerance) {
    skewnessLabel = 'Positively Skewed (Right-tailed: Mean > Median)';
  } else if (meanMedianDiff < -tolerance) {
    skewnessLabel = 'Negatively Skewed (Left-tailed: Mean < Median)';
  } else {
    skewnessLabel = 'Approximately Symmetric (Mean ≈ Median)';
  }

  // 10. Quantile Step Details for Method 7
  const getQuantileDetails = (p) => {
    if (n === 0) return null;
    if (n === 1) {
      return {
        p,
        index: 0,
        lowerIndex: 0,
        upperIndex: 0,
        weight: 0,
        valLower: sorted[0],
        valUpper: sorted[0],
        interpolatedValue: sorted[0]
      };
    }
    const idx = (n - 1) * p;
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    const weight = idx - lower;
    const valLower = sorted[lower];
    const valUpper = sorted[upper];
    const interpolated = (1 - weight) * valLower + weight * valUpper;
    return {
      p,
      index: Number(idx.toFixed(4)),
      lowerIndex: lower,
      upperIndex: upper,
      weight: Number(weight.toFixed(4)),
      valLower: Number(valLower.toFixed(4)),
      valUpper: Number(valUpper.toFixed(4)),
      interpolatedValue: Number(interpolated.toFixed(4))
    };
  };

  const q1Details = getQuantileDetails(0.25);
  const q3Details = getQuantileDetails(0.75);

  // 11. Step-by-Step Mathematical Derivations
  const isOdd = n % 2 !== 0;
  const explanations = {
    mean: {
      conceptName: 'Arithmetic Mean',
      definition: 'The sum of all observed numerical measurements divided by the sample size, representing the unique center of gravity of the distribution.',
      formula: '\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}',
      symbols: [
        { symbol: '\\bar{x}', meaning: 'Sample arithmetic mean' },
        { symbol: '\\sum', meaning: 'Summation operator across all observations' },
        { symbol: 'x_i', meaning: 'Value of the i-th observation' },
        { symbol: 'n', meaning: 'Number of valid observations' }
      ],
      n,
      sum: Number(sum.toFixed(4)),
      substitution: `\\bar{x} = \\frac{${Number(sum.toFixed(4))}}{${n}}`,
      step: `Summing all ${n} observations yields \\sum x_i = ${Number(sum.toFixed(4))}. Dividing by count ${n}:`,
      steps: [
        `Extract all n = ${n} valid numerical observations from column [${columnName}].`,
        `Calculate algebraic sum of observations: \\sum_{i=1}^{${n}} x_i = ${Number(sum.toFixed(4))}.`,
        `Divide total sum by observation count: \\bar{x} = \\frac{${Number(sum.toFixed(4))}}{${n}} = ${Number(mean.toFixed(4))}.`
      ],
      result: Number(mean.toFixed(4)),
      interpretation: `The center of mass / expected value of ${columnName} is ${Number(mean.toFixed(4))}.`
    },
    median: {
      conceptName: 'Sample Median (Q₂ / 50th Percentile)',
      definition: 'The central value separating the upper 50% and lower 50% of sorted observations. It is non-parametric and resistant to extreme outliers.',
      formula: isOdd ? '\\tilde{x} = x_{(\\frac{n+1}{2})}' : '\\tilde{x} = \\frac{x_{(\\frac{n}{2})} + x_{(\\frac{n}{2}+1)}}{2}',
      symbols: [
        { symbol: '\\tilde{x}', meaning: 'Sample median (50th percentile)' },
        { symbol: 'x_{(k)}', meaning: 'The k-th ordered observation (after sorting)' },
        { symbol: 'n', meaning: 'Total number of observations' }
      ],
      isOdd,
      n,
      sortedValues: sorted,
      middlePosition: isOdd ? (n + 1) / 2 : null,
      middleIndex: isOdd ? (n - 1) / 2 : null,
      middleValue: isOdd ? sorted[(n - 1) / 2] : null,
      pos1: !isOdd ? n / 2 : null,
      pos2: !isOdd ? n / 2 + 1 : null,
      val1: !isOdd ? sorted[n / 2 - 1] : null,
      val2: !isOdd ? sorted[n / 2] : null,
      substitution: isOdd
        ? `\\tilde{x} = x_{(${Math.floor(n/2) + 1})} = ${Number(median.toFixed(4))}`
        : `\\tilde{x} = \\frac{${sorted[n/2 - 1]} + ${sorted[n/2]}}{2} = ${Number(median.toFixed(4))}`,
      step: `Arranging ${n} observations in ascending order: [${sorted.slice(0, 5).join(', ')}${n > 5 ? '...' : ''}].`,
      steps: [
        `Sort all ${n} observations in ascending numerical order: [${sorted.slice(0, 5).join(', ')}${n > 5 ? '...' : ''}].`,
        isOdd
          ? `Sample size n = ${n} is odd. Median is ordered element at rank position (n+1)/2 = ${(n + 1) / 2}.`
          : `Sample size n = ${n} is even. Median is arithmetic average of middle ranks n/2 = ${n/2} (value: ${sorted[n/2 - 1]}) and n/2+1 = ${n/2 + 1} (value: ${sorted[n/2]}).`,
        `Compute final median: ${Number(median.toFixed(4))}.`
      ],
      result: Number(median.toFixed(4)),
      interpretation: `50% of the observations lie at or below ${Number(median.toFixed(4))}, providing a robust central indicator.`
    },
    mode: {
      conceptName: 'Statistical Mode (Mo)',
      definition: 'The observation value or set of values that occurs with the highest frequency in the dataset.',
      formula: 'Mo = \\arg\\max_{x} f(x)',
      symbols: [
        { symbol: 'Mo', meaning: 'Statistical mode' },
        { symbol: 'f(x)', meaning: 'Frequency count of value x' },
        { symbol: 'n', meaning: 'Total observation count' }
      ],
      modes: modeResult.modes,
      maxFrequency: modeResult.maxFrequency,
      hasRepeatedMode: modeResult.hasRepeatedMode,
      isMultimodal: modeResult.isMultimodal,
      frequencyTable: modeResult.frequencyTable || [],
      substitution: modeResult.hasRepeatedMode ? `Mo \\in \\{${modeResult.modes.join(', ')}\\} \\text{ with frequency } f = ${modeResult.maxFrequency}` : 'f_{\\max} = 1 \\text{ (No repeated mode)}',
      step: modeResult.description,
      steps: [
        `Tally frequency distribution across all ${n} observations.`,
        `Determine maximum occurring frequency: ${modeResult.maxFrequency} occurrence(s).`,
        modeResult.hasRepeatedMode
          ? `Identify value(s) matching maximum frequency: ${modeResult.modes.join(', ')}.`
          : 'All observations occur with equal unit frequency; no unique peak mode exists.'
      ],
      result: modeResult.hasRepeatedMode ? modeResult.modes.join(', ') : 'None (No repeated value)',
      interpretation: modeResult.description
    },
    sampleVariance: {
      conceptName: "Sample Variance (Bessel's Correction)",
      definition: 'The sum of squared deviations of each observation from the sample mean divided by degrees of freedom (n - 1) to eliminate downward estimation bias.',
      formula: 's^2 = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n - 1}',
      symbols: [
        { symbol: 's^2', meaning: 'Sample variance' },
        { symbol: 'x_i - \\bar{x}', meaning: 'Deviation of i-th observation from sample mean' },
        { symbol: '\\sum (x_i - \\bar{x})^2', meaning: 'Sum of squared deviations (SS)' },
        { symbol: 'n - 1', meaning: 'Sample degrees of freedom (Bessel correction)' }
      ],
      mean: Number(mean.toFixed(4)),
      n,
      df: n - 1,
      sumOfSquares: Number(sumOfSquares.toFixed(4)),
      deviations,
      substitution: n >= 2
        ? `s^2 = \\frac{${Number(sumOfSquares.toFixed(4))}}{${n} - 1} = \\frac{${Number(sumOfSquares.toFixed(4))}}{${n - 1}}`
        : 'Undefined (n < 2)',
      step: n >= 2
        ? `Sum of squared deviations \\sum(x_i - \\bar{x})^2 = ${Number(sumOfSquares.toFixed(4))}. Dividing by sample degrees of freedom (n - 1 = ${n - 1}):`
        : 'Sample variance requires at least 2 observations to apply Bessel correction.',
      steps: [
        `Compute deviation (x_i - \\bar{x}) for each of the ${n} observations from mean \\bar{x} = ${Number(mean.toFixed(4))}.`,
        `Square each individual deviation: (x_i - \\bar{x})^2.`,
        `Calculate sum of squared deviations: SS = \\sum (x_i - \\bar{x})^2 = ${Number(sumOfSquares.toFixed(4))}.`,
        n >= 2
          ? `Divide by Bessel-corrected degrees of freedom (n - 1 = ${n - 1}): s^2 = \\frac{${Number(sumOfSquares.toFixed(4))}}{${n - 1}} = ${sampleVariance !== null ? Number(sampleVariance.toFixed(4)) : 'N/A'}.`
          : 'Sample size n < 2; sample variance is undefined.'
      ],
      result: sampleVariance !== null ? Number(sampleVariance.toFixed(4)) : 'N/A (n < 2)',
      interpretation: sampleVariance !== null
        ? `Unbiased sample variance is ${Number(sampleVariance.toFixed(4))} units squared.`
        : 'Sample variance cannot be computed for sample size < 2.'
    },
    populationVariance: {
      conceptName: 'Population Variance (σ²)',
      definition: 'The average squared deviation from the population mean μ, divided by total population size N.',
      formula: '\\sigma^2 = \\frac{\\sum_{i=1}^{N} (x_i - \\mu)^2}{N}',
      symbols: [
        { symbol: '\\sigma^2', meaning: 'Population variance' },
        { symbol: 'x_i - \\mu', meaning: 'Deviation of observation from population mean' },
        { symbol: 'N', meaning: 'Total population size' }
      ],
      mean: Number(mean.toFixed(4)),
      n,
      df: n,
      sumOfSquares: Number(sumOfSquares.toFixed(4)),
      deviations,
      substitution: `\\sigma^2 = \\frac{${Number(sumOfSquares.toFixed(4))}}{${n}}`,
      step: `Sum of squared deviations \\sum(x_i - \\mu)^2 = ${Number(sumOfSquares.toFixed(4))}. Dividing by population size (N = ${n}):`,
      steps: [
        `Compute deviation (x_i - \\mu) for each observation from mean μ = ${Number(mean.toFixed(4))}.`,
        `Square each deviation and sum: SS = ${Number(sumOfSquares.toFixed(4))}.`,
        `Divide by population size N = ${n}: \\sigma^2 = \\frac{${Number(sumOfSquares.toFixed(4))}}{${n}} = ${Number(populationVariance.toFixed(4))}.`
      ],
      result: Number(populationVariance.toFixed(4)),
      interpretation: `True population variance is ${Number(populationVariance.toFixed(4))} units squared.`
    },
    sampleSD: {
      conceptName: 'Sample Standard Deviation (s)',
      definition: 'The principal square root of sample variance, measuring average dispersion in the same units as the original data.',
      formula: 's = \\sqrt{s^2} = \\sqrt{\\frac{\\sum_{i=1}^n (x_i - \\bar{x})^2}{n - 1}}',
      symbols: [
        { symbol: 's', meaning: 'Sample standard deviation' },
        { symbol: '\\sqrt{\\cdot}', meaning: 'Principal positive square root' },
        { symbol: 's^2', meaning: 'Sample variance' }
      ],
      variance: sampleVariance !== null ? Number(sampleVariance.toFixed(4)) : null,
      substitution: sampleVariance !== null ? `s = \\sqrt{${Number(sampleVariance.toFixed(4))}}` : 'Undefined',
      step: sampleVariance !== null ? 'Taking the principal square root of sample variance:' : 'Undefined for n < 2',
      steps: [
        `Retrieve sample variance: s^2 = ${sampleVariance !== null ? Number(sampleVariance.toFixed(4)) : 'N/A'}.`,
        sampleVariance !== null
          ? `Compute principal square root: s = \\sqrt{${Number(sampleVariance.toFixed(4))}} = ${Number(sampleSD.toFixed(4))}.`
          : 'Cannot take square root of undefined variance.'
      ],
      result: sampleSD !== null ? Number(sampleSD.toFixed(4)) : 'N/A',
      interpretation: sampleSD !== null
        ? `Observations typically disperse by approximately ±${Number(sampleSD.toFixed(4))} around the mean.`
        : 'Sample standard deviation cannot be computed for n < 2.'
    },
    populationSD: {
      conceptName: 'Population Standard Deviation (σ)',
      definition: 'The principal square root of population variance, representing true parametric dispersion.',
      formula: '\\sigma = \\sqrt{\\sigma^2} = \\sqrt{\\frac{\\sum_{i=1}^N (x_i - \\mu)^2}{N}}',
      symbols: [
        { symbol: '\\sigma', meaning: 'Population standard deviation' },
        { symbol: '\\sigma^2', meaning: 'Population variance' }
      ],
      variance: Number(populationVariance.toFixed(4)),
      substitution: `\\sigma = \\sqrt{${Number(populationVariance.toFixed(4))}}`,
      step: 'Taking the principal square root of population variance:',
      steps: [
        `Retrieve population variance: \\sigma^2 = ${Number(populationVariance.toFixed(4))}.`,
        `Compute principal square root: \\sigma = \\sqrt{${Number(populationVariance.toFixed(4))}} = ${Number(populationSD.toFixed(4))}.`
      ],
      result: Number(populationSD.toFixed(4)),
      interpretation: `Population standard deviation is ${Number(populationSD.toFixed(4))} in original units.`
    },
    range: {
      conceptName: 'Sample Range (R)',
      definition: 'The difference between the maximum and minimum observations, measuring the total span of the data.',
      formula: 'R = x_{\\max} - x_{\\min}',
      symbols: [
        { symbol: 'R', meaning: 'Sample range' },
        { symbol: 'x_{\\max}', meaning: 'Maximum observed value' },
        { symbol: 'x_{\\min}', meaning: 'Minimum observed value' }
      ],
      min: Number(min.toFixed(4)),
      max: Number(max.toFixed(4)),
      range: Number(range.toFixed(4)),
      substitution: `R = ${Number(max.toFixed(4))} - ${Number(min.toFixed(4))}`,
      step: `Subtract minimum value (${Number(min.toFixed(4))}) from maximum value (${Number(max.toFixed(4))}):`,
      steps: [
        `Identify maximum observation in dataset: x_{\\max} = ${Number(max.toFixed(4))}.`,
        `Identify minimum observation in dataset: x_{\\min} = ${Number(min.toFixed(4))}.`,
        `Subtract minimum from maximum: R = ${Number(max.toFixed(4))} - ${Number(min.toFixed(4))} = ${Number(range.toFixed(4))}.`
      ],
      result: Number(range.toFixed(4)),
      interpretation: `The dataset observations span a total distance of ${Number(range.toFixed(4))} units.`
    },
    iqr: {
      conceptName: 'Interquartile Range (IQR)',
      definition: 'The difference between the third quartile (75th percentile) and first quartile (25th percentile), covering the middle 50% of sorted observations.',
      formula: 'IQR = Q_3 - Q_1',
      symbols: [
        { symbol: 'IQR', meaning: 'Interquartile range' },
        { symbol: 'Q_3', meaning: 'Third quartile (75th percentile)' },
        { symbol: 'Q_1', meaning: 'First quartile (25th percentile)' }
      ],
      method: 'Method 7 (Linear Interpolation on (n - 1) * p)',
      q1: Number(q1.toFixed(4)),
      q3: Number(q3.toFixed(4)),
      iqr: Number(iqr.toFixed(4)),
      q1Details,
      q3Details,
      substitution: `IQR = ${Number(q3.toFixed(4))} - ${Number(q1.toFixed(4))}`,
      step: `First quartile (25th percentile) Q1 = ${Number(q1.toFixed(4))}; Third quartile (75th percentile) Q3 = ${Number(q3.toFixed(4))}.`,
      steps: [
        `Compute first quartile (25th percentile): Q_1 = ${Number(q1.toFixed(4))}.`,
        `Compute third quartile (75th percentile): Q_3 = ${Number(q3.toFixed(4))}.`,
        `Subtract Q_1 from Q_3: IQR = ${Number(q3.toFixed(4))} - ${Number(q1.toFixed(4))} = ${Number(iqr.toFixed(4))}.`
      ],
      result: Number(iqr.toFixed(4)),
      interpretation: `The middle 50% of sorted observations span an interval width of ${Number(iqr.toFixed(4))}, completely resistant to extreme outliers.`
    }
  };

  return {
    hasData: true,
    columnName,
    n,
    excludedCount,
    totalCount,
    sum: Number(sum.toFixed(4)),
    mean: Number(mean.toFixed(4)),
    median: Number(median.toFixed(4)),
    min: Number(min.toFixed(4)),
    max: Number(max.toFixed(4)),
    range: Number(range.toFixed(4)),
    mode: modeResult,
    sumOfSquares: Number(sumOfSquares.toFixed(4)),
    populationVariance: Number(populationVariance.toFixed(4)),
    populationSD: Number(populationSD.toFixed(4)),
    sampleVariance: sampleVariance !== null ? Number(sampleVariance.toFixed(4)) : null,
    sampleSD: sampleSD !== null ? Number(sampleSD.toFixed(4)) : null,
    q1: Number(q1.toFixed(4)),
    q3: Number(q3.toFixed(4)),
    iqr: Number(iqr.toFixed(4)),
    percentiles: {
      p10: Number(p10.toFixed(4)),
      p25: Number(p25.toFixed(4)),
      p50: Number(p50.toFixed(4)),
      p75: Number(p75.toFixed(4)),
      p90: Number(p90.toFixed(4))
    },
    boxPlot: {
      min,
      q1,
      median,
      q3,
      max,
      lowerWhisker,
      upperWhisker,
      outliers
    },
    skewnessLabel,
    frequencyDistribution,
    deviations,
    explanations,
    sortedValues: sorted
  };
}
