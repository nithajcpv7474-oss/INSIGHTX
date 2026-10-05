import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GitCompare,
  TrendingUp,
  ScatterChart as ScatterIcon,
  HelpCircle,
  Activity,
  Layers,
  Sparkles,
  Database,
  Upload,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Table as TableIcon,
  Calculator,
  ShieldAlert
} from 'lucide-react';
import PhaseNotice from '../components/PhaseNotice';
import StatCard from '../components/StatCard';
import ScatterPlotChart from '../components/ScatterPlotChart';
import PairedDataTable from '../components/PairedDataTable';
import MathExplanationCard from '../components/MathExplanationCard';
import ExpandableCalculation from '../components/ExpandableCalculation';
import MathView, { MathText } from '../components/MathView';
import { useDataset } from '../context/DatasetContext';
import { calculateCorrelation } from '../statistics/correlation';

export default function CorrelationPage() {
  const { dataset } = useDataset();
  const [varX, setVarX] = useState('');
  const [varY, setVarY] = useState('');
  const [covarianceType, setCovarianceType] = useState('sample'); // 'sample' or 'population'
  const [activeTab, setActiveTab] = useState('visuals'); // 'visuals' | 'steps' | 'table'

  // Auto-populate X and Y with distinct first two numerical variables
  useEffect(() => {
    if (dataset && dataset.numericalColumns.length >= 2) {
      if (!varX || !dataset.numericalColumns.includes(varX)) {
        setVarX(dataset.numericalColumns[0]);
      }
      if (!varY || !dataset.numericalColumns.includes(varY) || varY === dataset.numericalColumns[0]) {
        setVarY(dataset.numericalColumns[1]);
      }
    } else if (dataset && dataset.numericalColumns.length === 1) {
      setVarX(dataset.numericalColumns[0]);
      setVarY(dataset.numericalColumns[0]);
    } else {
      setVarX('');
      setVarY('');
    }
  }, [dataset]);

  // Compute correlation dynamically
  const correlationResults = useMemo(() => {
    if (!dataset || !varX || !varY) return null;
    const rawX = dataset.originalRows.map((r) => r[varX]);
    const rawY = dataset.originalRows.map((r) => r[varY]);
    return calculateCorrelation(rawX, rawY, varX, varY);
  }, [dataset, varX, varY]);

  const isSameVariable = varX === varY && varX !== '';

  const [expandedCalcs, setExpandedCalcs] = useState({
    pearson: false,
    spearman: false,
    cov: false,
    r2: false
  });

  const toggleCalc = (key) => {
    setExpandedCalcs((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const anyExpanded = useMemo(() => {
    return Object.values(expandedCalcs).some(Boolean);
  }, [expandedCalcs]);

  const toggleAllCalcs = () => {
    const nextState = !anyExpanded;
    setExpandedCalcs({
      pearson: nextState,
      spearman: nextState,
      cov: nextState,
      r2: nextState
    });
  };

  return (
    <div>
      <PhaseNotice
        phase="Phase 4 Live"
        title="Bivariate Correlation Analysis Engine Active"
        description={
          dataset && correlationResults?.hasData
            ? `Active bivariate evaluation: X = #${varX}, Y = #${varY}. Pearson r = ${correlationResults.pearsonR ?? 'Undefined'}, Spearman ρ = ${correlationResults.spearmanRho ?? 'Undefined'}. Pairwise complete observations = ${correlationResults.n}.`
            : 'Correlation engine is operational. Load a dataset and configure two continuous numerical variables to measure linear dependency.'
        }
        color={dataset ? 'cyan' : 'gold'}
      />

      {/* No Dataset Loaded State */}
      {!dataset && (
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem',
            marginBottom: '2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            backgroundColor: 'rgba(245, 158, 11, 0.04)',
          }}
        >
          <Database size={40} color="#fbbf24" />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              No Active Dataset Loaded for Correlation
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: '520px', margin: '0 auto' }}>
              Correlation Analysis requires at least two quantitative continuous variables to compute Pearson product-moment, Spearman rank correlation, and covariance matrices.
            </p>
          </div>
          <Link to="/dataset" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
            <Upload size={18} />
            <span>Go to Dataset Hub</span>
          </Link>
        </div>
      )}

      {/* Insufficient Numerical Columns (< 2) State */}
      {dataset && dataset.numericalColumns.length < 2 && (
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
          }}
        >
          <AlertCircle size={36} color="#f87171" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fca5a5', marginBottom: '0.5rem' }}>
            Insufficient Numerical Variables ({dataset.numericalColumns.length} available)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '500px', margin: '0 auto 1.25rem auto' }}>
            Bivariate correlation requires at least 2 distinct continuous numerical columns. Upload a dataset with multiple continuous features or select our Solar, Traffic, or Housing sample datasets.
          </p>
          <Link to="/dataset" className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            <span>Upload or Pick Multivariable Dataset</span>
          </Link>
        </div>
      )}

      {/* Variable Selectors for X and Y */}
      {dataset && dataset.numericalColumns.length >= 2 && (
        <div
          className="glass-panel"
          style={{
            padding: '1.75rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Bivariate Variable Selection
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                Dataset: <strong>{dataset.name}</strong> • Measuring co-variation between independent (X) and dependent (Y)
              </p>
            </div>

            {/* Covariance Definition Toggle */}
            <div
              style={{
                display: 'flex',
                backgroundColor: 'rgba(10, 14, 26, 0.8)',
                padding: '0.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <button
                type="button"
                onClick={() => setCovarianceType('sample')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: covarianceType === 'sample' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                  color: covarianceType === 'sample' ? '#cffafe' : '#94a3b8',
                  border: covarianceType === 'sample' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                }}
              >
                Sample Cov (n - 1)
              </button>
              <button
                type="button"
                onClick={() => setCovarianceType('population')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: covarianceType === 'population' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                  color: covarianceType === 'population' ? '#e9d5ff' : '#94a3b8',
                  border: covarianceType === 'population' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
                }}
              >
                Population Cov (n)
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {/* Variable X Picker */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#22d3ee',
                  marginBottom: '0.5rem',
                }}
              >
                Variable X (Abscissa):
              </label>
              <select
                value={varX}
                onChange={(e) => setVarX(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 14, 26, 0.85)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
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

            {/* Variable Y Picker */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#f472b6',
                  marginBottom: '0.5rem',
                }}
              >
                Variable Y (Ordinate):
              </label>
              <select
                value={varY}
                onChange={(e) => setVarY(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 14, 26, 0.85)',
                  border: '1px solid rgba(236, 72, 153, 0.4)',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
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

          {/* Same-variable advisory notification */}
          {isSameVariable && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.825rem',
                color: '#fde68a',
              }}
            >
              <AlertTriangle size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
              <div>
                <strong>Autocorrelation Notice:</strong> You have selected the same variable (<strong>#{varX}</strong>) for both axes. A variable correlated with itself produces trivial perfect correlation (\(r = 1.000\)). For authentic bivariate insight, select two distinct variables.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Correlation Metric Display Cards */}
      {dataset && correlationResults && correlationResults.hasData && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitCompare size={20} color="#06b6d4" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Bivariate Correlation Coefficients
              </h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={14} /> Pairwise complete: {correlationResults.n} observations ({correlationResults.excludedCount} excluded)
              </span>
              <button
                type="button"
                onClick={toggleAllCalcs}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: anyExpanded ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${anyExpanded ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: anyExpanded ? '#cffafe' : '#cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Calculator size={13} />
                <span>{anyExpanded ? 'Collapse All Solutions' : 'View All Step-by-Step Solutions'}</span>
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.25rem',
            }}
          >
            <StatCard
              title="Pearson Correlation (r)"
              value={correlationResults.pearsonR !== null ? correlationResults.pearsonR : 'Undefined'}
              subtitle="Linear association: -1.0 to +1.0"
              icon={GitCompare}
              accentColor="cyan"
              badgeText="Product-Moment"
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.pearson}
              onToggleCalculation={() => toggleCalc('pearson')}
            />
            <StatCard
              title="Spearman Rank Correlation (ρ)"
              value={correlationResults.spearmanRho !== null ? correlationResults.spearmanRho : 'Undefined'}
              subtitle="Monotonic rank-order association"
              icon={Activity}
              accentColor="purple"
              badgeText="Tied Ranks"
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.spearman}
              onToggleCalculation={() => toggleCalc('spearman')}
            />
            <StatCard
              title={covarianceType === 'sample' ? 'Sample Covariance (Cov_xy)' : 'Population Covariance'}
              value={covarianceType === 'sample' ? (correlationResults.sampleCovariance !== null ? correlationResults.sampleCovariance : 'N/A') : correlationResults.populationCovariance}
              subtitle={covarianceType === 'sample' ? `Divisor: n - 1 = ${correlationResults.n - 1}` : `Divisor: N = ${correlationResults.n}`}
              icon={TrendingUp}
              accentColor="emerald"
              badgeText={covarianceType === 'sample' ? 'n - 1' : 'N'}
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.cov}
              onToggleCalculation={() => toggleCalc('cov')}
            />
            <StatCard
              title="Coefficient of Determination (r²)"
              value={correlationResults.rSquared !== null ? correlationResults.rSquared : 'Undefined'}
              subtitle={correlationResults.explanations.rSquared.pctExplained ? `${correlationResults.explanations.rSquared.pctExplained} variance shared` : 'Linear variance ratio'}
              icon={Layers}
              accentColor="gold"
              badgeText="r²"
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.r2}
              onToggleCalculation={() => toggleCalc('r2')}
            />
          </div>

          {/* ACTIVE EXPANDED CALCULATIONS SECTION (ANSWER FIRST, CALCULATION ON CLICK) */}
          {anyExpanded && (
            <div
              style={{
                marginBottom: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                padding: '1.25rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calculator size={18} color="#22d3ee" />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Step-by-Step Mathematical Solutions (Active Selections)
                  </h4>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Click "Hide Calculation" on any card or above to collapse
                </span>
              </div>

              {expandedCalcs.pearson && correlationResults.explanations.pearson && (
                <ExpandableCalculation
                  title="Pearson Correlation (r)"
                  conceptName={correlationResults.explanations.pearson.conceptName}
                  definition={correlationResults.explanations.pearson.definition}
                  formula={correlationResults.explanations.pearson.formula}
                  symbols={correlationResults.explanations.pearson.symbols}
                  substitution={correlationResults.explanations.pearson.substitution}
                  steps={correlationResults.explanations.pearson.steps}
                  step={correlationResults.explanations.pearson.step}
                  result={correlationResults.explanations.pearson.result}
                  interpretation={correlationResults.explanations.pearson.interpretation}
                  accentColor="cyan"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('pearson')}
                />
              )}

              {expandedCalcs.spearman && correlationResults.explanations.spearman && (
                <ExpandableCalculation
                  title="Spearman Rank Correlation (ρ)"
                  conceptName={correlationResults.explanations.spearman.conceptName}
                  definition={correlationResults.explanations.spearman.definition}
                  formula={correlationResults.explanations.spearman.formula}
                  symbols={correlationResults.explanations.spearman.symbols}
                  substitution={correlationResults.explanations.spearman.substitution}
                  steps={correlationResults.explanations.spearman.steps}
                  step={correlationResults.explanations.spearman.step}
                  result={correlationResults.explanations.spearman.result}
                  interpretation={correlationResults.explanations.spearman.interpretation}
                  accentColor="purple"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('spearman')}
                />
              )}

              {expandedCalcs.cov && (
                <ExpandableCalculation
                  title={covarianceType === 'sample' ? 'Sample Covariance' : 'Population Covariance'}
                  conceptName={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.conceptName : correlationResults.explanations.populationCovariance.conceptName}
                  definition={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.definition : correlationResults.explanations.populationCovariance.definition}
                  formula={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.formula : correlationResults.explanations.populationCovariance.formula}
                  symbols={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.symbols : correlationResults.explanations.populationCovariance.symbols}
                  substitution={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.substitution : correlationResults.explanations.populationCovariance.substitution}
                  steps={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.steps : correlationResults.explanations.populationCovariance.steps}
                  step={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.step : correlationResults.explanations.populationCovariance.step}
                  result={covarianceType === 'sample' ? correlationResults.sampleCovariance : correlationResults.populationCovariance}
                  interpretation={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.interpretation : correlationResults.explanations.populationCovariance.interpretation}
                  accentColor="emerald"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('cov')}
                />
              )}

              {expandedCalcs.r2 && correlationResults.explanations.rSquared && (
                <ExpandableCalculation
                  title="Coefficient of Determination (r²)"
                  conceptName={correlationResults.explanations.rSquared.conceptName}
                  definition={correlationResults.explanations.rSquared.definition}
                  formula={correlationResults.explanations.rSquared.formula}
                  symbols={correlationResults.explanations.rSquared.symbols}
                  substitution={correlationResults.explanations.rSquared.substitution}
                  steps={correlationResults.explanations.rSquared.steps}
                  step={correlationResults.explanations.rSquared.step}
                  result={correlationResults.explanations.rSquared.result}
                  interpretation={correlationResults.explanations.rSquared.interpretation}
                  accentColor="gold"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('r2')}
                />
              )}
            </div>
          )}

          {/* Plain-Language Interpretation & Causation Banner */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(10, 14, 26, 0.7)',
              border: `1px solid ${correlationResults.interpretation.color}40`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    backgroundColor: `${correlationResults.interpretation.color}25`,
                    color: correlationResults.interpretation.color,
                    border: `1px solid ${correlationResults.interpretation.color}50`,
                  }}
                >
                  {correlationResults.interpretation.strength}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  Direction: {correlationResults.interpretation.direction}
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Scale ranges: 0.00–0.19 (Very Weak) • 0.20–0.39 (Weak) • 0.40–0.59 (Mod) • 0.60–0.79 (Strong) • 0.80–1.00 (Very Strong)
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
              {correlationResults.interpretation.summary}
            </p>

            {/* Critical Causation Disclaimer */}
            <div
              style={{
                marginTop: '0.35rem',
                fontSize: '0.78rem',
                color: '#fde68a',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <ShieldAlert size={14} color="#f59e0b" />
              <span>
                <strong>Axiom of Statistical Inference:</strong> <em>Correlation implies association, NOT causation.</em> Confounding lurking variables or coincidence may account for strong empirical correlation.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs for Scatter Plot, Step-by-Step Derivations, and Paired Data Table */}
      {dataset && correlationResults && correlationResults.hasData && (
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('visuals')}
              style={{
                padding: '0.65rem 1.25rem',
                borderBottom: activeTab === 'visuals' ? '2px solid #06b6d4' : '2px solid transparent',
                color: activeTab === 'visuals' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ScatterIcon size={16} />
              <span>Bivariate Scatter Plot Matrix</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('steps')}
              style={{
                padding: '0.65rem 1.25rem',
                borderBottom: activeTab === 'steps' ? '2px solid #a855f7' : '2px solid transparent',
                color: activeTab === 'steps' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Calculator size={16} />
              <span>Step-by-Step Mathematical Derivations</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('table')}
              style={{
                padding: '0.65rem 1.25rem',
                borderBottom: activeTab === 'table' ? '2px solid #ec4899' : '2px solid transparent',
                color: activeTab === 'table' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <TableIcon size={16} />
              <span>Paired Cross-Products Table</span>
            </button>
          </div>

          {/* TAB 1: Visual Scatter Plot */}
          {activeTab === 'visuals' && (
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    Scatter Geometry: #{varX} vs. #{varY}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Visual inspection of linearity, dispersion envelope, and potential bivariate outliers
                  </p>
                </div>
                <span className="badge badge-cyan">Recharts Scatter</span>
              </div>

              <ScatterPlotChart
                pairedRows={correlationResults.pairedRows}
                xName={varX}
                yName={varY}
                trendline={correlationResults.visualTrendline}
              />
            </div>
          )}

          {/* TAB 2: Step-by-Step Derivations */}
          {activeTab === 'steps' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
              <MathExplanationCard
                title="1. Pearson Product-Moment (r)"
                symbol="r"
                conceptName={correlationResults.explanations.pearson.conceptName}
                definition={correlationResults.explanations.pearson.definition}
                formula={correlationResults.explanations.pearson.formula}
                symbols={correlationResults.explanations.pearson.symbols}
                substitution={correlationResults.explanations.pearson.substitution}
                steps={correlationResults.explanations.pearson.steps}
                step={correlationResults.explanations.pearson.step}
                result={correlationResults.explanations.pearson.result}
                interpretation={`Pearson r = ${correlationResults.pearsonR ?? 'Undefined'}. Indicates a ${correlationResults.interpretation.strength.toLowerCase()} ${correlationResults.interpretation.direction.toLowerCase()} linear relationship.`}
                accentColor="cyan"
                collapsible={true}
                defaultExpanded={false}
              />

              <MathExplanationCard
                title="2. Spearman Rank Correlation (ρ)"
                symbol="ρ"
                conceptName={correlationResults.explanations.spearman.conceptName}
                definition={correlationResults.explanations.spearman.definition}
                formula={correlationResults.explanations.spearman.formula}
                symbols={correlationResults.explanations.spearman.symbols}
                substitution={correlationResults.explanations.spearman.substitution}
                steps={correlationResults.explanations.spearman.steps}
                step={correlationResults.explanations.spearman.step}
                result={correlationResults.explanations.spearman.result}
                interpretation={`Spearman ρ = ${correlationResults.spearmanRho ?? 'Undefined'}. Robust against non-linear monotonic shifts and extreme outliers.`}
                accentColor="purple"
                collapsible={true}
                defaultExpanded={false}
              />

              <MathExplanationCard
                title={covarianceType === 'sample' ? '3. Sample Covariance' : '3. Population Covariance'}
                symbol={covarianceType === 'sample' ? 'Cov_{sample}' : 'Cov_{pop}'}
                conceptName={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.conceptName : correlationResults.explanations.populationCovariance.conceptName}
                definition={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.definition : correlationResults.explanations.populationCovariance.definition}
                formula={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.formula : correlationResults.explanations.populationCovariance.formula}
                symbols={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.symbols : correlationResults.explanations.populationCovariance.symbols}
                substitution={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.substitution : correlationResults.explanations.populationCovariance.substitution}
                steps={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.steps : correlationResults.explanations.populationCovariance.steps}
                step={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.step : correlationResults.explanations.populationCovariance.step}
                result={covarianceType === 'sample' ? correlationResults.sampleCovariance : correlationResults.populationCovariance}
                interpretation={covarianceType === 'sample' ? correlationResults.explanations.sampleCovariance.interpretation : correlationResults.explanations.populationCovariance.interpretation}
                accentColor="emerald"
                collapsible={true}
                defaultExpanded={false}
              />

              <MathExplanationCard
                title="4. Coefficient of Determination (r²)"
                symbol="r²"
                conceptName={correlationResults.explanations.rSquared.conceptName}
                definition={correlationResults.explanations.rSquared.definition}
                formula={correlationResults.explanations.rSquared.formula}
                symbols={correlationResults.explanations.rSquared.symbols}
                substitution={correlationResults.explanations.rSquared.substitution}
                steps={correlationResults.explanations.rSquared.steps}
                step={correlationResults.explanations.rSquared.step}
                result={correlationResults.explanations.rSquared.result}
                interpretation={`${correlationResults.explanations.rSquared.pctExplained} of total variance is mutually shared between #${varX} and #${varY}.`}
                accentColor="gold"
                collapsible={true}
                defaultExpanded={false}
              />
            </div>
          )}

          {/* TAB 3: Paired Cross-Products Table */}
          {activeTab === 'table' && (
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  Paired Cross-Product Deviations & Average Ranks Table
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  <MathText text="Individual centered deviations \((x_i - \bar{x})\), \((y_i - \bar{y})\), product terms, and fractional tie ranks." />
                </p>
              </div>

              <PairedDataTable
                pairedRows={correlationResults.pairedRows}
                meanX={correlationResults.meanX}
                meanY={correlationResults.meanY}
                sumCrossProducts={correlationResults.sumCrossProducts}
                sumDevXSquared={correlationResults.sumDevXSquared}
                sumDevYSquared={correlationResults.sumDevYSquared}
                xName={varX}
                yName={varY}
              />
            </div>
          )}
        </div>
      )}

      {/* Axiomatic Mathematical Reference Guide */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              Mathematical Axioms & Interpretation Standards
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Standard correlation guidelines compliant with academic statistical curriculum.
            </p>
          </div>
          <span className="badge badge-cyan">Statistical Axioms</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(10, 14, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.35rem' }}>
              Pearson vs. Spearman Comparison:
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              <strong>Pearson \(r\)</strong> assumes continuous bivariate linear trends. <strong>Spearman \(\rho\)</strong> evaluates rank orders, rendering it non-parametric and robust against monotonic curves and non-normal heavy-tailed distributions.
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(10, 14, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f472b6', marginBottom: '0.35rem' }}>
              Zero-Variance / Constant Column Rule:
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              If either variable has zero variance (\(\sum (x_i - \bar&#123;x&#125;)^2 = 0\)), Pearson correlation produces a zero denominator (\(0/0\)). In INSIGHTX, this is reported as <strong>Undefined</strong> rather than misleadingly returning zero.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
