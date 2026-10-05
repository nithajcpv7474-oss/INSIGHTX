import React from 'react';
import MathView, { MathText } from './MathView';
import { CheckCircle2, ChevronRight, Layers, Table as TableIcon } from 'lucide-react';

/**
 * Cleanly formats numbers to eliminate floating point noise and handle 0 gracefully.
 */
function formatNum(val, decimals = 4) {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  if (!isFinite(val)) return String(val);
  if (Math.abs(val) < 1e-11) return '0';
  if (Number.isInteger(val)) return String(val);
  const factor = Math.pow(10, decimals);
  const rounded = Math.round((val + Number.EPSILON) * factor) / factor;
  return String(rounded);
}

const stepCardStyle = {
  padding: '1.1rem 1.25rem',
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
};

const stepHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  marginBottom: '0.5rem',
};

const stepTitleStyle = {
  fontSize: '0.9rem',
  color: '#f8fafc',
  fontWeight: 700,
};

const stepDescStyle = {
  fontSize: '0.825rem',
  color: '#cbd5e1',
  lineHeight: 1.5,
  margin: 0,
};

const mathBoxStyle = {
  marginTop: '0.6rem',
  padding: '0.75rem 1rem',
  borderRadius: '6px',
  backgroundColor: 'rgba(10, 14, 26, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  overflowX: 'auto',
};

const paramCardStyle = {
  padding: '0.65rem 0.85rem',
  borderRadius: '6px',
  backgroundColor: 'rgba(10, 14, 26, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
};

const paramLabelStyle = {
  fontSize: '0.7rem',
  color: '#94a3b8',
  textTransform: 'uppercase',
  fontWeight: 700,
};

const paramValueStyle = {
  fontSize: '0.9rem',
  color: '#f8fafc',
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
};

function stepBadgeStyle(color = 'purple') {
  const map = {
    purple: { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.4)' },
    cyan: { bg: 'rgba(6, 182, 212, 0.2)', text: '#22d3ee', border: 'rgba(6, 182, 212, 0.4)' },
    pink: { bg: 'rgba(236, 72, 153, 0.2)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.4)' },
    gold: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
    emerald: { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399', border: 'rgba(16, 185, 129, 0.4)' },
  };
  const c = map[color] || map.purple;
  return {
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    backgroundColor: c.bg,
    color: c.text,
    border: `1px solid ${c.border}`,
    fontSize: '0.72rem',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  };
}

function finalResultCallout(color = 'purple') {
  const map = {
    purple: { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.35)', text: '#f3e8ff' },
    cyan: { bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.35)', text: '#ecfeff' },
    pink: { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.35)', text: '#fdf2f8' },
    gold: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)', text: '#fffbeb' },
    emerald: { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.35)', text: '#ecfdf5' },
  };
  const c = map[color] || map.purple;
  return {
    marginTop: '0.75rem',
    padding: '0.65rem 0.9rem',
    borderRadius: '6px',
    backgroundColor: c.bg,
    border: `1px solid ${c.border}`,
    color: c.text,
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };
}

/**
 * Complete, transparent 10-step mathematical solution component for Simple Linear Regression.
 * Directly fulfills Steps 1 through 10 with active dataset values.
 */
export default function RegressionDerivationContent({ regResults, xName, yName }) {
  if (!regResults || !regResults.hasData) return null;

  const {
    n,
    meanX,
    meanY,
    sumDevXSquared,
    sumCrossProducts,
    slope,
    intercept,
    equation,
    rows = [],
    sse,
    sst,
    ssr,
    mse,
    rmse,
    mae,
    rSquared,
    adjRSquared,
  } = regResults;

  // Selected sample preview rows for Step 7 (first 5, or up to 6 rows)
  const previewRows = rows.slice(0, Math.min(6, rows.length));

  const signB1 = slope >= 0 ? '+' : '-';
  const absB1 = Math.abs(slope);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* STEP 1: Identify Variables */}
      <div className="math-step-card" style={stepCardStyle}>
        <div style={stepHeaderStyle}>
          <span style={stepBadgeStyle('cyan')}>Step 1</span>
          <strong style={stepTitleStyle}>Identify Model Variables</strong>
        </div>
        <p style={stepDescStyle}>
          Designate the predictor (independent variable <MathText text="X" />) and the response (dependent variable <MathText text="Y" />):
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
            marginTop: '0.75rem',
          }}
        >
          <div style={paramCardStyle}>
            <span style={paramLabelStyle}>Predictor / Independent Variable (X)</span>
            <span style={{ ...paramValueStyle, color: '#38bdf8' }}>{xName}</span>
          </div>
          <div style={paramCardStyle}>
            <span style={paramLabelStyle}>Response / Dependent Variable (Y)</span>
            <span style={{ ...paramValueStyle, color: '#f472b6' }}>{yName}</span>
          </div>
        </div>
      </div>

      {/* STEP 2: Number of Valid Observations */}
      <div className="math-step-card" style={stepCardStyle}>
        <div style={stepHeaderStyle}>
          <span style={stepBadgeStyle('purple')}>Step 2</span>
          <strong style={stepTitleStyle}>Count Valid Paired Observations</strong>
        </div>
        <p style={stepDescStyle}>
          Only complete pairs with non-missing, numeric values for both <MathText text="X" /> and <MathText text="Y" /> are included in the Ordinary Least Squares model estimation:
        </p>
        <div style={mathBoxStyle}>
          <MathView math={`n = ${n} \\quad \\text{complete paired observations}`} block />
        </div>
        {regResults.excludedCount > 0 && (
          <p style={{ ...stepDescStyle, marginTop: '0.5rem', color: '#94a3b8' }}>
            Note: {regResults.excludedCount} row(s) containing non-numeric or missing entries were excluded pairwise from the total {regResults.totalCount} records.
          </p>
        )}
      </div>

      {/* STEP 3: Calculate Sample Means */}
      <div className="math-step-card" style={stepCardStyle}>
        <div style={stepHeaderStyle}>
          <span style={stepBadgeStyle('cyan')}>Step 3</span>
          <strong style={stepTitleStyle}>Calculate Sample Means (x̄ and ȳ)</strong>
        </div>
        <p style={stepDescStyle}>
          Evaluate the arithmetic means <MathText text="\bar{x}" /> and <MathText text="\bar{y}" />:
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.75rem',
            marginTop: '0.6rem',
          }}
        >
          <div style={mathBoxStyle}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
              Predictor Mean (x̄)
            </div>
            <MathView math={`\\bar{x} = \\frac{\\sum x_i}{n} = ${formatNum(meanX)}`} block />
          </div>
          <div style={mathBoxStyle}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
              Response Mean (ȳ)
            </div>
            <MathView math={`\\bar{y} = \\frac{\\sum y_i}{n} = ${formatNum(meanY)}`} block />
          </div>
        </div>
      </div>

      {/* STEP 4: Calculate Slope (β₁) */}
      <div className="math-step-card" style={stepCardStyle}>
        <div style={stepHeaderStyle}>
          <span style={stepBadgeStyle('purple')}>Step 4</span>
          <strong style={stepTitleStyle}>Calculate Regression Slope (β₁ / b₁)</strong>
        </div>
        <p style={stepDescStyle}>
          Apply the Ordinary Least Squares formula to determine the slope coefficient <MathText text="\beta_1" /> by dividing the sum of cross-products <MathText text="SP_{xy}" /> by the predictor sum of squares <MathText text="SS_x" />:
        </p>
        <div style={mathBoxStyle}>
          <MathView
            math={`\\beta_1 = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2} = \\frac{SP_{xy}}{SS_x} = \\frac{${formatNum(sumCrossProducts)}}{${formatNum(sumDevXSquared)}} = ${formatNum(slope)}`}
            block
          />
        </div>
        <div style={finalResultCallout('purple')}>
          <CheckCircle2 size={16} color="#c084fc" />
          <span>Fitted Slope: <strong style={{ fontFamily: 'var(--font-mono)' }}>β₁ = {formatNum(slope)}</strong> (Numerator <MathText text="SP_{xy} = " /> {formatNum(sumCrossProducts)}, Denominator <MathText text="SS_x = " /> {formatNum(sumDevXSquared)})</span>
        </div>
      </div>

      {/* STEP 5: Calculate Intercept (β₀) */}
      <div className="math-step-card" style={stepCardStyle}>
        <div style={stepHeaderStyle}>
          <span style={stepBadgeStyle('cyan')}>Step 5</span>
          <strong style={stepTitleStyle}>Calculate Regression Intercept (β₀ / b₀)</strong>
        </div>
        <p style={stepDescStyle}>
          Substitute the response mean <MathText text="\bar{y}" />, slope <MathText text="\beta_1" />, and predictor mean <MathText text="\bar{x}" /> into the intercept formula:
        </p>
        <div style={mathBoxStyle}>
          <MathView
            math={`\\beta_0 = \\bar{y} - \\beta_1 \\bar{x} = ${formatNum(meanY)} - (${formatNum(slope)} \\times ${formatNum(meanX)}) = ${formatNum(intercept)}`}
            block
          />
        </div>
        <div style={finalResultCallout('cyan')}>
          <CheckCircle2 size={16} color="#22d3ee" />
          <span>Fitted Intercept: <strong style={{ fontFamily: 'var(--font-mono)' }}>β₀ = {formatNum(intercept)}</strong></span>
        </div>
      </div>

      {/* STEP 6: Regression Equation */}
      <div className="math-step-card" style={stepCardStyle}>
        <div style={stepHeaderStyle}>
          <span style={stepBadgeStyle('pink')}>Step 6</span>
          <strong style={stepTitleStyle}>Formulate the Fitted Regression Equation</strong>
        </div>
        <p style={stepDescStyle}>
          Combine the calibrated intercept <MathText text="\beta_0" /> and slope <MathText text="\beta_1" /> into the linear model equation:
        </p>
        <div style={mathBoxStyle}>
          <MathView
            math={`\\hat{y} = \\beta_0 + \\beta_1 x = ${formatNum(intercept)} ${signB1} ${formatNum(absB1)}x`}
            block
          />
        </div>
        <div style={finalResultCallout('pink')}>
          <CheckCircle2 size={16} color="#f472b6" />
          <span>Fitted Model: <strong style={{ fontFamily: 'var(--font-mono)' }}>{equation}</strong></span>
        </div>
      </div>

      {/* STEP 7: Predictions & Residuals */}
      <div className="math-step-card" style={stepCardStyle}>
        <div style={stepHeaderStyle}>
          <span style={stepBadgeStyle('emerald')}>Step 7</span>
          <strong style={stepTitleStyle}>Model Predictions & Residual Errors</strong>
        </div>
        <p style={stepDescStyle}>
          Compute fitted values <MathText text="\hat{y}_i = \beta_0 + \beta_1 x_i" /> and individual residuals <MathText text="e_i = y_i - \hat{y}_i" /> across sample observations:
        </p>
        <div style={{ overflowX: 'auto', marginTop: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th style={{ padding: '0.5rem 0.75rem', color: '#94a3b8' }}>Obs #</th>
                <th style={{ padding: '0.5rem 0.75rem', color: '#38bdf8' }}>{xName} (xᵢ)</th>
                <th style={{ padding: '0.5rem 0.75rem', color: '#f472b6' }}>Actual yᵢ</th>
                <th style={{ padding: '0.5rem 0.75rem', color: '#a855f7' }}>Predicted ŷᵢ</th>
                <th style={{ padding: '0.5rem 0.75rem', color: '#fbbf24' }}>Residual eᵢ = yᵢ - ŷᵢ</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((r) => (
                <tr key={r.originalIndex} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.45rem 0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{r.originalIndex}</td>
                  <td style={{ padding: '0.45rem 0.75rem', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{r.x}</td>
                  <td style={{ padding: '0.45rem 0.75rem', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{r.y}</td>
                  <td style={{ padding: '0.45rem 0.75rem', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>{formatNum(r.yHat)}</td>
                  <td
                    style={{
                      padding: '0.45rem 0.75rem',
                      color: r.residual > 0 ? '#34d399' : r.residual < 0 ? '#fbbf24' : '#94a3b8',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {r.residual > 0 ? `+${formatNum(r.residual)}` : formatNum(r.residual)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > previewRows.length && (
          <p style={{ ...stepDescStyle, marginTop: '0.5rem', color: '#94a3b8' }}>
            Showing first {previewRows.length} of {rows.length} observations. See "Observations & Residuals Table" tab for full dataset.
          </p>
        )}
      </div>

      {/* STEP 8: Error Metrics (SSE, SST, SSR, MSE, RMSE, MAE) */}
      <div className="math-step-card" style={stepCardStyle}>
        <div style={stepHeaderStyle}>
          <span style={stepBadgeStyle('gold')}>Step 8</span>
          <strong style={stepTitleStyle}>ANOVA Sums of Squares & Error Metrics</strong>
        </div>
        <p style={stepDescStyle}>
          Partition the total variation in <MathText text="Y" /> into explained and residual components, then compute standard error diagnostics:
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.75rem',
            marginTop: '0.75rem',
          }}
        >
          <div style={paramCardStyle}>
            <span style={paramLabelStyle}>Total Sum of Squares (SST)</span>
            <span style={paramValueStyle}>{formatNum(sst)}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}><MathText text="\sum (y_i - \bar{y})^2" /></span>
          </div>
          <div style={paramCardStyle}>
            <span style={paramLabelStyle}>Sum of Squared Errors (SSE)</span>
            <span style={paramValueStyle}>{formatNum(sse)}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}><MathText text="\sum (y_i - \hat{y}_i)^2" /></span>
          </div>
          <div style={paramCardStyle}>
            <span style={paramLabelStyle}>Regression Sum of Squares (SSR)</span>
            <span style={paramValueStyle}>{formatNum(ssr)}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}><MathText text="\sum (\hat{y}_i - \bar{y})^2" /></span>
          </div>
          <div style={paramCardStyle}>
            <span style={paramLabelStyle}>Mean Squared Error (MSE)</span>
            <span style={paramValueStyle}>{formatNum(mse)}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}><MathText text="MSE = \frac{SSE}{n}" /></span>
          </div>
          <div style={paramCardStyle}>
            <span style={paramLabelStyle}>Root Mean Squared Error (RMSE)</span>
            <span style={paramValueStyle}>{formatNum(rmse)}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}><MathText text="RMSE = \sqrt{MSE}" /></span>
          </div>
          <div style={paramCardStyle}>
            <span style={paramLabelStyle}>Mean Absolute Error (MAE)</span>
            <span style={paramValueStyle}>{formatNum(mae)}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}><MathText text="MAE = \frac{1}{n}\sum |e_i|" /></span>
          </div>
        </div>
      </div>

      {/* STEP 9: Coefficient of Determination (R²) */}
      <div className="math-step-card" style={stepCardStyle}>
        <div style={stepHeaderStyle}>
          <span style={stepBadgeStyle('gold')}>Step 9</span>
          <strong style={stepTitleStyle}>Coefficient of Determination (R² & Adjusted R²)</strong>
        </div>
        <p style={stepDescStyle}>
          Calculate the proportion of total variance in <MathText text="Y" /> explained by the predictor <MathText text="X" />:
        </p>
        <div style={mathBoxStyle}>
          <MathView
            math={`R^2 = 1 - \\frac{SSE}{SST} = 1 - \\frac{${formatNum(sse)}}{${formatNum(sst)}} = ${formatNum(rSquared, 6)}`}
            block
          />
        </div>
        {adjRSquared !== null && (
          <div style={{ ...mathBoxStyle, marginTop: '0.5rem' }}>
            <MathView
              math={`R^2_{adj} = 1 - \\frac{(1 - R^2)(n - 1)}{n - 2} = 1 - \\frac{(1 - ${formatNum(rSquared, 6)})(${n} - 1)}{${n} - 2} = ${formatNum(adjRSquared, 6)}`}
              block
            />
          </div>
        )}
        <div style={finalResultCallout('gold')}>
          <CheckCircle2 size={16} color="#fbbf24" />
          <span>
            Model Explanatory Power: <strong style={{ fontFamily: 'var(--font-mono)' }}>R² = {formatNum(rSquared, 6)}</strong> ({(rSquared * 100).toFixed(4)}% of variance explained)
            {adjRSquared !== null && ` • Adj R² = ${formatNum(adjRSquared, 6)}`}
          </span>
        </div>
      </div>

      {/* STEP 10: Mathematical Interpretation */}
      <div className="math-step-card" style={stepCardStyle}>
        <div style={stepHeaderStyle}>
          <span style={stepBadgeStyle('emerald')}>Step 10</span>
          <strong style={stepTitleStyle}>Mathematical & Practical Interpretation</strong>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            • <strong>Slope (β₁ = {formatNum(slope)}):</strong> For every 1-unit increase in <strong>{xName}</strong>, the model predicts that <strong>{yName}</strong> changes by approximately <strong>{formatNum(slope)}</strong> units on average.
          </div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            • <strong>Intercept (β₀ = {formatNum(intercept)}):</strong> When <strong>{xName}</strong> equals zero, the expected baseline value of <strong>{yName}</strong> is estimated to be <strong>{formatNum(intercept)}</strong>.
          </div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            • <strong>R² ({formatNum(rSquared, 6)}):</strong> The linear regression model accounts for approximately <strong>{(rSquared * 100).toFixed(2)}%</strong> of the total variability in <strong>{yName}</strong>. The remaining {((1 - rSquared) * 100).toFixed(2)}% of variance is residual/unexplained by the linear model.
          </div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            • <strong>RMSE ({formatNum(rmse)}):</strong> The standard scatter distance of actual observations around the regression line is approximately ±<strong>{formatNum(rmse)}</strong> units.
          </div>
        </div>
      </div>
    </div>
  );
}
