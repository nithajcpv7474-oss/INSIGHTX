import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

export default function HistogramChart({
  frequencyDistribution,
  mean,
  median,
  columnName = 'Variable'
}) {
  if (!frequencyDistribution || !frequencyDistribution.bins || frequencyDistribution.bins.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        No histogram data available.
      </div>
    );
  }

  const { bins, binWidth, binCount } = frequencyDistribution;

  const chartData = bins.map((bin) => ({
    label: bin.label,
    center: bin.center,
    frequency: bin.frequency,
    relativeFrequencyPct: bin.relativeFrequencyPct,
    lower: bin.lower,
    upper: bin.upper
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
            Bin Interval: [{data.lower}, {data.upper})
          </div>
          <div style={{ color: '#c084fc', marginBottom: '0.2rem' }}>
            Frequency (f): <strong>{data.frequency}</strong> observations
          </div>
          <div style={{ color: '#22d3ee' }}>
            Relative Proportion: <strong>{data.relativeFrequencyPct}%</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Legend & Summary Info */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#a855f7', borderRadius: '3px', display: 'inline-block' }} />
            <span style={{ color: '#cbd5e1' }}>Frequency Bin (f)</span>
          </div>

          {typeof mean === 'number' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '14px', height: '2px', backgroundColor: '#06b6d4', display: 'inline-block' }} />
              <span style={{ color: '#22d3ee', fontWeight: 600 }}>Mean (x̄ = {mean})</span>
            </div>
          )}

          {typeof median === 'number' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '14px', height: '2px', backgroundColor: '#f59e0b', borderTop: '2px dashed #f59e0b', display: 'inline-block' }} />
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>Median (Q₂ = {median})</span>
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          Sturges' Rule: <strong>{binCount} bins</strong> (width ≈ {binWidth})
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              angle={-20}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="url(#purpleGradient)"
                  stroke="#a855f7"
                  strokeWidth={1}
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
