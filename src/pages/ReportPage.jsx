import React from 'react';
import {
  FileText,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  BookOpen,
  Database,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PhaseNotice from '../components/PhaseNotice';
import { useDataset } from '../context/DatasetContext';

export default function ReportPage() {
  const { dataset } = useDataset();

  return (
    <div>
      <PhaseNotice
        phase="Phase 6 Roadmap"
        title="Comprehensive Academic Report Engine"
        description={
          dataset
            ? `Active dataset "${dataset.name}" connected (${dataset.rowCount} records, ${dataset.columnCount} variables). In Phase 6, automated PDF rendering, chart image embedding, and academic conclusions will be generated.`
            : 'No dataset is loaded. Upload a CSV/Excel file or choose a sample dataset in the Dataset Hub to configure report telemetry.'
        }
        color={dataset ? 'emerald' : 'gold'}
      />

      {/* Action Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
            Academic Research Report Document
          </h2>
          <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
            {dataset
              ? `Mathematical documentation generated for active dataset: ${dataset.name}`
              : 'Structured mathematical documentation formatted for project defense and presentation.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.1rem' }}
            onClick={() => alert('PDF export compilation will be activated in Phase 6.')}
          >
            <Printer size={16} />
            <span>Print Layout</span>
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}
            onClick={() => alert('Automated LaTeX & PDF generation will be activated in Phase 6.')}
          >
            <Download size={16} />
            <span>Export PDF (Phase 6)</span>
          </button>
        </div>
      </div>

      {/* Academic Paper Sheet Preview Container */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          backgroundColor: '#0d1527',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '3.5rem 3rem',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Academic Header Banner */}
        <div
          style={{
            borderBottom: '2px solid rgba(255, 255, 255, 0.15)',
            paddingBottom: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#06b6d4',
              marginBottom: '0.5rem',
            }}
          >
            Mathematics Department • Final-Year Analytics Project
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.25,
              marginBottom: '0.75rem',
            }}
          >
            Mathematical Data Analytics & Inference Report
          </h1>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1.25rem',
              fontSize: '0.85rem',
              color: '#94a3b8',
              flexWrap: 'wrap',
            }}
          >
            <span><strong>Target Dataset:</strong> <span style={{ color: dataset ? '#34d399' : '#f87171' }}>{dataset ? dataset.name : 'None Loaded'}</span></span>
            <span>•</span>
            <span><strong>Records (N):</strong> {dataset ? dataset.rowCount : 0}</span>
            <span>•</span>
            <span><strong>Domain:</strong> Mathematical Analytics</span>
          </div>
        </div>

        {/* Section 1: Executive Overview */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#c084fc',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              borderLeft: '3px solid #a855f7',
              paddingLeft: '0.65rem',
            }}
          >
            1. Executive Mathematical Abstract
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.7 }}>
            {dataset ? (
              <>
                This formal academic report evaluates the dataset <strong>{dataset.name}</strong>, comprising <strong>{dataset.rowCount}</strong> valid observations across <strong>{dataset.columnCount}</strong> total variables ({dataset.numericalColumns.length} numerical features, {dataset.categoricalColumns.length} categorical/identifier columns). The analytical pipeline strictly models univariate statistical moments, bivariate correlation matrices, and Ordinary Least Squares linear regression fits.
              </>
            ) : (
              'This technical document provides formal mathematical summaries and empirical insights derived from tabular datasets. The analysis strictly encompasses univariate statistical moments, bivariate correlation matrices, and Ordinary Least Squares linear regression fits.'
            )}
          </p>
        </div>

        {/* Section 2: Descriptive Statistics Summary */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#22d3ee',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              borderLeft: '3px solid #06b6d4',
              paddingLeft: '0.65rem',
            }}
          >
            2. Descriptive Statistics Summary
          </h3>
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(10, 14, 26, 0.5)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '0.85rem',
            }}
          >
            {dataset
              ? `Descriptive dispersion metrics for [${dataset.numericalColumns.slice(0, 4).join(', ')}] will populate here upon Phase 3 calculation activation.`
              : 'Statistical dispersion metrics (Mean, Median, Variance, Standard Deviation, IQR) will populate here after dataset ingestion in Phase 3.'}
          </div>
        </div>

        {/* Section 3: Correlation Summary */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#f472b6',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              borderLeft: '3px solid #ec4899',
              paddingLeft: '0.65rem',
            }}
          >
            3. Correlation Analysis Matrix
          </h3>
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(10, 14, 26, 0.5)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '0.85rem',
            }}
          >
            {dataset
              ? `Pearson r and Spearman ρ correlation coefficients for ${dataset.numericalColumns.length} numerical variables will be tabulated in Phase 4.`
              : 'Pearson r and Spearman ρ coefficients will be tabulated with significance hypotheses testing in Phase 4.'}
          </div>
        </div>

        {/* Section 4: Regression Summary */}
        <div style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#fbbf24',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              borderLeft: '3px solid #f59e0b',
              paddingLeft: '0.65rem',
            }}
          >
            4. Linear Regression & Predictive Model
          </h3>
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(10, 14, 26, 0.5)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '0.85rem',
            }}
          >
            Fitted line equations ŷ = β₀ + β₁x and coefficient of determination R² will be tabulated in Phase 5.
          </div>
        </div>

        {/* Verification Footer */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: '#64748b',
          }}
        >
          <div>INSIGHTX Academic Certification</div>
          <div>Page 1 of 1 • Phase 2 Verified</div>
        </div>
      </div>
    </div>
  );
}
