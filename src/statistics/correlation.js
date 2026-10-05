/**
 * INSIGHTX — Module IX: Bivariate Correlation Analysis Engine
 *
 * Implements mathematically rigorous bivariate statistics:
 * - Pairwise-complete observations filter
 * - Mean of X and Y
 * - Deviations and Cross-products sum (SP_xy)
 * - Sample Covariance (n - 1) and Population Covariance (n)
 * - Pearson Product-Moment Correlation (r)
 * - Spearman Rank Correlation (rho) with fractional average ranks for ties
 * - Coefficient of Determination (r^2)
 * - Direction, Strength, and Causation warnings
 * - Exact handling of constant variables, zero variance, and small sample sizes (undefined states)
 */

import { isValueMissing } from '../utils/dataParser.js';

/**
 * Filters paired observations, ensuring both X and Y are valid finite numbers.
 * Accurately preserves 0 and 0.0.
 */
export function extractValidPairs(rawX, rawY) {
  if (!rawX || !rawY || !Array.isArray(rawX) || !Array.isArray(rawY)) {
    return {
      validPairs: [],
      excludedCount: 0,
      totalCount: 0
    };
  }

  const length = Math.min(rawX.length, rawY.length);
  const validPairs = [];
  let excludedCount = 0;

  for (let i = 0; i < length; i++) {
    const xVal = rawX[i];
    const yVal = rawY[i];

    if (isValueMissing(xVal) || isValueMissing(yVal)) {
      excludedCount++;
      continue;
    }

    const numX = typeof xVal === 'number' ? xVal : Number(String(xVal).trim());
    const numY = typeof yVal === 'number' ? yVal : Number(String(yVal).trim());

    if (!isNaN(numX) && isFinite(numX) && !isNaN(numY) && isFinite(numY)) {
      validPairs.push({
        index: i + 1,
        x: numX,
        y: numY
      });
    } else {
      excludedCount++;
    }
  }

  return {
    validPairs,
    excludedCount,
    totalCount: length
  };
}

/**
 * Assigns fractional average ranks to values, resolving ties cleanly.
 * e.g. [10, 20, 20, 30] -> [1, 2.5, 2.5, 4]
 */
export function computeRanks(values) {
  const n = values.length;
  if (n === 0) return [];

  // Pair each value with its original index
  const indexed = values.map((val, idx) => ({ val, idx }));
  indexed.sort((a, b) => a.val - b.val);

  const ranks = new Array(n);
  let i = 0;

  while (i < n) {
    let j = i;
    // Find extent of tie block
    while (j < n - 1 && indexed[j + 1].val === indexed[j].val) {
      j++;
    }

    // Average 1-based rank: ( (i+1) + (j+1) ) / 2
    const averageRank = (i + 1 + j + 1) / 2;
    for (let k = i; k <= j; k++) {
      ranks[indexed[k].idx] = averageRank;
    }

    i = j + 1;
  }

  return ranks;
}

/**
 * Classifies Pearson correlation magnitude and direction
 */
export function interpretCorrelation(r) {
  if (r === null || r === undefined || isNaN(r)) {
    return {
      strength: 'Undefined',
      direction: 'Undefined',
      summary: 'Correlation is mathematically undefined (e.g. constant variable with zero variance).',
      color: '#64748b'
    };
  }

  const absR = Math.abs(r);
  let strength = '';
  let color = '#a855f7';

  if (absR >= 0.80) {
    strength = 'Very Strong';
    color = '#10b981';
  } else if (absR >= 0.60) {
    strength = 'Strong';
    color = '#06b6d4';
  } else if (absR >= 0.40) {
    strength = 'Moderate';
    color = '#a855f7';
  } else if (absR >= 0.20) {
    strength = 'Weak';
    color = '#f59e0b';
  } else {
    strength = 'Very Weak / Negligible';
    color = '#64748b';
  }

  let direction = 'Zero';
  if (r > 1e-7) {
    direction = 'Positive (Direct)';
  } else if (r < -1e-7) {
    direction = 'Negative (Inverse)';
  } else {
    direction = 'None (Zero Linear Association)';
  }

  const summary = r === 0 || Math.abs(r) < 1e-7
    ? 'No linear association between X and Y.'
    : `${strength} ${direction} linear relationship. ${absR >= 0.6 ? 'Values covary tightly along a linear vector.' : 'Values exhibit noticeable dispersion.'}`;

  return {
    strength,
    direction,
    summary,
    color,
    causationNotice: 'Important: Correlation measures linear co-variation, NOT causal connection.'
  };
}

/**
 * Master Bivariate Correlation Analysis Routine
 */
export function calculateCorrelation(rawX, rawY, xName = 'X', yName = 'Y') {
  const { validPairs, excludedCount, totalCount } = extractValidPairs(rawX, rawY);
  const n = validPairs.length;

  if (n < 2) {
    return {
      hasData: false,
      n,
      excludedCount,
      totalCount,
      xName,
      yName,
      error: n === 0
        ? 'No valid paired numeric observations found.'
        : 'At least 2 complete pairs are required to compute bivariate covariance and correlation.'
    };
  }

  const xVals = validPairs.map(p => p.x);
  const yVals = validPairs.map(p => p.y);

  // 1. Means
  const sumX = xVals.reduce((acc, v) => acc + v, 0);
  const sumY = yVals.reduce((acc, v) => acc + v, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  // 2. Deviations and Cross-Products
  let sumDevXSquared = 0;
  let sumDevYSquared = 0;
  let sumCrossProducts = 0;

  // Paired records with mathematical details
  const pairedRows = validPairs.map((p, idx) => {
    const devX = p.x - meanX;
    const devY = p.y - meanY;
    const devX2 = devX * devX;
    const devY2 = devY * devY;
    const crossProduct = devX * devY;

    sumDevXSquared += devX2;
    sumDevYSquared += devY2;
    sumCrossProducts += crossProduct;

    return {
      index: p.index || idx + 1,
      x: p.x,
      y: p.y,
      devX,
      devY,
      devX2,
      devY2,
      crossProduct
    };
  });

  // 3. Constant Variable / Zero Variance Check
  const isXConstant = sumDevXSquared === 0;
  const isYConstant = sumDevYSquared === 0;
  const isUndefined = isXConstant || isYConstant;

  // 4. Covariances
  const populationCovariance = sumCrossProducts / n;
  const sampleCovariance = n >= 2 ? sumCrossProducts / (n - 1) : null;

  // 5. Pearson Correlation
  let pearsonR = null;
  let rSquared = null;

  if (!isUndefined) {
    const denom = Math.sqrt(sumDevXSquared * sumDevYSquared);
    if (denom > 0) {
      let rawR = sumCrossProducts / denom;
      // Clamp between -1 and 1 to prevent floating-point anomalies
      rawR = Math.max(-1, Math.min(1, rawR));
      pearsonR = Number(rawR.toFixed(6));
      rSquared = Number((pearsonR * pearsonR).toFixed(6));
    }
  }

  // 6. Spearman Rank Correlation (Pearson r of Average Ranks)
  const ranksX = computeRanks(xVals);
  const ranksY = computeRanks(yVals);

  // Check if ranks have zero variance (all identical raw values)
  let spearmanRho = null;
  if (!isUndefined) {
    const meanRankX = ranksX.reduce((acc, v) => acc + v, 0) / n;
    const meanRankY = ranksY.reduce((acc, v) => acc + v, 0) / n;

    let ssRankX = 0;
    let ssRankY = 0;
    let spRankXY = 0;

    for (let i = 0; i < n; i++) {
      const dRx = ranksX[i] - meanRankX;
      const dRy = ranksY[i] - meanRankY;
      ssRankX += dRx * dRx;
      ssRankY += dRy * dRy;
      spRankXY += dRx * dRy;

      // Append ranks and d_i to pairedRows for inspection
      pairedRows[i].rankX = ranksX[i];
      pairedRows[i].rankY = ranksY[i];
      pairedRows[i].rankDiff = ranksX[i] - ranksY[i];
      pairedRows[i].rankDiffSquared = (ranksX[i] - ranksY[i]) * (ranksX[i] - ranksY[i]);
    }

    const rankDenom = Math.sqrt(ssRankX * ssRankY);
    if (rankDenom > 0) {
      let rawRho = spRankXY / rankDenom;
      rawRho = Math.max(-1, Math.min(1, rawRho));
      spearmanRho = Number(rawRho.toFixed(6));
    }
  } else {
    for (let i = 0; i < n; i++) {
      pairedRows[i].rankX = ranksX[i];
      pairedRows[i].rankY = ranksY[i];
      pairedRows[i].rankDiff = ranksX[i] - ranksY[i];
      pairedRows[i].rankDiffSquared = 0;
    }
  }

  // 7. Visual Trendline (OLS Reference: y = mx + c)
  let visualTrendline = null;
  if (!isXConstant && sumDevXSquared > 0) {
    const slope = sumCrossProducts / sumDevXSquared;
    const intercept = meanY - slope * meanX;
    visualTrendline = {
      slope: Number(slope.toFixed(4)),
      intercept: Number(intercept.toFixed(4)),
      formula: `y = ${slope.toFixed(4)}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept).toFixed(4)}`
    };
  }

  // 8. Plain Language Interpretation
  const interpretation = interpretCorrelation(pearsonR);

  // 9. Step-by-Step Educational Derivations
  const explanations = {
    meanX: Number(meanX.toFixed(4)),
    meanY: Number(meanY.toFixed(4)),
    sumCrossProducts: Number(sumCrossProducts.toFixed(4)),
    sumDevXSquared: Number(sumDevXSquared.toFixed(4)),
    sumDevYSquared: Number(sumDevYSquared.toFixed(4)),
    pearson: {
      conceptName: 'Pearson Product-Moment Correlation (r)',
      definition: 'Measures the strength and direction of the linear association between two continuous variables, bounded strictly between -1 and +1.',
      formula: 'r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\cdot \\sum (y_i - \\bar{y})^2}} = \\frac{SP_{xy}}{\\sqrt{SS_x \\cdot SS_y}}',
      symbols: [
        { symbol: 'r', meaning: 'Pearson linear correlation coefficient' },
        { symbol: 'SP_{xy}', meaning: 'Sum of cross-products of deviations' },
        { symbol: 'SS_x', meaning: 'Sum of squared deviations of predictor X' },
        { symbol: 'SS_y', meaning: 'Sum of squared deviations of response Y' }
      ],
      substitution: !isUndefined
        ? `r = \\frac{${sumCrossProducts.toFixed(4)}}{\\sqrt{${sumDevXSquared.toFixed(4)} \\times ${sumDevYSquared.toFixed(4)}}} = \\frac{${sumCrossProducts.toFixed(4)}}{${Math.sqrt(sumDevXSquared * sumDevYSquared).toFixed(4)}} = ${pearsonR !== null ? pearsonR.toFixed(4) : 'Undefined'}`
        : 'Undefined (Zero Variance)',
      step: !isUndefined
        ? `Cross-product sum SP_{xy} = ${sumCrossProducts.toFixed(4)}. Divided by geometric mean of squared deviations:`
        : `Variable ${isXConstant ? xName : yName} is constant across all rows, producing zero variance in denominator.`,
      steps: [
        `Compute centered deviations (x_i - \\bar{x}) and (y_i - \\bar{y}) for all n = ${n} paired records.`,
        `Calculate sum of cross-products: SP_{xy} = \\sum (x_i - \\bar{x})(y_i - \\bar{y}) = ${sumCrossProducts.toFixed(4)}.`,
        `Calculate sum of squared deviations: SS_x = ${sumDevXSquared.toFixed(4)} and SS_y = ${sumDevYSquared.toFixed(4)}.`,
        !isUndefined
          ? `Evaluate normalized ratio: r = \\frac{${sumCrossProducts.toFixed(4)}}{\\sqrt{${sumDevXSquared.toFixed(4)} \\times ${sumDevYSquared.toFixed(4)}}} = ${pearsonR !== null ? pearsonR.toFixed(4) : 'Undefined'}.`
          : 'Zero variance in denominator prevents normalization.'
      ],
      result: pearsonR !== null ? pearsonR.toFixed(4) : 'Undefined',
      interpretation: interpretation.summary
    },
    sampleCovariance: {
      conceptName: 'Sample Covariance (Bessel-Corrected)',
      definition: 'Measures the joint directional variability of two continuous random variables using degrees of freedom (n - 1).',
      formula: 'Cov_{sample}(X, Y) = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{n - 1}',
      symbols: [
        { symbol: 'Cov_{sample}', meaning: 'Sample covariance' },
        { symbol: 'SP_{xy}', meaning: 'Sum of cross-products of deviations' },
        { symbol: 'n - 1', meaning: 'Sample degrees of freedom' }
      ],
      substitution: sampleCovariance !== null
        ? `Cov_{sample} = \\frac{${sumCrossProducts.toFixed(4)}}{${n} - 1} = \\frac{${sumCrossProducts.toFixed(4)}}{${n - 1}} = ${sampleCovariance.toFixed(4)}`
        : 'Undefined (n < 2)',
      step: sampleCovariance !== null
        ? `Sum of cross-products ${sumCrossProducts.toFixed(4)} divided by (n - 1 = ${n - 1}):`
        : 'Requires at least 2 pairs to compute sample covariance.',
      steps: [
        `Sum deviation cross-products: SP_{xy} = ${sumCrossProducts.toFixed(4)}.`,
        sampleCovariance !== null
          ? `Divide by sample degrees of freedom (n - 1 = ${n - 1}): Cov_{sample} = \\frac{${sumCrossProducts.toFixed(4)}}{${n - 1}} = ${sampleCovariance.toFixed(4)}.`
          : 'Sample size n < 2.'
      ],
      result: sampleCovariance !== null ? sampleCovariance.toFixed(4) : 'N/A',
      interpretation: sampleCovariance !== null && sampleCovariance > 0
        ? 'Positive covariance indicates variables tend to vary in the same direction.'
        : (sampleCovariance !== null && sampleCovariance < 0
          ? 'Negative covariance indicates variables tend to vary in opposite directions.'
          : 'Zero or undefined covariance.')
    },
    populationCovariance: {
      conceptName: 'Population Covariance (Cov_pop)',
      definition: 'The average product of deviations from the true means across the entire population N.',
      formula: 'Cov_{pop}(X, Y) = \\frac{\\sum (x_i - \\mu_x)(y_i - \\mu_y)}{n}',
      symbols: [
        { symbol: 'Cov_{pop}', meaning: 'Population covariance' },
        { symbol: 'n', meaning: 'Total number of paired observations' }
      ],
      substitution: `Cov_{pop} = \\frac{${sumCrossProducts.toFixed(4)}}{${n}} = ${populationCovariance.toFixed(4)}`,
      step: `Sum of cross-products divided by population size N = ${n}:`,
      steps: [
        `Sum deviation cross-products: SP_{xy} = ${sumCrossProducts.toFixed(4)}.`,
        `Divide by N = ${n}: Cov_{pop} = \\frac{${sumCrossProducts.toFixed(4)}}{${n}} = ${populationCovariance.toFixed(4)}.`
      ],
      result: populationCovariance.toFixed(4),
      interpretation: `Parametric population covariance is ${populationCovariance.toFixed(4)}.`
    },
    rSquared: {
      conceptName: 'Coefficient of Determination (R²)',
      definition: 'The proportion of the total variation in response Y that is linearly explained or accounted for by predictor X.',
      formula: 'r^2 = (r)^2',
      symbols: [
        { symbol: 'r^2', meaning: 'Coefficient of determination' },
        { symbol: 'r', meaning: 'Pearson correlation coefficient' }
      ],
      substitution: pearsonR !== null ? `r^2 = (${pearsonR.toFixed(4)})^2 = ${rSquared.toFixed(4)}` : 'Undefined',
      step: pearsonR !== null ? `Square the Pearson r value: (${pearsonR.toFixed(4)})^2:` : 'Indeterminate for undefined r.',
      steps: [
        `Retrieve Pearson correlation: r = ${pearsonR !== null ? pearsonR.toFixed(4) : 'Undefined'}.`,
        pearsonR !== null
          ? `Square r: r^2 = (${pearsonR.toFixed(4)})^2 = ${rSquared.toFixed(4)} (${(rSquared * 100).toFixed(2)}%).`
          : 'Cannot square undefined correlation.'
      ],
      result: rSquared !== null ? rSquared.toFixed(4) : 'Undefined',
      pctExplained: rSquared !== null ? `${(rSquared * 100).toFixed(2)}%` : '0%',
      interpretation: rSquared !== null
        ? `${(rSquared * 100).toFixed(2)}% of the variance in #${yName} is explained by linear association with #${xName}.`
        : 'Indeterminate.'
    },
    spearman: {
      conceptName: "Spearman's Rank Correlation (ρ)",
      definition: 'A non-parametric metric that assesses monotonic relationships using the ranks of the data rather than raw numerical values.',
      formula: '\\rho = 1 - \\frac{6\\sum d_i^2}{n(n^2 - 1)} \\text{ (or Pearson r of ranks)}',
      symbols: [
        { symbol: '\\rho', meaning: 'Spearman rank correlation coefficient' },
        { symbol: 'R(X), R(Y)', meaning: 'Fractional average ranks of X and Y' },
        { symbol: 'n', meaning: 'Number of ranked pairs' }
      ],
      substitution: spearmanRho !== null ? `\\rho = ${spearmanRho.toFixed(4)}` : 'Undefined',
      step: 'Observations transformed into ordinal fractional average ranks to account for ties, followed by product-moment evaluation.',
      steps: [
        `Rank X values from 1 to ${n}, assigning average fractional ranks to ties.`,
        `Rank Y values from 1 to ${n}, assigning average fractional ranks to ties.`,
        `Compute Pearson product-moment correlation on the rank vectors: \\rho = ${spearmanRho !== null ? spearmanRho.toFixed(4) : 'Undefined'}.`
      ],
      result: spearmanRho !== null ? spearmanRho.toFixed(4) : 'Undefined',
      interpretation: spearmanRho !== null
        ? `Monotonic rank correlation is ${spearmanRho.toFixed(4)}, robust to monotonic non-linear distortions.`
        : 'Undefined.'
    }
  };

  return {
    hasData: true,
    n,
    excludedCount,
    totalCount,
    xName,
    yName,
    meanX: Number(meanX.toFixed(4)),
    meanY: Number(meanY.toFixed(4)),
    sumCrossProducts: Number(sumCrossProducts.toFixed(4)),
    sumDevXSquared: Number(sumDevXSquared.toFixed(4)),
    sumDevYSquared: Number(sumDevYSquared.toFixed(4)),
    populationCovariance: Number(populationCovariance.toFixed(4)),
    sampleCovariance: sampleCovariance !== null ? Number(sampleCovariance.toFixed(4)) : null,
    pearsonR,
    spearmanRho,
    rSquared,
    isUndefined,
    isXConstant,
    isYConstant,
    visualTrendline,
    interpretation,
    explanations,
    pairedRows
  };
}
