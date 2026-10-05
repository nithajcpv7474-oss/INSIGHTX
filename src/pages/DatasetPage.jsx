import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileType,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  ShieldCheck,
  Eye,
  FileText,
  Loader2,
  X,
  Sparkles,
  Sun,
  Car,
  Home,
  ShoppingBag,
  Sprout,
  Database
} from 'lucide-react';
import PhaseNotice from '../components/PhaseNotice';
import DatasetIntelligence from '../components/DatasetIntelligence';
import DatasetPreviewTable from '../components/DatasetPreviewTable';
import { useDataset } from '../context/DatasetContext';
import { SAMPLE_DATASETS_CONFIG } from '../data/sampleDatasets';

export default function DatasetPage() {
  const {
    dataset,
    isLoading,
    error,
    success,
    loadDatasetFromFile,
    loadSampleDataset,
    removeDataset,
    clearError,
    clearSuccess,
  } = useDataset();

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      loadDatasetFromFile(file);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      loadDatasetFromFile(file);
      // Reset input value so re-selecting the same file triggers change
      e.target.value = '';
    }
  };

  const getSampleIcon = (id) => {
    switch (id) {
      case 'solar':
        return Sun;
      case 'traffic':
        return Car;
      case 'housing':
        return Home;
      case 'sales':
        return ShoppingBag;
      case 'agriculture':
        return Sprout;
      default:
        return Database;
    }
  };

  return (
    <div>
      <PhaseNotice
        phase="Phase 2 Ingestion"
        title="Dataset Upload, Verification & Processing Active"
        description="Phase 2 is fully operational. In-browser parsing for CSV, XLSX, and XLS formats extracts headers, preserves numeric zeros, detects identifiers, computes missing value rates, and validates data integrity."
        color="cyan"
      />

      {/* Notifications Banner: Success */}
      {success && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            marginBottom: '1.5rem',
            color: '#a7f3d0',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span>{success}</span>
          </div>
          <button
            type="button"
            onClick={clearSuccess}
            style={{ color: '#a7f3d0', padding: '0.2rem' }}
            aria-label="Dismiss success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Notifications Banner: Error */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            marginBottom: '1.5rem',
            color: '#fca5a5',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <AlertCircle size={18} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <strong>Dataset Ingestion Error:</strong> {error}
            </div>
          </div>
          <button
            type="button"
            onClick={clearError}
            style={{ color: '#fca5a5', padding: '0.2rem' }}
            aria-label="Dismiss error message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Active Dataset Intelligence Display */}
      {dataset && (
        <DatasetIntelligence
          dataset={dataset}
          onRemove={removeDataset}
          onReplaceClick={() => fileInputRef.current?.click()}
        />
      )}

      {/* Upload Zone & Guidelines */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2rem',
        }}
      >
        {/* Dropzone Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              {dataset ? 'Replace Active Dataset' : 'Upload Data Source'}
            </h3>
            <span className="badge badge-cyan">.CSV • .XLSX • .XLS</span>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragActive ? '#06b6d4' : 'rgba(255, 255, 255, 0.18)'}`,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: dragActive ? 'rgba(6, 182, 212, 0.1)' : 'rgba(10, 14, 26, 0.5)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: dragActive ? '0 0 25px rgba(6, 182, 212, 0.25)' : 'none',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInput}
              style={{ display: 'none' }}
              aria-label="Upload CSV or Excel file"
            />

            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <Loader2 size={36} color="#06b6d4" className="animate-spin" />
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                  Parsing and validating dataset...
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Extracting headers, inspecting column types, and verifying numerical fidelity.
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(6, 182, 212, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#22d3ee',
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)',
                  }}
                >
                  <Upload size={30} />
                </div>

                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                    Click to browse or drop your dataset here
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#94a3b8', maxWidth: '380px', margin: '0 auto' }}>
                    Compatible with Comma-Separated Values (<code>.csv</code>) and Microsoft Excel workbooks (<code>.xlsx</code>, <code>.xls</code>).
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-outline-cyan"
                  style={{ marginTop: '0.5rem', pointerEvents: 'none' }}
                >
                  Select File from Computer
                </button>
              </>
            )}
          </div>
        </div>

        {/* Upload Guidelines & Instructions */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <ShieldCheck size={22} color="#10b981" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              Dataset Specification Standards
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            To safeguard calculation precision in descriptive statistics, correlation, and linear regression:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ marginTop: '3px', color: '#22d3ee' }}><FileType size={16} /></div>
              <div style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                <strong>First Row Headers:</strong> First non-empty row defines variable names. Duplicate header names are automatically de-duplicated safely.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ marginTop: '3px', color: '#34d399' }}><CheckCircle2 size={16} /></div>
              <div style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                <strong>Valid Zero Preservation:</strong> Numerical zero values (<code>0</code>) are accurately preserved and never treated as missing.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ marginTop: '3px', color: '#c084fc' }}><FileType size={16} /></div>
              <div style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                <strong>Smart Identifier Detection:</strong> Columns containing codes or keys (e.g. <code>student_id</code>) are classified as categorical to prevent nonsensical math.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ marginTop: '3px', color: '#fbbf24' }}><AlertCircle size={16} /></div>
              <div style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                <strong>Missing Value Integrity:</strong> Blank cells, <code>NA</code>, and whitespace are detected and tallied for quality assessment.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Built-in Sample Datasets Gallery */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sparkles size={20} color="#a855f7" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                Instant Sample Datasets
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Explore curated, deterministic datasets prepared for academic statistics demonstrations.
            </p>
          </div>
          <span className="badge badge-purple">5 Built-In Domains</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {SAMPLE_DATASETS_CONFIG.map((sample) => {
            const Icon = getSampleIcon(sample.id);
            const isCurrent = dataset?.name === sample.filename;

            return (
              <div
                key={sample.id}
                style={{
                  borderRadius: '12px',
                  backgroundColor: isCurrent ? 'rgba(168, 85, 247, 0.12)' : 'rgba(10, 14, 26, 0.6)',
                  border: `1px solid ${isCurrent ? '#a855f7' : 'rgba(255, 255, 255, 0.08)'}`,
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: `${sample.color}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: sample.color,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                      {sample.rows.length - 1} rows
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                    {sample.title}
                  </h4>
                  <div style={{ fontSize: '0.72rem', color: sample.color, fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {sample.category}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    {sample.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => loadSampleDataset(sample.id)}
                  disabled={isLoading}
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    backgroundColor: isCurrent ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                    color: isCurrent ? '#f3e8ff' : '#cbd5e1',
                    border: isCurrent ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                >
                  {isCurrent ? (
                    <>
                      <CheckCircle2 size={15} color="#c084fc" />
                      <span>Loaded as Active</span>
                    </>
                  ) : (
                    <>
                      <span>Load Sample</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dataset Preview Section */}
      {dataset ? (
        <DatasetPreviewTable dataset={dataset} />
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Eye size={20} color="#a855f7" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                Dataset Matrix Preview Area
              </h3>
            </div>
            <span className="badge badge-purple">No Data Loaded</span>
          </div>

          <div
            style={{
              borderRadius: '12px',
              backgroundColor: 'rgba(10, 14, 26, 0.7)',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
              }}
            >
              <FileText size={28} />
            </div>

            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                No Data Records Ingested Yet
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '460px', margin: '0 auto', lineHeight: 1.5 }}>
                Upload a CSV or Excel file above, or click any of the 5 instant sample datasets to render an interactive tabular matrix with pagination, search, and type badges.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
