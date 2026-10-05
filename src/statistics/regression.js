/**
 * INSIGHTX — Module X: Simple Linear Regression Analysis Engine
 * Pure mathematical implementation of Ordinary Least Squares (OLS) bivariate regression.
 *
 * Implements:
 * - Parameter estimation: Slope (b₁) and Intercept (b₀)
 * - Least-squares fitted values: ŷᵢ = b₀ + b₁xᵢ
 * - Residual calculations: eᵢ = yᵢ - ŷᵢ
 * - Sums of Squares ANOVA partitioning: SST = SSR + SSE
 * - Goodness of fit: R², Adjusted R²
 * - Error metrics: MSE, RMSE, MAE, Residual Mean, Residual Sum
 * - Sampling error: Standard Error of Slope SE(b₁) and Intercept SE(b₀)
 * - Arbitrary point prediction: ŷ(x)
 * - Step-by-step mathematical substitution & educational derivations
 *
 * Strict mathematical safeguards against division by zero, constant variance,
 * and NaN/Infinity artifacts.
 */

import { extractValidPairs } from './correlation.js';

/**
 * Master Linear Regression Analysis Routine
 * @param {Array<number|string|null>} rawX - Predictor variable values
 * @param {Array<number|string|null>} rawY - Response variable values
 * @param {string} xName - Predictor label
 * @param {string} yName - Response label
 * @returns {object} Full regression analysis diagnostics and derivations
 */
export function calculateRegression(rawX, rawY, xName = 'X', yName = 'Y') {
  const { validPairs, excludedCount, totalCount } = extractValidPairs(rawX, rawY);
  const n = validPairs.length;

  // 1. Guard against insufficient observations
  if (n < 2) {
    return {
      hasData: false,
      n,
      excludedCount,
      totalCount,
      xName,
      yName,
      reason: n === 0
        ? 'No valid paired observations found in selected variables.'
        : 'At least 2 valid paired observations are required to fit a linear regression model.',
      slope: null,
      intercept: null,
      rSquared: null,
      adjRSquared: null,
      rmse: null,
      mae: null,
      equation: 'Undefined (n < 2)'
    };
  }

  // 2. Compute Arithmetic Means
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += validPairs[i].x;
    sumY += validPairs[i].y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  // 3. Deviations, Sum of Squares & Cross Products
  let sumDevXSquared = 0; // SS_x = sum((x_i - meanX)^2)
  let sumDevYSquared = 0; // SST  = sum((y_i - meanY)^2)
  let sumCrossProducts = 0; // SP_xy = sum((x_i - meanX) * (y_i - meanY))

  for (let i = 0; i < n; i++) {
    const devX = validPairs[i].x - meanX;
    const devY = validPairs[i].y - meanY;
    sumDevXSquared += devX * devX;
    sumDevYSquared += devY * devY;
    sumCrossProducts += devX * devY;
  }

  // Clean micro floating point artifacts
  if (Math.abs(sumCrossProducts) < 1e-12) sumCrossProducts = 0;
  if (sumDevXSquared < 1e-12) sumDevXSquared = 0;
  if (sumDevYSquared < 1e-12) sumDevYSquared = 0;

  const isXConstant = sumDevXSquared === 0;
  const isYConstant = sumDevYSquared === 0;

  // 4. Edge Case: Constant Predictor (X has zero variance)
  // Slope b1 = SP_xy / 0 is mathematically undefined (vertical line)
  if (isXConstant) {
    return {
      hasData: true,
      n,
      excludedCount,
      totalCount,
      xName,
      yName,
      meanX: Number(meanX.toFixed(4)),
      meanY: Number(meanY.toFixed(4)),
      sumDevXSquared: 0,
      sumDevYSquared: Number(sumDevYSquared.toFixed(4)),
      sumCrossProducts: 0,
      isXConstant: true,
      isYConstant,
      isUndefined: true,
      slope: null,
      intercept: null,
      equation: `Undefined (x = ${meanX.toFixed(4)} has zero variance)`,
      rSquared: null,
      adjRSquared: null,
      sse: null,
      sst: Number(sumDevYSquared.toFixed(4)),
      ssr: null,
      mse: null,
      rmse: null,
      mae: null,
      seSlope: null,
      seIntercept: null,
      residualMean: null,
      residualSum: null,
      reason: `Predictor variable "${xName}" is constant across all observations (${meanX}). Slope b₁ is mathematically undefined because denominator SS_x is zero.`,
      rows: validPairs.map((p) => ({
        originalIndex: p.originalIndex,
        x: p.x,
        y: p.y,
        yHat: null,
        residual: null,
        residualSquared: null
      })),
      predict: () => null,
      explanations: {
        slope: {
          formula: 'b_1 = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2}',
          substitution: 'b_1 = \\frac{0}{0} = \\text{Undefined}',
          result: 'Undefined',
          step: `Denominator SS_x = 0 because variable "${xName}" has identical values across all rows.`
        },
        intercept: {
          formula: 'b_0 = \\bar{y} - b_1 \\bar{x}',
          substitution: 'b_0 = \\text{Undefined}',
          result: 'Undefined',
          step: 'Cannot estimate intercept when slope b₁ is undefined.'
        }
      }
    };
  }

  // 5. Ordinary Least Squares Parameter Estimates
  // b1 = sum((x_i - meanX)(y_i - meanY)) / sum((x_i - meanX)^2)
  const slope = sumCrossProducts / sumDevXSquared;
  // b0 = meanY - b1 * meanX
  const intercept = meanY - slope * meanX;

  // 6. Fitted Values (ŷᵢ) and Residuals (eᵢ = yᵢ - ŷᵢ)
  const rows = [];
  let sse = 0; // Sum of squared errors: sum(e_i^2)
  let sumAbsResiduals = 0; // sum(|e_i|)
  let sumResiduals = 0; // sum(e_i)
  let ssr = 0; // Regression sum of squares: sum((yHat_i - meanY)^2)

  for (let i = 0; i < n; i++) {
    const xVal = validPairs[i].x;
    const yVal = validPairs[i].y;
    const yHat = intercept + slope * xVal;
    const residual = yVal - yHat;
    const residualSquared = residual * residual;
    const absResidual = Math.abs(residual);

    sse += residualSquared;
    sumAbsResiduals += absResidual;
    sumResiduals += residual;

    const devYHat = yHat - meanY;
    ssr += devYHat * devYHat;

    rows.push({
      originalIndex: validPairs[i].originalIndex,
      x: xVal,
      y: yVal,
      yHat: Number(yHat.toFixed(6)),
      residual: Number(residual.toFixed(6)),
      residualSquared: Number(residualSquared.toFixed(6)),
      absResidual: Number(absResidual.toFixed(6))
    });
  }

  // Clean rounding near exact zero
  if (sse < 1e-12) sse = 0;
  if (Math.abs(sumResiduals) < 1e-12) sumResiduals = 0;
  if (sumAbsResiduals < 1e-12) sumAbsResiduals = 0;
  if (ssr < 1e-12) ssr = 0;

  const sst = sumDevYSquared;

  // 7. Error Metrics
  const mse = sse / n;
  const rmse = Math.sqrt(mse);
  const mae = sumAbsResiduals / n;
  const residualMean = sumResiduals / n;

  // 8. Coefficient of Determination (R²) and Adjusted R²
  // R² = 1 - SSE / SST
  let rSquared = null;
  let adjRSquared = null;

  if (isYConstant) {
    // When Y is constant, SST = 0. There is no variance in Y to explain.
    // Ratio 0 / 0 is mathematically indeterminate.
    rSquared = null;
    adjRSquared = null;
  } else if (sst > 0) {
    let rawR2 = 1 - (sse / sst);
    // Guarantee bounds [0, 1] for OLS with intercept
    rawR2 = Math.max(0, Math.min(1, rawR2));
    rSquared = Number(rawR2.toFixed(6));

    if (n > 2) {
      const rawAdjR2 = 1 - ((1 - rawR2) * (n - 1) / (n - 2));
      adjRSquared = Number(rawAdjR2.toFixed(6));
    }
  }

  // 9. Standard Errors of Slope and Intercept
  // Unbiased residual variance s_e^2 = SSE / (n - 2) for n > 2
  let seSlope = null;
  let seIntercept = null;
  let tSlope = null;
  let tIntercept = null;

  if (n > 2) {
    const s_e_squared = sse / (n - 2);
    const s_e = Math.sqrt(s_e_squared);

    if (sumDevXSquared > 0) {
      seSlope = s_e / Math.sqrt(sumDevXSquared);
      seIntercept = s_e * Math.sqrt((1 / n) + ((meanX * meanX) / sumDevXSquared));

      if (seSlope > 0) {
        tSlope = slope / seSlope;
      }
      if (seIntercept > 0) {
        tIntercept = intercept / seIntercept;
      }
    }
  }

  // 10. Formatted Regression Equation String
  // Format: ŷ = b₀ + b₁x
  const formatNum = (val) => {
    if (Math.abs(val) < 1e-12) return '0.0000';
    return val.toFixed(4);
  };

  const signB1 = slope >= 0 ? '+' : '-';
  const absB1 = Math.abs(slope);
  const equation = `ŷ = ${formatNum(intercept)} ${signB1} ${formatNum(absB1)}x`;

  // 11. Point Prediction Helper Function
  const predict = (xInput) => {
    if (xInput === null || xInput === undefined || xInput === '') return null;
    const num = Number(xInput);
    if (!Number.isFinite(num)) return null;
    return Number((intercept + slope * num).toFixed(6));
  };

  // 12. Step-by-Step Educational Derivations
  const explanations = {
    meanX: Number(meanX.toFixed(4)),
    meanY: Number(meanY.toFixed(4)),
    sumDevXSquared: Number(sumDevXSquared.toFixed(4)),
    sumDevYSquared: Number(sumDevYSquared.toFixed(4)),
    sumCrossProducts: Number(sumCrossProducts.toFixed(4)),
    sse: Number(sse.toFixed(4)),
    sst: Number(sst.toFixed(4)),
    ssr: Number(ssr.toFixed(4)),
    mse: Number(mse.toFixed(4)),
    rmse: Number(rmse.toFixed(4)),
    mae: Number(mae.toFixed(4)),
    residualSum: Number(sumResiduals.toFixed(6)),
    residualMean: Number(residualMean.toFixed(6)),
    slope: {
      conceptName: 'Ordinary Least Squares Slope (b₁)',
      definition: 'The marginal rate of change in response Y associated with a unit increase in predictor X, minimizing sum of squared vertical residuals.',
      formula: 'b_1 = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2} = \\frac{SP_{xy}}{SS_x}',
      symbols: [
        { symbol: 'b_1', meaning: 'OLS regression slope coefficient' },
        { symbol: 'SP_{xy}', meaning: 'Sum of cross-products of deviations' },
        { symbol: 'SS_x', meaning: 'Sum of squared deviations of predictor X' }
      ],
      substitution: `b_1 = \\frac{${sumCrossProducts.toFixed(4)}}{${sumDevXSquared.toFixed(4)}} = ${slope.toFixed(4)}`,
      result: Number(slope.toFixed(4)),
      step: `Cross-product sum SP_{xy} = ${sumCrossProducts.toFixed(4)} divided by predictor squared deviations SS_x = ${sumDevXSquared.toFixed(4)}.`,
      steps: [
        `Compute centered deviations (x_i - \\bar{x}) and (y_i - \\bar{y}) for all observations.`,
        `Calculate cross-product sum: SP_{xy} = ${sumCrossProducts.toFixed(4)}.`,
        `Calculate predictor sum of squares: SS_x = ${sumDevXSquared.toFixed(4)}.`,
        `Divide cross-products by SS_x: b_1 = \\frac{${sumCrossProducts.toFixed(4)}}{${sumDevXSquared.toFixed(4)}} = ${slope.toFixed(4)}.`
      ],
      interpretation: `For every 1-unit increase in ${xName}, ${yName} is predicted to change by ${slope.toFixed(4)} units.`
    },
    intercept: {
      conceptName: 'Regression Intercept (b₀)',
      definition: 'The expected baseline value of response Y when the predictor variable X equals zero.',
      formula: 'b_0 = \\bar{y} - b_1 \\bar{x}',
      symbols: [
        { symbol: 'b_0', meaning: 'OLS regression intercept (constant)' },
        { symbol: '\\bar{y}', meaning: 'Sample mean of response Y' },
        { symbol: 'b_1', meaning: 'OLS slope' },
        { symbol: '\\bar{x}', meaning: 'Sample mean of predictor X' }
      ],
      substitution: `b_0 = ${meanY.toFixed(4)} - (${slope.toFixed(4)} \\times ${meanX.toFixed(4)}) = ${intercept.toFixed(4)}`,
      result: Number(intercept.toFixed(4)),
      step: `Response mean ${meanY.toFixed(4)} minus product of slope (${slope.toFixed(4)}) and predictor mean (${meanX.toFixed(4)}).`,
      steps: [
        `Obtain response mean \\bar{y} = ${meanY.toFixed(4)} and predictor mean \\bar{x} = ${meanX.toFixed(4)}.`,
        `Multiply slope by predictor mean: b_1 \\bar{x} = ${slope.toFixed(4)} \\times ${meanX.toFixed(4)} = ${(slope * meanX).toFixed(4)}.`,
        `Subtract from response mean: b_0 = ${meanY.toFixed(4)} - ${(slope * meanX).toFixed(4)} = ${intercept.toFixed(4)}.`
      ],
      interpretation: `When ${xName} is 0, the expected baseline value of ${yName} is ${intercept.toFixed(4)}.`
    },
    equation: {
      conceptName: 'Fitted Regression Line Model',
      definition: 'The deterministic least-squares prediction line mapping predictor X to expected response Y.',
      formula: '\\hat{y} = b_0 + b_1 x',
      symbols: [
        { symbol: '\\hat{y}', meaning: 'Fitted / predicted response value' },
        { symbol: 'b_0', meaning: 'Regression intercept' },
        { symbol: 'b_1', meaning: 'Regression slope' },
        { symbol: 'x', meaning: 'Given predictor value' }
      ],
      result: equation,
      step: `Each unit increment in ${xName} is associated with an expected change of ${slope.toFixed(4)} units in ${yName}.`,
      steps: [
        `Substitute computed intercept b_0 = ${intercept.toFixed(4)}.`,
        `Substitute computed slope b_1 = ${slope.toFixed(4)}.`,
        `Formulate mathematical model: ${equation}.`
      ],
      interpretation: `The linear OLS model is ${equation}.`
    },
    rSquared: {
      conceptName: 'Coefficient of Determination (R²)',
      definition: 'The proportion of total sum of squares in response Y explained by the linear regression model.',
      formula: 'R^2 = 1 - \\frac{SSE}{SST} = \\frac{SSR}{SST}',
      symbols: [
        { symbol: 'R^2', meaning: 'Coefficient of determination' },
        { symbol: 'SSE', meaning: 'Sum of squared errors (unexplained)' },
        { symbol: 'SST', meaning: 'Total sum of squares (total variation)' }
      ],
      substitution: sst > 0
        ? `R^2 = 1 - \\frac{${sse.toFixed(4)}}{${sst.toFixed(4)}} = ${rSquared.toFixed(4)}`
        : 'R^2 is mathematically indeterminate (SST = 0 because Y has zero variance)',
      result: rSquared !== null ? Number(rSquared.toFixed(4)) : 'Undefined',
      pctExplained: rSquared !== null ? `${(rSquared * 100).toFixed(2)}%` : 'N/A',
      step: rSquared !== null
        ? `The linear model accounts for ${(rSquared * 100).toFixed(2)}% of the total variance in ${yName}.`
        : 'Response variable is constant; total variation is 0.',
      steps: [
        `Total variation in Y: SST = ${sst.toFixed(4)}.`,
        `Unexplained variation: SSE = ${sse.toFixed(4)}.`,
        `Calculate R^2 = 1 - (${sse.toFixed(4)} / ${sst.toFixed(4)}) = ${rSquared !== null ? rSquared.toFixed(4) : 'Undefined'} (${(rSquared * 100).toFixed(2)}%).`
      ],
      interpretation: rSquared !== null
        ? `The fitted linear model explains ${(rSquared * 100).toFixed(2)}% of the observed variability in ${yName}.`
        : 'Indeterminate.'
    },
    adjRSquared: {
      conceptName: 'Adjusted Coefficient of Determination (R²_adj)',
      definition: 'Penalizes R² for model degrees of freedom, preventing artificial inflation from redundant parameters.',
      formula: 'R^2_{adj} = 1 - \\frac{(1 - R^2)(n - 1)}{n - p - 1} = 1 - \\frac{(1 - R^2)(n - 1)}{n - 2}',
      symbols: [
        { symbol: 'R^2_{adj}', meaning: 'Adjusted R-squared' },
        { symbol: 'n - 1', meaning: 'Total sample degrees of freedom' },
        { symbol: 'n - 2', meaning: 'Residual degrees of freedom' }
      ],
      substitution: adjRSquared !== null
        ? `R^2_{adj} = 1 - \\frac{(1 - ${rSquared.toFixed(4)})(${n} - 1)}{${n} - 2} = ${adjRSquared.toFixed(4)}`
        : 'Requires n > 2 and valid R²',
      result: adjRSquared !== null ? Number(adjRSquared.toFixed(4)) : 'N/A',
      steps: [
        `Adjust R^2 for degrees of freedom: n = ${n}, p = 1 predictor.`,
        adjRSquared !== null
          ? `Evaluate formula: R^2_{adj} = ${adjRSquared.toFixed(4)}.`
          : 'Requires n > 2.'
      ],
      interpretation: adjRSquared !== null
        ? `Degrees-of-freedom adjusted explanatory power is ${(adjRSquared * 100).toFixed(2)}%.`
        : 'N/A'
    },
    rmse: {
      conceptName: 'Standard Error of Regression / RMSE',
      definition: 'The estimated standard deviation of the error term, measuring typical scatter distance of points around the fitted line.',
      formula: 'RMSE = \\sqrt{\\frac{1}{n}\\sum_{i=1}^n e_i^2} = \\sqrt{MSE}',
      symbols: [
        { symbol: 'RMSE', meaning: 'Root Mean Squared Error' },
        { symbol: 'e_i', meaning: 'Residual error (y_i - \\hat{y}_i)' },
        { symbol: 'MSE', meaning: 'Mean squared error' }
      ],
      substitution: `RMSE = \\sqrt{\\frac{${sse.toFixed(4)}}{${n}}} = \\sqrt{${mse.toFixed(4)}} = ${rmse.toFixed(4)}`,
      result: Number(rmse.toFixed(4)),
      step: `Typical standard error distance between observed ${yName} values and regression hyperplane.`,
      steps: [
        `Sum squared residuals: SSE = ${sse.toFixed(4)}.`,
        `Calculate mean squared error: MSE = ${sse.toFixed(4)} / ${n} = ${mse.toFixed(4)}.`,
        `Take square root: RMSE = \\sqrt{${mse.toFixed(4)}} = ${rmse.toFixed(4)}.`
      ],
      interpretation: `Observations deviate from the fitted regression line by an average distance of ±${rmse.toFixed(4)} units.`
    },
    mae: {
      conceptName: 'Mean Absolute Error (MAE)',
      definition: 'The average absolute magnitude of vertical prediction errors, robust to large single residuals.',
      formula: 'MAE = \\frac{1}{n}\\sum_{i=1}^n |e_i|',
      symbols: [
        { symbol: 'MAE', meaning: 'Mean absolute error' },
        { symbol: '|e_i|', meaning: 'Absolute residual distance' }
      ],
      substitution: `MAE = \\frac{${sumAbsResiduals.toFixed(4)}}{${n}} = ${mae.toFixed(4)}`,
      result: Number(mae.toFixed(4)),
      step: `Mean absolute magnitude of prediction errors.`,
      steps: [
        `Sum absolute residuals: \\sum |e_i| = ${sumAbsResiduals.toFixed(4)}.`,
        `Divide by observation count: MAE = ${sumAbsResiduals.toFixed(4)} / ${n} = ${mae.toFixed(4)}.`
      ],
      interpretation: `The average linear prediction error is ${mae.toFixed(4)} units in magnitude.`
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
    sumDevXSquared: Number(sumDevXSquared.toFixed(4)),
    sumDevYSquared: Number(sumDevYSquared.toFixed(4)),
    sumCrossProducts: Number(sumCrossProducts.toFixed(4)),
    slope: Number(slope.toFixed(6)),
    intercept: Number(intercept.toFixed(6)),
    equation,
    rSquared,
    adjRSquared,
    sse: Number(sse.toFixed(6)),
    sst: Number(sst.toFixed(6)),
    ssr: Number(ssr.toFixed(6)),
    mse: Number(mse.toFixed(6)),
    rmse: Number(rmse.toFixed(6)),
    mae: Number(mae.toFixed(6)),
    residualSum: Number(sumResiduals.toFixed(6)),
    residualMean: Number(residualMean.toFixed(6)),
    seSlope: seSlope !== null ? Number(seSlope.toFixed(6)) : null,
    seIntercept: seIntercept !== null ? Number(seIntercept.toFixed(6)) : null,
    tSlope: tSlope !== null ? Number(tSlope.toFixed(4)) : null,
    tIntercept: tIntercept !== null ? Number(tIntercept.toFixed(4)) : null,
    isXConstant: false,
    isYConstant,
    isUndefined: false,
    rows,
    predict,
    explanations
  };
}
