import React from 'react';
import MathView, { MathText } from './MathView';
import {
  Calculator,
  ArrowUpDown,
  Table as TableIcon,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
  Sigma,
  Split
} from 'lucide-react';

/**
 * Cleanly formats numerical values to avoid floating-point display artifacts (e.g. 0.30000000000000004 or -0).
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

/**
 * Component providing rich, detailed mathematical step-by-step derivations
 * for all 7 descriptive statistics: Mean, Median, Mode, Variance, SD, Range, and IQR.
 */
export default function DescriptiveDerivationContent({ statKey, stats, varianceType = 'sample' }) {
  if (!stats || !stats.hasData) return null;

  const n = stats.n;
  const isSample = varianceType === 'sample';

  // --------------------------------------------------------------------------
  // 1. ARITHMETIC MEAN
  // --------------------------------------------------------------------------
  if (statKey === 'mean') {
    const sumFormatted = formatNum(stats.sum);
    const meanFormatted = formatNum(stats.mean);
    const expandedSum = n <= 10
      ? stats.deviations.map(d => formatNum(d.x)).join(' + ')
      : `${stats.deviations.slice(0, 5).map(d => formatNum(d.x)).join(' + ')} + \\dots + ${stats.deviations.slice(-2).map(d => formatNum(d.x)).join(' + ')}`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Step 1: Formula */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('purple')}>Step 1</span>
            <strong style={stepTitleStyle}>State the Arithmetic Mean Formula</strong>
          </div>
          <p style={stepDescStyle}>
            The arithmetic mean <MathText text="\bar{x}" /> is the sum of all observed values divided by the total number of observations <MathText text="n" />:
          </p>
          <div style={mathBoxStyle}>
            <MathView math="\bar{x} = \frac{\sum_{i=1}^{n} x_i}{n} = \frac{x_1 + x_2 + \dots + x_n}{n}" block />
          </div>
        </div>

        {/* Step 2: Observations and Sum */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('purple')}>Step 2</span>
            <strong style={stepTitleStyle}>Count Observations (n) and Calculate Total Sum (Σxᵢ)</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Number of Observations (n)</span>
              <span style={paramValueStyle}>{n} valid observations</span>
            </div>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Sum of Observations (Σxᵢ)</span>
              <span style={paramValueStyle}>{sumFormatted}</span>
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: '#94a3b8' }}>
            Expanded summation across dataset:
            <div style={{ marginTop: '0.35rem', overflowX: 'auto', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: '6px' }}>
              <MathView math={`\\sum_{i=1}^{${n}} x_i = ${expandedSum} = ${sumFormatted}`} block />
            </div>
          </div>
        </div>

        {/* Step 3: Algebraic Substitution */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('purple')}>Step 3</span>
            <strong style={stepTitleStyle}>Substitute Sum and Sample Size into Formula</strong>
          </div>
          <p style={stepDescStyle}>
            Substitute the calculated sum <MathText text={`\\sum x_i = ${sumFormatted}`} /> and sample size <MathText text={`n = ${n}`} />:
          </p>
          <div style={mathBoxStyle}>
            <MathView math={`\\bar{x} = \\frac{${sumFormatted}}{${n}}`} block />
          </div>
        </div>

        {/* Step 4: Division & Final Answer */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('purple')}>Step 4</span>
            <strong style={stepTitleStyle}>Perform Division and Evaluate Final Mean</strong>
          </div>
          <div style={mathBoxStyle}>
            <MathView math={`\\bar{x} = \\frac{${sumFormatted}}{${n}} = ${meanFormatted}`} block />
          </div>
          <div style={finalResultCallout('purple')}>
            <CheckCircle2 size={18} color="#c084fc" />
            <span>Final Arithmetic Mean: <strong style={{ fontFamily: 'var(--font-mono)' }}>x̄ = {meanFormatted}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. SAMPLE MEDIAN
  // --------------------------------------------------------------------------
  if (statKey === 'median') {
    const sorted = stats.sortedValues || [];
    const isOdd = n % 2 !== 0;
    const medianVal = formatNum(stats.median);

    const oddRank = (n + 1) / 2;
    const evenRank1 = n / 2;
    const evenRank2 = n / 2 + 1;
    const evenVal1 = sorted[evenRank1 - 1];
    const evenVal2 = sorted[evenRank2 - 1];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Step 1: Sorting Explanation */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('cyan')}>Step 1</span>
            <strong style={stepTitleStyle}>Sort Observations in Ascending Order</strong>
          </div>
          <p style={stepDescStyle}>
            The sample median requires arranging all <MathText text={`n = ${n}`} /> observations in non-decreasing numerical sequence:
            <MathText text=" x_{(1)} \le x_{(2)} \le \dots \le x_{(n)}" />.
          </p>
          
          {/* Sorted Observations Data Table */}
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowUpDown size={13} />
              <span>Labelled Sorted Dataset (Rank 1 to {n}):</span>
            </div>
            
            <div style={{ overflowX: 'auto', maxHeight: '220px', overflowY: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'center' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', position: 'sticky', top: 0, zIndex: 1 }}>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Rank Index (k)</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Ordered Value x₍ₖ₎</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Status / Role in Median</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((val, idx) => {
                    const rank = idx + 1;
                    const isMiddleOdd = isOdd && rank === oddRank;
                    const isMiddleEven = !isOdd && (rank === evenRank1 || rank === evenRank2);
                    const isHighlighted = isMiddleOdd || isMiddleEven;

                    return (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor: isHighlighted ? 'rgba(6, 182, 212, 0.18)' : (idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent'),
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        }}
                      >
                        <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', color: isHighlighted ? '#22d3ee' : '#94a3b8', fontWeight: isHighlighted ? 700 : 500 }}>
                          k = {rank}
                        </td>
                        <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', color: isHighlighted ? '#ffffff' : '#f1f5f9', fontWeight: isHighlighted ? 700 : 400 }}>
                          {formatNum(val)}
                        </td>
                        <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                          {isMiddleOdd && (
                            <span style={highlightBadgeStyle('cyan')}>Exact Middle Position (Median)</span>
                          )}
                          {!isOdd && rank === evenRank1 && (
                            <span style={highlightBadgeStyle('cyan')}>Middle Lower Element (Rank {evenRank1})</span>
                          )}
                          {!isOdd && rank === evenRank2 && (
                            <span style={highlightBadgeStyle('cyan')}>Middle Upper Element (Rank {evenRank2})</span>
                          )}
                          {!isHighlighted && (
                            <span style={{ color: '#64748b' }}>Ordered Observation</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Step 2: Middle Position Identification */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('cyan')}>Step 2</span>
            <strong style={stepTitleStyle}>
              {isOdd ? `Odd Sample Size (n = ${n}): Locate Middle Position` : `Even Sample Size (n = ${n}): Average Two Middle Elements`}
            </strong>
          </div>

          {isOdd ? (
            <div>
              <p style={stepDescStyle}>
                Since the number of observations <MathText text={`n = ${n}`} /> is <strong>odd</strong>, the median is the single unique observation positioned at rank index <MathText text="\frac{n + 1}{2}" />:
              </p>
              <div style={mathBoxStyle}>
                <MathView math={`\\text{Middle Position } k = \\frac{n + 1}{2} = \\frac{${n} + 1}{2} = ${oddRank}`} block />
              </div>
              <p style={{ ...stepDescStyle, marginTop: '0.5rem' }}>
                Reading the element at rank position <MathText text={`k = ${oddRank}`} /> from our sorted dataset:
              </p>
              <div style={mathBoxStyle}>
                <MathView math={`\\tilde{x} = x_{(${oddRank})} = ${medianVal}`} block />
              </div>
            </div>
          ) : (
            <div>
              <p style={stepDescStyle}>
                Since the number of observations <MathText text={`n = ${n}`} /> is <strong>even</strong>, the median is the arithmetic mean of the two central observations at rank positions <MathText text="\frac{n}{2}" /> and <MathText text="\frac{n}{2} + 1" />:
              </p>
              <div style={mathBoxStyle}>
                <MathView math={`\\text{Rank 1} = \\frac{n}{2} = \\frac{${n}}{2} = ${evenRank1} \\quad | \\quad \\text{Rank 2} = \\frac{n}{2} + 1 = ${evenRank2}`} block />
              </div>
              <p style={{ ...stepDescStyle, marginTop: '0.5rem' }}>
                Observations at these middle ranks: <MathText text={`x_{(${evenRank1})} = ${formatNum(evenVal1)}`} /> and <MathText text={`x_{(${evenRank2})} = ${formatNum(evenVal2)}`} />. Averaging the two:
              </p>
              <div style={mathBoxStyle}>
                <MathView math={`\\tilde{x} = \\frac{x_{(${evenRank1})} + x_{(${evenRank2})}}{2} = \\frac{${formatNum(evenVal1)} + ${formatNum(evenVal2)}}{2} = \\frac{${formatNum(evenVal1 + evenVal2)}}{2} = ${medianVal}`} block />
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Final Median Result */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('cyan')}>Step 3</span>
            <strong style={stepTitleStyle}>Final Sample Median</strong>
          </div>
          <div style={finalResultCallout('cyan')}>
            <CheckCircle2 size={18} color="#22d3ee" />
            <span>Final Sample Median: <strong style={{ fontFamily: 'var(--font-mono)' }}>Q₂ (x̃) = {medianVal}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 3. STATISTICAL MODE
  // --------------------------------------------------------------------------
  if (statKey === 'mode') {
    const modeObj = stats.mode || {};
    const freqTable = modeObj.frequencyTable || [];
    const maxFreq = modeObj.maxFrequency || 1;
    const hasRepeatedMode = modeObj.hasRepeatedMode;
    const modesList = modeObj.modes || [];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Step 1: Distinct Frequency Table */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('pink')}>Step 1</span>
            <strong style={stepTitleStyle}>Construct Distinct Values Frequency Table</strong>
          </div>
          <p style={stepDescStyle}>
            Tally every unique numerical value observed in the dataset of <MathText text={`n = ${n}`} /> observations and count its absolute frequency <MathText text="f(x)" />:
          </p>

          <div style={{ overflowX: 'auto', maxHeight: '240px', overflowY: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', marginTop: '0.6rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', position: 'sticky', top: 0, zIndex: 1 }}>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Distinct Value (x)</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Frequency Count (f)</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Relative Frequency (%)</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Mode Status</th>
                </tr>
              </thead>
              <tbody>
                {freqTable.map((row, idx) => {
                  const isModeRow = hasRepeatedMode && row.frequency === maxFreq;
                  return (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: isModeRow ? 'rgba(236, 72, 153, 0.16)' : (idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent'),
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', fontWeight: isModeRow ? 700 : 500, color: isModeRow ? '#f472b6' : '#f8fafc' }}>
                        {formatNum(row.value)}
                      </td>
                      <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', fontWeight: isModeRow ? 700 : 400, color: isModeRow ? '#ffffff' : '#cbd5e1' }}>
                        {row.frequency}
                      </td>
                      <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                        {row.percentage}%
                      </td>
                      <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                        {isModeRow ? (
                          <span style={highlightBadgeStyle('pink')}>Peak Frequency (Mode)</span>
                        ) : (
                          <span style={{ color: '#64748b' }}>Frequency = {row.frequency}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 2: Peak Frequency Identification */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('pink')}>Step 2</span>
            <strong style={stepTitleStyle}>Identify Maximum Frequency and Peak Value(s)</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Maximum Observed Frequency (f_max)</span>
              <span style={paramValueStyle}>{maxFreq} occurrence{maxFreq > 1 ? 's' : ''}</span>
            </div>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Distinct Values Count</span>
              <span style={paramValueStyle}>{freqTable.length} distinct numbers</span>
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            {hasRepeatedMode ? (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.25)', fontSize: '0.85rem', color: '#fce7f3', lineHeight: 1.5 }}>
                {modeObj.isMultimodal ? (
                  <div>
                    <strong>Multimodal Peak Detection:</strong> Found {modesList.length} distinct values tied with the maximum frequency of <MathText text={`f_{\\max} = ${maxFreq}`} />:
                    <div style={{ fontFamily: 'var(--font-mono)', marginTop: '0.4rem', color: '#ffffff', fontWeight: 700 }}>
                      Mode Set = {'{'}{modesList.map(m => formatNum(m)).join(', ')}{'}'}
                    </div>
                  </div>
                ) : (
                  <div>
                    <strong>Unimodal Peak Detection:</strong> A single unique value reaches the peak frequency of <MathText text={`f_{\\max} = ${maxFreq}`} />:
                    <div style={{ fontFamily: 'var(--font-mono)', marginTop: '0.4rem', color: '#ffffff', fontWeight: 700 }}>
                      Mode (Mo) = {formatNum(modesList[0])}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.85rem', color: '#fef3c7', lineHeight: 1.5 }}>
                <strong>No Mode Exists (Uniform Frequency):</strong> Every distinct value in this dataset appears exactly once (<MathText text="f = 1" />). In statistical mathematics, when all values occur with identical unit frequency, the distribution has no peak and no mode exists.
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Final Mode Callout */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('pink')}>Step 3</span>
            <strong style={stepTitleStyle}>Final Statistical Mode</strong>
          </div>
          <div style={finalResultCallout('pink')}>
            <CheckCircle2 size={18} color="#f472b6" />
            <span>
              Final Mode: <strong style={{ fontFamily: 'var(--font-mono)' }}>{hasRepeatedMode ? modesList.map(m => formatNum(m)).join(', ') : 'None (No repeated values)'}</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 4. SAMPLE / POPULATION VARIANCE
  // --------------------------------------------------------------------------
  if (statKey === 'variance') {
    const meanVal = formatNum(stats.mean);
    const ssVal = formatNum(stats.sumOfSquares);
    const df = isSample ? n - 1 : n;
    const finalVariance = isSample ? formatNum(stats.sampleVariance) : formatNum(stats.populationVariance);
    const formulaLatex = isSample
      ? 's^2 = \\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n - 1}'
      : '\\sigma^2 = \\frac{\\sum_{i=1}^{N} (x_i - \\mu)^2}{N}';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Step 1: Formula and Given Parameters */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('gold')}>Step 1</span>
            <strong style={stepTitleStyle}>
              {isSample ? "State Sample Variance Formula (Bessel's Correction)" : 'State Population Variance Formula'}
            </strong>
          </div>
          <p style={stepDescStyle}>
            {isSample
              ? "Sample variance measures the average squared deviation dividing by degrees of freedom (n - 1) to eliminate downward sample bias:"
              : 'Population variance divides sum of squared deviations by total population size N:'}
          </p>
          <div style={mathBoxStyle}>
            <MathView math={formulaLatex} block />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Calculated Arithmetic Mean (x̄)</span>
              <span style={paramValueStyle}>{meanVal}</span>
            </div>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Sample Size (n)</span>
              <span style={paramValueStyle}>{n} observations</span>
            </div>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Denominator (Degrees of Freedom)</span>
              <span style={paramValueStyle}>{isSample ? `n - 1 = ${df}` : `N = ${df}`}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Deviation and Squared Deviation Table */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('gold')}>Step 2</span>
            <strong style={stepTitleStyle}>Observation Deviations & Squared Deviations Table</strong>
          </div>
          <p style={stepDescStyle}>
            Compute individual deviations <MathText text="x_i - \bar{x}" /> and their squares <MathText text="(x_i - \bar{x})^2" /> for each observation:
          </p>

          <div style={{ overflowX: 'auto', maxHeight: '280px', overflowY: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', marginTop: '0.6rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', position: 'sticky', top: 0, zIndex: 1 }}>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Index (i)</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Observation (xᵢ)</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Deviation (xᵢ − x̄)</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Squared Deviation (xᵢ − x̄)²</th>
                </tr>
              </thead>
              <tbody>
                {stats.deviations.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      {row.index}
                    </td>
                    <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#f8fafc', fontWeight: 600 }}>
                      {formatNum(row.x)}
                    </td>
                    <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', color: row.deviation >= 0 ? '#38bdf8' : '#f472b6' }}>
                      {formatNum(row.deviation)}
                    </td>
                    <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#fbbf24', fontWeight: 600 }}>
                      {formatNum(row.deviationSquared)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', borderTop: '2px solid rgba(245, 158, 11, 0.4)', fontWeight: 700 }}>
                  <td style={{ padding: '0.6rem 0.75rem', color: '#fbbf24' }}>Total</td>
                  <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#f8fafc' }}>
                    Σxᵢ = {formatNum(stats.sum)}
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                    Σ(xᵢ − x̄) = 0
                  </td>
                  <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
                    SS = {ssVal}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem', fontStyle: 'italic' }}>
            Note: By the fundamental theorem of the arithmetic mean, the algebraic sum of deviations <MathText text="\sum (x_i - \bar{x}) = 0" /> exactly.
          </div>
        </div>

        {/* Step 3: Sum of Squares and Denominator */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('gold')}>Step 3</span>
            <strong style={stepTitleStyle}>Extract Sum of Squared Deviations (SS) and Denominator</strong>
          </div>
          <div style={mathBoxStyle}>
            <MathView math={`SS = \\sum_{i=1}^{${n}} (x_i - \\bar{x})^2 = ${ssVal}`} block />
          </div>
          <div style={{ marginTop: '0.5rem', ...stepDescStyle }}>
            {isSample ? (
              <span>Sample degrees of freedom: <MathText text={`n - 1 = ${n} - 1 = ${df}`} /></span>
            ) : (
              <span>Population observation count: <MathText text={`N = ${df}`} /></span>
            )}
          </div>
        </div>

        {/* Step 4: Substitution and Final Evaluation */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('gold')}>Step 4</span>
            <strong style={stepTitleStyle}>Substitute Values and Compute Variance</strong>
          </div>
          {n >= 2 || !isSample ? (
            <div>
              <div style={mathBoxStyle}>
                <MathView
                  math={isSample
                    ? `s^2 = \\frac{SS}{n - 1} = \\frac{${ssVal}}{${df}} = ${finalVariance}`
                    : `\\sigma^2 = \\frac{SS}{N} = \\frac{${ssVal}}{${df}} = ${finalVariance}`}
                  block
                />
              </div>
              <div style={finalResultCallout('gold')}>
                <CheckCircle2 size={18} color="#fbbf24" />
                <span>
                  Final {isSample ? 'Sample Variance' : 'Population Variance'}:{' '}
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{isSample ? 's²' : 'σ²'} = {finalVariance}</strong>
                </span>
              </div>
            </div>
          ) : (
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fca5a5' }}>
              Sample variance is undefined for sample size n = 1 (division by n - 1 = 0).
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 5. STANDARD DEVIATION
  // --------------------------------------------------------------------------
  if (statKey === 'sd') {
    const varianceVal = isSample ? formatNum(stats.sampleVariance) : formatNum(stats.populationVariance);
    const sdVal = isSample ? formatNum(stats.sampleSD) : formatNum(stats.populationSD);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Step 1: Reference to Calculated Variance */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('emerald')}>Step 1</span>
            <strong style={stepTitleStyle}>
              Refer to Correctly Calculated {isSample ? 'Sample Variance (s²)' : 'Population Variance (σ²)'}
            </strong>
          </div>
          <p style={stepDescStyle}>
            Standard deviation is defined mathematically as the principal (positive) square root of the variance:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.6rem' }}>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Prior Calculated Variance</span>
              <span style={paramValueStyle}>{isSample ? `s² = ${varianceVal}` : `σ² = ${varianceVal}`}</span>
            </div>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Original Units Restoration</span>
              <span style={paramValueStyle}>√[units²] → units</span>
            </div>
          </div>
        </div>

        {/* Step 2: Square Root Formula */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('emerald')}>Step 2</span>
            <strong style={stepTitleStyle}>State the Square Root Formula</strong>
          </div>
          <div style={mathBoxStyle}>
            <MathView math={isSample ? 's = \\sqrt{s^2}' : '\\sigma = \\sqrt{\\sigma^2}'} block />
          </div>
        </div>

        {/* Step 3: Substitution & Calculation */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('emerald')}>Step 3</span>
            <strong style={stepTitleStyle}>Substitute Variance and Compute Square Root</strong>
          </div>
          {varianceVal !== 'N/A' && varianceVal !== 'Undefined' ? (
            <div>
              <div style={mathBoxStyle}>
                <MathView math={isSample ? `s = \\sqrt{${varianceVal}} = ${sdVal}` : `\\sigma = \\sqrt{${varianceVal}} = ${sdVal}`} block />
              </div>
              <div style={finalResultCallout('emerald')}>
                <CheckCircle2 size={18} color="#34d399" />
                <span>
                  Final {isSample ? 'Sample Standard Deviation' : 'Population Standard Deviation'}:{' '}
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{isSample ? 's' : 'σ'} = {sdVal}</strong>
                </span>
              </div>
            </div>
          ) : (
            <div style={{ padding: '0.75rem', color: '#fca5a5' }}>Standard deviation cannot be computed for undefined variance.</div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 6. RANGE
  // --------------------------------------------------------------------------
  if (statKey === 'range') {
    const minVal = formatNum(stats.min);
    const maxVal = formatNum(stats.max);
    const rangeVal = formatNum(stats.range);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Step 1: Identify Extrema */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('purple')}>Step 1</span>
            <strong style={stepTitleStyle}>Identify Minimum and Maximum Observations</strong>
          </div>
          <p style={stepDescStyle}>
            Scan all <MathText text={`n = ${n}`} /> observations in the dataset to locate the extreme boundary observations:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.6rem' }}>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Minimum Observation (x_min)</span>
              <span style={paramValueStyle}>{minVal}</span>
            </div>
            <div style={paramCardStyle}>
              <span style={paramLabelStyle}>Maximum Observation (x_max)</span>
              <span style={paramValueStyle}>{maxVal}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Formula */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('purple')}>Step 2</span>
            <strong style={stepTitleStyle}>State the Range Formula</strong>
          </div>
          <div style={mathBoxStyle}>
            <MathView math="\text{Range } (R) = x_{\max} - x_{\min}" block />
          </div>
        </div>

        {/* Step 3: Substitution & Result */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('purple')}>Step 3</span>
            <strong style={stepTitleStyle}>Substitute Extrema and Calculate Span</strong>
          </div>
          <div style={mathBoxStyle}>
            <MathView math={`R = ${maxVal} - (${minVal}) = ${rangeVal}`} block />
          </div>
          <div style={finalResultCallout('purple')}>
            <CheckCircle2 size={18} color="#c084fc" />
            <span>Final Range: <strong style={{ fontFamily: 'var(--font-mono)' }}>R = {rangeVal}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 7. INTERQUARTILE RANGE (IQR)
  // --------------------------------------------------------------------------
  if (statKey === 'iqr') {
    const q1 = formatNum(stats.q1);
    const q3 = formatNum(stats.q3);
    const iqr = formatNum(stats.iqr);
    const q1Details = stats.explanations?.iqr?.q1Details;
    const q3Details = stats.explanations?.iqr?.q3Details;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Step 1: Quantile Method Definition */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('cyan')}>Step 1</span>
            <strong style={stepTitleStyle}>Document Quantile Method (Method 7 / Type 7)</strong>
          </div>
          <p style={stepDescStyle}>
            INSIGHTX implements <strong>Method 7</strong> (linear interpolation on continuous rank index <MathText text="(n - 1) \cdot p" />), the universal standard adopted by NumPy, SciPy, R (<MathText text="\text{type}=7" />), and Excel (<MathText text="\text{PERCENTILE.INC}" />):
          </p>
          <div style={mathBoxStyle}>
            <MathView math="\text{Index}(p) = (n - 1) \cdot p \quad \Rightarrow \quad Q(p) = (1 - w) \cdot x_{(\text{lower})} + w \cdot x_{(\text{upper})}" block />
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            where <MathText text="\text{lower} = \lfloor \text{Index} \rfloor + 1" />, <MathText text="\text{upper} = \lceil \text{Index} \rceil + 1" />, and interpolation weight <MathText text="w = \text{Index} - \lfloor \text{Index} \rfloor" />.
          </div>
        </div>

        {/* Step 2: First Quartile Q1 Calculation */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('cyan')}>Step 2</span>
            <strong style={stepTitleStyle}>Calculate First Quartile (Q₁ / 25th Percentile, p = 0.25)</strong>
          </div>
          {q1Details ? (
            <div>
              <div style={mathBoxStyle}>
                <MathView math={`\\text{Index}_{Q1} = (${n} - 1) \\cdot 0.25 = ${formatNum((n - 1) * 0.25)}`} block />
              </div>
              <div style={{ marginTop: '0.5rem', ...stepDescStyle }}>
                Rank position lower index = {q1Details.lowerIndex + 1} (value: <MathText text={formatNum(q1Details.valLower)} />),
                upper index = {q1Details.upperIndex + 1} (value: <MathText text={formatNum(q1Details.valUpper)} />),
                interpolation weight <MathText text={`w = ${q1Details.weight}`} />.
              </div>
              <div style={{ marginTop: '0.5rem', ...mathBoxStyle }}>
                <MathView
                  math={q1Details.lowerIndex === q1Details.upperIndex
                    ? `Q_1 = x_{(${q1Details.lowerIndex + 1})} = ${q1}`
                    : `Q_1 = (1 - ${q1Details.weight}) \\cdot ${formatNum(q1Details.valLower)} + ${q1Details.weight} \\cdot ${formatNum(q1Details.valUpper)} = ${q1}`}
                  block
                />
              </div>
            </div>
          ) : (
            <div style={mathBoxStyle}><MathView math={`Q_1 = ${q1}`} block /></div>
          )}
        </div>

        {/* Step 3: Third Quartile Q3 Calculation */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('cyan')}>Step 3</span>
            <strong style={stepTitleStyle}>Calculate Third Quartile (Q₃ / 75th Percentile, p = 0.75)</strong>
          </div>
          {q3Details ? (
            <div>
              <div style={mathBoxStyle}>
                <MathView math={`\\text{Index}_{Q3} = (${n} - 1) \\cdot 0.75 = ${formatNum((n - 1) * 0.75)}`} block />
              </div>
              <div style={{ marginTop: '0.5rem', ...stepDescStyle }}>
                Rank position lower index = {q3Details.lowerIndex + 1} (value: <MathText text={formatNum(q3Details.valLower)} />),
                upper index = {q3Details.upperIndex + 1} (value: <MathText text={formatNum(q3Details.valUpper)} />),
                interpolation weight <MathText text={`w = ${q3Details.weight}`} />.
              </div>
              <div style={{ marginTop: '0.5rem', ...mathBoxStyle }}>
                <MathView
                  math={q3Details.lowerIndex === q3Details.upperIndex
                    ? `Q_3 = x_{(${q3Details.lowerIndex + 1})} = ${q3}`
                    : `Q_3 = (1 - ${q3Details.weight}) \\cdot ${formatNum(q3Details.valLower)} + ${q3Details.weight} \\cdot ${formatNum(q3Details.valUpper)} = ${q3}`}
                  block
                />
              </div>
            </div>
          ) : (
            <div style={mathBoxStyle}><MathView math={`Q_3 = ${q3}`} block /></div>
          )}
        </div>

        {/* Step 4: Subtract Q1 from Q3 */}
        <div className="math-step-card" style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <span style={stepBadgeStyle('cyan')}>Step 4</span>
            <strong style={stepTitleStyle}>Calculate Interquartile Range (IQR = Q₃ − Q₁)</strong>
          </div>
          <div style={mathBoxStyle}>
            <MathView math={`\\text{IQR} = Q_3 - Q_1 = ${q3} - (${q1}) = ${iqr}`} block />
          </div>
          <div style={finalResultCallout('cyan')}>
            <CheckCircle2 size={18} color="#22d3ee" />
            <span>Final Interquartile Range: <strong style={{ fontFamily: 'var(--font-mono)' }}>IQR = {iqr}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ----------------------------------------------------------------------------
// Internal Style Helpers
// ----------------------------------------------------------------------------
const stepCardStyle = {
  padding: '1rem 1.15rem',
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
};

const stepHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.45rem',
};

const stepTitleStyle = {
  fontSize: '0.875rem',
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
  marginTop: '0.5rem',
  padding: '0.65rem 0.85rem',
  borderRadius: '6px',
  backgroundColor: 'rgba(10, 14, 26, 0.8)',
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
    padding: '0.15rem 0.45rem',
    borderRadius: '4px',
    backgroundColor: c.bg,
    color: c.text,
    border: `1px solid ${c.border}`,
    fontSize: '0.72rem',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
  };
}

function highlightBadgeStyle(color = 'cyan') {
  const map = {
    cyan: { bg: 'rgba(6, 182, 212, 0.25)', text: '#cffafe', border: '1px solid #06b6d4' },
    pink: { bg: 'rgba(236, 72, 153, 0.25)', text: '#fce7f3', border: '1px solid #ec4899' },
  };
  const c = map[color] || map.cyan;
  return {
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    backgroundColor: c.bg,
    color: c.text,
    border: c.border,
    fontSize: '0.7rem',
    fontWeight: 700,
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
