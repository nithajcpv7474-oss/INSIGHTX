import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';

export default function ScatterPlotChart({
  pairedRows = [],
  xName = 'X',
  yName = 'Y',
  trendline = null
}) {
  const [showTrendline, setShowTrendline] = useState(true);

  if (!pairedRows || pairedRows.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        No paired data available for scatter plot.
      </div>
    );
  }

  // Format data for Recharts
  const scatterData = pairedRows.map((p) => ({
    x: p.x,
    y: p.y,
    index: p.index,
    devX: p.devX,
    devY: p.devY,
    crossProduct: p.crossProduct
  }));

  // Generate 2 points for visual trendline if available
  let trendData = [];
  if (trendline && showTrendline && scatterData.length > 0) {
    const minX = Math.min(...scatterData.map(d => d.x));
    const maxX = Math.max(...scatterData.map(d => d.x));
    trendData = [
      { x: minX, trendY: Number((trendline.slope * minX + trendline.intercept).toFixed(4)) },
      { x: maxX, trendY: Number((trendline.slope * maxX + trendline.intercept).toFixed(4)) }
    ];
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
            Observation #{data.index}
          </div>
          <div style={{ color: '#22d3ee' }}>
            {xName} (X): <strong>{data.x}</strong>
          </div>
          <div style={{ color: '#f472b6' }}>
            {yName} (Y): <strong>{data.y}</strong>
          </div>
          {typeof data.crossProduct === 'number' && (
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.35rem' }}>
              (x - x̄)(y - ȳ): {data.crossProduct.toFixed(3)}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Chart Header & Controls */}
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
            <span style={{ width: '10px', height: '10px', backgroundColor: '#06b6d4', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: '#cbd5e1' }}>Observations (n = {pairedRows.length})</span>
          </div>

          {trendline && (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                color: showTrendline ? '#ec4899' : '#64748b',
                fontWeight: 600,
              }}
            >
              <input
                type="checkbox"
                checked={showTrendline}
                onChange={(e) => setShowTrendline(e.target.checked)}
                style={{ cursor: 'pointer', accentColor: '#ec4899' }}
              />
              <span>Trendline: {trendline.formula}</span>
            </label>
          )}
        </div>

        {trendline && (
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
            * Trendline is an informational visual guide (Regression Analysis provides complete OLS modeling).
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div style={{ height: '320px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 10, right: 20, bottom: 25, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
            <XAxis
              type="number"
              dataKey="x"
              name={xName}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              label={{ value: xName, position: 'bottom', offset: 10, fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yName}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              label={{ value: yName, angle: -90, position: 'insideLeft', offset: 5, fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Visual Trendline */}
            {trendline && showTrendline && (
              <Line
                data={trendData}
                type="monotone"
                dataKey="trendY"
                stroke="#ec4899"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                activeDot={false}
                legendType="none"
              />
            )}

            {/* Scatter observations */}
            <Scatter
              name="Pairs"
              data={scatterData}
              fill="#06b6d4"
              stroke="#0891b2"
              strokeWidth={1}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
