import React from 'react';

export default function BoxPlotChart({ boxPlotData, columnName = 'Variable' }) {
  if (!boxPlotData) return null;

  const { min, q1, median, q3, max, lowerWhisker, upperWhisker, outliers = [] } = boxPlotData;

  const span = max - min;
  // If span is 0 (constant column)
  const isConstant = span === 0;

  // Coordinate mapper from data value to percentage (0% to 100%)
  const scale = (val) => {
    if (isConstant) return 50;
    return ((val - min) / span) * 100;
  };

  const xLowerWhisker = scale(lowerWhisker);
  const xQ1 = scale(q1);
  const xMedian = scale(median);
  const xQ3 = scale(q3);
  const xUpperWhisker = scale(upperWhisker);

  return (
    <div style={{ width: '100%', padding: '1rem 0' }}>
      {/* Five-Number Summary Legend */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(10, 14, 26, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Minimum</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{min}</div>
        </div>

        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(10, 14, 26, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Q1 (25%)</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{q1}</div>
        </div>

        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(10, 14, 26, 0.6)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#fbbf24' }}>Median (Q2)</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{median}</div>
        </div>

        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(10, 14, 26, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#c084fc' }}>Q3 (75%)</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>{q3}</div>
        </div>

        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(10, 14, 26, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Maximum</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{max}</div>
        </div>

        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(10, 14, 26, 0.6)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#34d399' }}>IQR</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>{(q3 - q1).toFixed(2)}</div>
        </div>
      </div>

      {/* Box and Whisker Diagram SVG */}
      <div
        style={{
          padding: '1.5rem 1rem',
          backgroundColor: 'rgba(10, 14, 26, 0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 1000 140"
          style={{ width: '100%', height: '140px', overflow: 'visible' }}
        >
          {/* Axis Baseline */}
          <line x1="50" y1="110" x2="950" y2="110" stroke="#334155" strokeWidth="2" />

          {/* Min and Max Axis Ticks */}
          <line x1="50" y1="105" x2="50" y2="115" stroke="#64748b" strokeWidth="2" />
          <text x="50" y="130" fill="#64748b" fontSize="13" textAnchor="middle" fontFamily="var(--font-mono)">
            {min}
          </text>

          <line x1="950" y1="105" x2="950" y2="115" stroke="#64748b" strokeWidth="2" />
          <text x="950" y="130" fill="#64748b" fontSize="13" textAnchor="middle" fontFamily="var(--font-mono)">
            {max}
          </text>

          {/* Whisker Line (Lower to Upper) */}
          <line
            x1={50 + (xLowerWhisker * 9)}
            y1="50"
            x2={50 + (xUpperWhisker * 9)}
            y2="50"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeDasharray="4 4"
          />

          {/* Lower Whisker End Bar */}
          <line
            x1={50 + (xLowerWhisker * 9)}
            y1="35"
            x2={50 + (xLowerWhisker * 9)}
            y2="65"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Upper Whisker End Bar */}
          <line
            x1={50 + (xUpperWhisker * 9)}
            y1="35"
            x2={50 + (xUpperWhisker * 9)}
            y2="65"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Interquartile Box (Q1 to Q3) */}
          <rect
            x={50 + (xQ1 * 9)}
            y="25"
            width={Math.max(4, (xQ3 - xQ1) * 9)}
            height="50"
            fill="rgba(168, 85, 247, 0.25)"
            stroke="#a855f7"
            strokeWidth="2.5"
            rx="6"
          />

          {/* Median Line */}
          <line
            x1={50 + (xMedian * 9)}
            y1="23"
            x2={50 + (xMedian * 9)}
            y2="77"
            stroke="#fbbf24"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Median Point Indicator */}
          <circle
            cx={50 + (xMedian * 9)}
            cy="50"
            r="4.5"
            fill="#fbbf24"
          />

          {/* Outliers Display */}
          {outliers.map((outlierVal, oIdx) => {
            const xOutlier = scale(outlierVal);
            return (
              <circle
                key={oIdx}
                cx={50 + (xOutlier * 9)}
                cy="50"
                r="5"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {outliers.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>● Detected {outliers.length} statistical outlier{outliers.length > 1 ? 's' : ''} outside 1.5×IQR boundary: [{outliers.join(', ')}]</span>
          </div>
        )}
      </div>
    </div>
  );
}
