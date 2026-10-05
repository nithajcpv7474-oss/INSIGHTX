import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Layers,
  Hash,
  AlertCircle,
  BarChart2,
  TrendingUp,
  GitCompare,
  Upload,
  ArrowUpRight,
  Database,
  Sparkles,
  CheckCircle2,
  Table,
  ArrowRight,
  Calculator,
  Activity
} from 'lucide-react';
import StatCard from '../components/StatCard';
import PhaseNotice from '../components/PhaseNotice';
import HistogramChart from '../components/HistogramChart';
import ScatterPlotChart from '../components/ScatterPlotChart';
import { useDataset } from '../context/DatasetContext';
import { calculateDescriptiveStatistics } from '../statistics/descriptive';
import { calculateCorrelation } from '../statistics/correlation';
import { calculateRegression } from '../statistics/regression';

export default function DashboardPage() {
  const { dataset } = useDataset();
  const [selectedDashboardVar, setSelectedDashboardVar] = useState('');
  const [dashVarX, setDashVarX] = useState('');
  const [dashVarY, setDashVarY] = useState('');

  // Auto-select numerical variables
  useEffect(() => {
    if (dataset && dataset.numericalColumns.length > 0) {
      if (!selectedDashboardVar || !dataset.numericalColumns.includes(selectedDashboardVar)) {
        setSelectedDashboardVar(dataset.numericalColumns[0]);
      }
      if (dataset.numericalColumns.length >= 2) {
        if (!dashVarX || !dataset.numericalColumns.includes(dashVarX)) {
          setDashVarX(dataset.numericalColumns[0]);
        }
        if (!dashVarY || !dataset.numericalColumns.includes(dashVarY) || dashVarY === dataset.numericalColumns[0]) {
          setDashVarY(dataset.numericalColumns[1]);
        }
      } else {
        setDashVarX(dataset.numericalColumns[0]);
        setDashVarY(dataset.numericalColumns[0]);
      }
    } else {
      setSelectedDashboardVar('');
      setDashVarX('');
      setDashVarY('');
    }
  }, [dataset, selectedDashboardVar, dashVarX, dashVarY]);

  // Compute real descriptive stats for the selected variable
  const activeStats = useMemo(() => {
    if (!dataset || !selectedDashboardVar) return null;
    const rawValues = dataset.originalRows.map((r) => r[selectedDashboardVar]);
    return calculateDescriptiveStatistics(rawValues, selectedDashboardVar);
  }, [dataset, selectedDashboardVar]);

  // Compute real correlation preview if at least 2 distinct numerical variables
  const dashboardCorr = useMemo(() => {
    if (!dataset || !dashVarX || !dashVarY || dataset.numericalColumns.length < 2) return null;
    const rawX = dataset.originalRows.map((r) => r[dashVarX]);
    const rawY = dataset.originalRows.map((r) => r[dashVarY]);
    return calculateCorrelation(rawX, rawY, dashVarX, dashVarY);
  }, [dataset, dashVarX, dashVarY]);

  // Compute real regression preview if at least 2 distinct numerical variables
  const dashboardReg = useMemo(() => {
    if (!dataset || !dashVarX || !dashVarY || dataset.numericalColumns.length < 2) return null;
    const rawX = dataset.originalRows.map((r) => r[dashVarX]);
    const rawY = dataset.originalRows.map((r) => r[dashVarY]);
    return calculateRegression(rawX, rawY, dashVarX, dashVarY);
  }, [dataset, dashVarX, dashVarY]);

  return (
    <div>
      {/* Notice about Analytics Status */}
      <PhaseNotice
        phase="Analytics Suite"
        title="Mathematical Analytics Engines Fully Synchronized"
        description={
          dataset
            ? `Active dataset "${dataset.name}" connected. Descriptive statistics, correlation metrics, and linear regression OLS estimators are calibrated live.`
            : 'No dataset is loaded. Upload a CSV/Excel file or choose one of the 5 built-in academic sample datasets in the Dataset Hub to populate analytics geometry.'
        }
        color={dataset ? 'pink' : 'gold'}
      />

      {/* Primary KPI Metric Cards - Connected to Real Dataset */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard
          title="Dataset Records (N)"
          value={dataset ? dataset.rowCount.toLocaleString() : '—'}
          subtitle={dataset ? 'Active observations' : 'Awaiting dataset upload'}
          icon={FileSpreadsheet}
          accentColor="purple"
          badgeText={dataset ? 'Loaded' : 'Empty'}
        />
        <StatCard
          title="Total Variables"
          value={dataset ? dataset.columnCount : '—'}
          subtitle={dataset ? `${dataset.categoricalColumns.length} categorical / ID` : 'Features in matrix'}
          icon={Layers}
          accentColor="cyan"
          badgeText={dataset ? 'Calculated' : 'Empty'}
        />
        <StatCard
          title="Numerical Columns"
          value={dataset ? dataset.numericalColumns.length : '—'}
          subtitle={dataset ? 'Continuous measures' : 'Valid for math operations'}
          icon={Hash}
          accentColor="emerald"
          badgeText={dataset ? `${((dataset.numericalColumns.length / dataset.columnCount) * 100).toFixed(0)}%` : 'Empty'}
        />
        <StatCard
          title="Missing Values"
          value={dataset ? dataset.missingValueCount : '—'}
          subtitle={dataset ? `${dataset.missingValuePct}% of total cells` : 'Null / NaN integrity check'}
          icon={AlertCircle}
          accentColor={dataset && dataset.missingValueCount > 0 ? 'gold' : 'emerald'}
          badgeText={dataset ? (dataset.missingValueCount === 0 ? '0% Null' : 'Checked') : 'Pending'}
        />
      </div>

      {/* Main Grid: Data Status Hero & Quick Navigation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Active Dataset Status or Empty State Banner */}
        {dataset ? (
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-emerald">Active Ingestion</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{dataset.fileSize}</span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                {dataset.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
                Dataset matrix is ready for mathematical processing. Detected <strong>{dataset.numericalColumns.length} numerical columns</strong> suitable for descriptive statistics, covariance, and linear regression.
              </p>

              {/* Column badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {dataset.numericalColumns.slice(0, 5).map(col => (
                  <span
                    key={col}
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#a7f3d0',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    #{col}
                  </span>
                ))}
                {dataset.numericalColumns.length > 5 && (
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', padding: '0.15rem 0.4rem' }}>
                    +{dataset.numericalColumns.length - 5} more
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/dataset" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.65rem 1.2rem' }}>
                <Table size={16} />
                <span>Inspect Tabular Matrix</span>
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderStyle: 'dashed',
              borderColor: 'rgba(168, 85, 247, 0.35)',
              background: 'linear-gradient(180deg, rgba(18, 27, 49, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                color: '#c084fc',
                boxShadow: '0 0 25px rgba(168, 85, 247, 0.25)',
              }}
            >
              <Database size={32} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
              No Active Dataset Ingested
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#94a3b8',
                maxWidth: '460px',
                marginBottom: '1.75rem',
                lineHeight: 1.6,
              }}
            >
              INSIGHTX adheres to strict mathematical integrity. Upload a CSV/Excel file or choose one of our 5 built-in sample datasets to activate mathematical statistics.
            </p>

            <Link to="/dataset" className="btn-primary">
              <Upload size={18} />
              <span>Go to Dataset Hub</span>
            </Link>
          </div>
        )}

        {/* Syllabus Modules Quick Overview */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              Academic Syllabus Pipeline
            </h3>
            <span className="badge badge-purple">3 Modules</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link
              to="/statistics"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: '#c084fc' }}><BarChart2 size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>
                    Descriptive Statistics
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#a78bfa' }}>
                    {dataset ? `✓ Live Calculation Engine (${dataset.numericalColumns.length} columns)` : 'Mean, Median, Standard Deviation, IQR'}
                  </div>
                </div>
              </div>
              <ArrowUpRight size={18} color="#c084fc" />
            </Link>

            <Link
              to="/correlation"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: '#22d3ee' }}><GitCompare size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>
                    Correlation Analysis
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#22d3ee' }}>
                    {dataset ? `✓ Live Pearson & Spearman Engine (${dataset.numericalColumns.length} columns)` : 'Pearson r, Spearman Rank, Covariance'}
                  </div>
                </div>
              </div>
              <ArrowUpRight size={18} color="#22d3ee" />
            </Link>

            <Link
              to="/regression"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.4)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: '#f472b6' }}><TrendingUp size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>
                    Regression Analysis
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {dataset ? '✓ Live OLS Regression Engine' : 'OLS Line Fitting, R², Beta Estimation'}
                  </div>
                </div>
              </div>
              <ArrowUpRight size={18} color="#94a3b8" />
            </Link>
          </div>
        </div>
      </div>

      {/* Selected Variable Real Descriptive Statistics in Dashboard */}
      {dataset && activeStats && activeStats.hasData && (
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={20} color="#a855f7" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                Active Variable Moments Preview
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Inspect Metric:</span>
              <select
                value={selectedDashboardVar}
                onChange={(e) => setSelectedDashboardVar(e.target.value)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(10, 14, 26, 0.9)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#f8fafc',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {dataset.numericalColumns.map((col) => (
                  <option key={col} value={col}>
                    #{col}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <StatCard
              title="Mean (x̄)"
              value={activeStats.mean}
              subtitle={`Calculated for #${selectedDashboardVar}`}
              icon={BarChart2}
              accentColor="purple"
              badgeText={`#${selectedDashboardVar}`}
            />
            <StatCard
              title="Median (Q₂)"
              value={activeStats.median}
              subtitle={`Calculated for #${selectedDashboardVar}`}
              icon={Calculator}
              accentColor="cyan"
              badgeText={`#${selectedDashboardVar}`}
            />
            <StatCard
              title="Sample SD (s)"
              value={activeStats.sampleSD !== null ? activeStats.sampleSD : 'N/A'}
              subtitle="Unbiased sample dispersion"
              icon={Activity}
              accentColor="emerald"
              badgeText={`#${selectedDashboardVar}`}
            />
            <StatCard
              title="Range (Max - Min)"
              value={activeStats.range}
              subtitle={`Span: [${activeStats.min} to ${activeStats.max}]`}
              icon={Layers}
              accentColor="gold"
              badgeText={`#${selectedDashboardVar}`}
            />
          </div>
        </div>
      )}

      {/* Visualizations Grid: Histogram & Live Bivariate Scatter */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Real Histogram for Selected Variable or Placeholder */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                Univariate Distribution Plot
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {dataset && activeStats?.hasData
                  ? `Frequency histogram for #${selectedDashboardVar}`
                  : 'Histogram & Frequency Distribution'}
              </p>
            </div>
            <span className={`badge ${dataset ? 'badge-purple' : 'badge-gold'}`}>
              {dataset ? 'Active' : 'Pending Data'}
            </span>
          </div>

          {dataset && activeStats?.hasData ? (
            <HistogramChart
              frequencyDistribution={activeStats.frequencyDistribution}
              mean={activeStats.mean}
              median={activeStats.median}
              columnName={selectedDashboardVar}
            />
          ) : (
            <div
              style={{
                height: '240px',
                borderRadius: '12px',
                backgroundColor: 'rgba(10, 14, 26, 0.6)',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                color: '#64748b',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <BarChart2 size={38} strokeWidth={1.5} color="#475569" />
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>
                Chart visualization standby
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '300px' }}>
                Histogram bins and distribution curve will render upon ingesting a dataset.
              </div>
            </div>
          )}
        </div>

        {/* Live Bivariate Scatter Plot or Placeholder */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                Bivariate Scatter & Trendline
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {dashboardCorr?.hasData
                  ? `Scatter plot: #${dashVarX} vs. #${dashVarY} (r = ${dashboardCorr.pearsonR ?? 'N/A'})`
                  : 'Correlation & Scatter Geometry'}
              </p>
            </div>
            <span className={`badge ${dashboardCorr?.hasData ? 'badge-cyan' : 'badge-gold'}`}>
              {dashboardCorr?.hasData ? 'Active' : 'Requires >= 2 Cols'}
            </span>
          </div>

          {dashboardCorr?.hasData ? (
            <ScatterPlotChart
              pairedRows={dashboardCorr.pairedRows}
              xName={dashVarX}
              yName={dashVarY}
              trendline={dashboardCorr.visualTrendline}
            />
          ) : (
            <div
              style={{
                height: '240px',
                borderRadius: '12px',
                backgroundColor: 'rgba(10, 14, 26, 0.6)',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                color: '#64748b',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <TrendingUp size={38} strokeWidth={1.5} color="#475569" />
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>
                Bivariate scatter standby
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '300px' }}>
                Scatter points and linear trend will render when a dataset with at least 2 numerical features is loaded.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compact Regression Summary */}
      {dataset && dashboardReg?.hasData && (
        <div
          className="glass-panel"
          style={{
            marginTop: '2rem',
            padding: '1.75rem',
            borderLeft: '4px solid #ec4899',
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.04) 0%, rgba(168, 85, 247, 0.04) 100%)',
          }}
        >
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <TrendingUp size={20} color="#f472b6" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                Linear Regression Summary
              </h4>
            </div>
            <Link
              to="/regression"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#f472b6',
                textDecoration: 'none',
              }}
            >
              <span>Open Full Regression Engine</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
            Predicting response <strong>#{dashVarY}</strong> from predictor <strong>#{dashVarX}</strong> using Ordinary Least Squares estimation across {dashboardReg.n} observations.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 14, 26, 0.7)',
                border: '1px solid rgba(236, 72, 153, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#f472b6', fontWeight: 700, textTransform: 'uppercase' }}>
                Fitted Equation
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700, marginTop: '0.2rem' }}>
                {dashboardReg.equation}
              </div>
            </div>

            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 14, 26, 0.7)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>
                Goodness of Fit (R²)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700, marginTop: '0.2rem' }}>
                {dashboardReg.rSquared !== null ? dashboardReg.rSquared : 'Indeterminate'}
                {dashboardReg.rSquared !== null && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.4rem' }}>
                    ({(dashboardReg.rSquared * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 14, 26, 0.7)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
                Standard Error (RMSE)
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700, marginTop: '0.2rem' }}>
                {dashboardReg.rmse !== null ? dashboardReg.rmse : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
