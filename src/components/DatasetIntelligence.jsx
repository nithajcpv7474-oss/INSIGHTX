import React from 'react';
import {
  FileSpreadsheet,
  Layers,
  Hash,
  AlertTriangle,
  Copy,
  HardDrive,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2,
  RefreshCw
} from 'lucide-react';
import StatCard from './StatCard';

export default function DatasetIntelligence({ dataset, onRemove, onReplaceClick }) {
  if (!dataset) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      {/* Active Dataset Title Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
            }}
          >
            <FileSpreadsheet size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                {dataset.name}
              </h2>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '999px',
                  backgroundColor: dataset.sourceType === 'sample' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: dataset.sourceType === 'sample' ? '#c084fc' : '#34d399',
                  border: `1px solid ${dataset.sourceType === 'sample' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                }}
              >
                {dataset.sourceType === 'sample' ? 'Sample Dataset' : 'User Upload'}
              </span>
              {dataset.sampleLabel && (
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  ({dataset.sampleLabel})
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              <span>Size: <strong style={{ color: '#e2e8f0' }}>{dataset.fileSize}</strong></span>
              <span>•</span>
              <span>Loaded at: <strong style={{ color: '#e2e8f0' }}>{dataset.loadedAt}</strong></span>
              <span>•</span>
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={13} /> Active in Memory
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onReplaceClick && (
            <button
              type="button"
              onClick={onReplaceClick}
              className="btn-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.825rem' }}
            >
              <RefreshCw size={15} color="#06b6d4" />
              <span>Replace File</span>
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontSize: '0.825rem',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
            >
              <Trash2 size={15} />
              <span>Unload</span>
            </button>
          )}
        </div>
      </div>

      {/* Intelligence KPI Metric Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <StatCard
          title="Total Records (N)"
          value={dataset.rowCount.toLocaleString()}
          subtitle="Non-empty data observations"
          icon={FileSpreadsheet}
          accentColor="purple"
          badgeText="Verified"
        />

        <StatCard
          title="Total Variables"
          value={dataset.columnCount}
          subtitle={`${dataset.numericalColumns.length} Num / ${dataset.categoricalColumns.length} Cat${dataset.dateColumns && dataset.dateColumns.length > 0 ? ` / ${dataset.dateColumns.length} Date` : ''}`}
          icon={Layers}
          accentColor="cyan"
          badgeText="Columns"
        />

        <StatCard
          title="Numerical Columns"
          value={dataset.numericalColumns.length}
          subtitle="Continuous quantitative fields"
          icon={Hash}
          accentColor="emerald"
          badgeText={`${((dataset.numericalColumns.length / dataset.columnCount) * 100).toFixed(0)}%`}
        />

        <StatCard
          title="Missing Values"
          value={dataset.missingValueCount}
          subtitle={`${dataset.missingValuePct}% of matrix cells`}
          icon={AlertTriangle}
          accentColor={dataset.missingValueCount > 0 ? 'gold' : 'emerald'}
          badgeText={dataset.missingValueCount === 0 ? 'Zero Nulls' : 'Checked'}
        />

        <StatCard
          title="Duplicate Rows"
          value={dataset.duplicateRowCount}
          subtitle="Exact record matches"
          icon={Copy}
          accentColor={dataset.duplicateRowCount > 0 ? 'pink' : 'emerald'}
          badgeText={dataset.duplicateRowCount === 0 ? 'Clean' : 'Duplicates'}
        />
      </div>

      {/* Variable Classification & Quality Warnings Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Column Classification Breakdown */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              Detected Variable Classification
            </h3>
            <span className="badge badge-cyan">{dataset.headers.length} Variables</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Numerical Columns List */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                Quantitative / Numerical ({dataset.numericalColumns.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {dataset.numericalColumns.length > 0 ? (
                  dataset.numericalColumns.map(col => (
                    <span
                      key={col}
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        color: '#a7f3d0',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                      }}
                    >
                      # {col}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>None detected</span>
                )}
              </div>
            </div>

            {/* Date / Time Columns List */}
            {dataset.dateColumns && dataset.dateColumns.length > 0 && (
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#facc15', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                  Date / Time ({dataset.dateColumns.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {dataset.dateColumns.map(col => (
                    <span
                      key={col}
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(234, 179, 8, 0.12)',
                        color: '#fef08a',
                        border: '1px solid rgba(234, 179, 8, 0.25)',
                      }}
                    >
                      📅 {col}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categorical / ID Columns List */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                Categorical / Identifiers ({dataset.categoricalColumns.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {dataset.categoricalColumns.length > 0 ? (
                  dataset.categoricalColumns.map(col => (
                    <span
                      key={col}
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(168, 85, 247, 0.12)',
                        color: '#e9d5ff',
                        border: '1px solid rgba(168, 85, 247, 0.25)',
                      }}
                    >
                      A {col}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>None</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Data Quality & Integrity Section */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              Data Quality & Mathematical Warnings
            </h3>
            <span className={`badge ${dataset.qualityWarnings.length === 0 ? 'badge-emerald' : 'badge-gold'}`}>
              {dataset.qualityWarnings.length === 0 ? 'Clean Data' : `${dataset.qualityWarnings.length} Alerts`}
            </span>
          </div>

          {dataset.qualityWarnings.length === 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontSize: '0.85rem',
              }}
            >
              <CheckCircle2 size={20} />
              <div>
                <strong>Zero structural anomalies detected.</strong> All numerical columns possess non-zero variance and complete row observations.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '180px', overflowY: 'auto' }}>
              {dataset.qualityWarnings.map((w, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: w.type === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(59, 130, 246, 0.08)',
                    border: `1px solid ${w.type === 'warning' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
                    fontSize: '0.8rem',
                    color: w.type === 'warning' ? '#fde68a' : '#bfdbfe',
                  }}
                >
                  <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{w.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
