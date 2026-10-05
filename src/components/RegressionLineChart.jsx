import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function RegressionLineChart({
  rows = [],
  xName = 'X',
  yName = 'Y',
  slope = null,
  intercept = null,
  equation = ''
}) {
  const [showFittedLine, setShowFittedLine] = useState(true);

  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        No paired data available for regression plot.
      </div>
    );
  }

  // Format scatter points
  const scatterPoints = rows.map((r) => ({
    x: r.x,
    y: r.y,
    yHat: r.yHat,
    residual: r.residual,
    originalIndex: r.originalIndex
  }));

  // Build 2 end-points for the fitted regression line
  let lineData = [];
  if (slope !== null && intercept !== null && showFittedLine && scatterPoints.length > 0) {
    const minX = Math.min(...scatterPoints.map((p) => p.x));
    const maxX = Math.max(...scatterPoints.map((p) => p.x));
    const pad = (maxX - minX) * 0.05 || 1;
    const xStart = minX - pad;
    const xEnd = maxX + pad;

    lineData = [
      { x: Number(xStart.toFixed(4)), yHatLine: Number((intercept + slope * xStart).toFixed(4)) },
      { x: Number(xEnd.toFixed(4)), yHatLine: Number((intercept + slope * xEnd).toFixed(4)) }
    ];
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Observation #{data.originalIndex || '—'}
          </div>
          <div style={{ color: '#38bdf8', marginBottom: '0.2rem' }}>
            {xName} (X): <strong>{data.x}</strong>
          </div>
          <div style={{ color: '#f472b6', marginBottom: '0.2rem' }}>
            Actual {yName} (Y): <strong>{data.y}</strong>
          </div>
          {data.yHat !== undefined && (
            <div style={{ color: '#a855f7', marginBottom: '0.2rem' }}>
              Fitted (ŷ): <strong>{data.yHat}</strong>
            </div>
          )}
          {data.residual !== undefined && (
            <div style={{ color: data.residual >= 0 ? '#10b981' : '#f59e0b', fontSize: '0.75rem' }}>
              Residual (e = y - ŷ): <strong>{data.residual > 0 ? `+${data.residual}` : data.residual}</strong>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Chart Control Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#ec4899', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: '#cbd5e1' }}>Observed (xᵢ, yᵢ)</span>
          </div>
          {slope !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '16px', height: '2px', backgroundColor: '#a855f7', display: 'inline-block' }} />
              <span style={{ color: '#cbd5e1' }}>Fitted OLS Line ({equation})</span>
            </div>
          )}
        </div>

        {slope !== null && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.78rem', color: '#94a3b8' }}>
            <input
              type="checkbox"
              checked={showFittedLine}
              onChange={(e) => setShowFittedLine(e.target.checked)}
              style={{ accentColor: '#a855f7', cursor: 'pointer' }}
            />
            <span>Show Fitted Line</span>
          </label>
        )}
      </div>

      {/* Chart Canvas */}
      <div style={{ height: '360px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
            <XAxis
              type="number"
              dataKey="x"
              name={xName}
              stroke="#64748b"
              fontSize={11}
              domain={['auto', 'auto']}
              label={{
                value: `${xName} (Predictor)`,
                position: 'bottom',
                offset: 15,
                fill: '#94a3b8',
                fontSize: 11,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yName}
              stroke="#64748b"
              fontSize={11}
              domain={['auto', 'auto']}
              label={{
                value: `${yName} (Response)`,
                angle: -90,
                position: 'left',
                offset: 5,
                fill: '#94a3b8',
                fontSize: 11,
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Observed Data Points */}
            <Scatter
              name="Observed Pairs"
              data={scatterPoints}
              fill="#ec4899"
              shape="circle"
            />

            {/* Fitted Regression Line */}
            {showFittedLine && lineData.length > 0 && (
              <Line
                data={lineData}
                type="linear"
                dataKey="yHatLine"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
        Linear OLS hyperplane minimizing orthogonal residual sum of squares: <code style={{ color: '#a855f7' }}>{equation}</code>
      </div>
    </div>
  );
}
