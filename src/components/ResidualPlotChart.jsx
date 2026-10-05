import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

export default function ResidualPlotChart({
  rows = [],
  xName = 'X'
}) {
  if (!rows || rows.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        No residual data available.
      </div>
    );
  }

  const plotData = rows.map((r) => ({
    x: r.x,
    residual: r.residual,
    y: r.y,
    yHat: r.yHat,
    originalIndex: r.originalIndex
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Observation #{data.originalIndex}
          </div>
          <div style={{ color: '#38bdf8', marginBottom: '0.2rem' }}>
            {xName} (X): <strong>{data.x}</strong>
          </div>
          <div style={{ color: '#cbd5e1', marginBottom: '0.2rem' }}>
            Actual (y): <strong>{data.y}</strong> | Fitted (ŷ): <strong>{data.yHat}</strong>
          </div>
          <div style={{ color: data.residual >= 0 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
            Residual (e = y - ŷ): <strong>{data.residual > 0 ? `+${data.residual}` : data.residual}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Residual Plot Legend & Guidance */}
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
            <span style={{ width: '10px', height: '10px', backgroundColor: '#38bdf8', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: '#cbd5e1' }}>Residuals (eᵢ = yᵢ - ŷᵢ)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '16px', height: '2px', borderTop: '2px dashed #f43f5e', display: 'inline-block' }} />
            <span style={{ color: '#f43f5e', fontWeight: 600 }}>Zero Error Reference (e = 0)</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ height: '360px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
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
              dataKey="residual"
              name="Residual"
              stroke="#64748b"
              fontSize={11}
              domain={['auto', 'auto']}
              label={{
                value: 'Residual (e = y - ŷ)',
                angle: -90,
                position: 'left',
                offset: 5,
                fill: '#94a3b8',
                fontSize: 11,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#f43f5e" strokeDasharray="4 4" strokeWidth={1.5} />
            <Scatter
              name="Residuals"
              data={plotData}
              fill="#38bdf8"
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.65rem 1rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.75rem',
          color: '#94a3b8',
          lineHeight: 1.5,
        }}
      >
        <strong>Residual Diagnostic Principle:</strong> In an unbiased OLS model, residuals should scatter randomly around the horizontal zero axis without funneling (heteroscedasticity) or curvature patterns.
      </div>
    </div>
  );
}
