import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Calculator,
  Info,
  Sigma,
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowRight,
  Database,
  Upload,
  Activity,
  CheckCircle2,
  Table as TableIcon,
  Sliders,
  TrendingDown,
  TrendingUp,
  Sparkles,
  BookOpen
} from 'lucide-react';
import PhaseNotice from '../components/PhaseNotice';
import StatCard from '../components/StatCard';
import HistogramChart from '../components/HistogramChart';
import BoxPlotChart from '../components/BoxPlotChart';
import DeviationsTable from '../components/DeviationsTable';
import MathExplanationCard from '../components/MathExplanationCard';
import ExpandableCalculation from '../components/ExpandableCalculation';
import DescriptiveDerivationContent from '../components/DescriptiveDerivationContent';
import MathView, { MathText } from '../components/MathView';
import { useDataset } from '../context/DatasetContext';
import { calculateDescriptiveStatistics } from '../statistics/descriptive';

export default function StatisticsPage() {
  const { dataset } = useDataset();
  const [selectedVariable, setSelectedVariable] = useState('');
  const [varianceType, setVarianceType] = useState('sample'); // 'sample' or 'population'
  const [activeTab, setActiveTab] = useState('visuals'); // 'visuals' | 'steps' | 'deviations' | 'frequency'

  // Auto-select first numerical column
  useEffect(() => {
    if (dataset && dataset.numericalColumns.length > 0) {
      if (!selectedVariable || !dataset.numericalColumns.includes(selectedVariable)) {
        setSelectedVariable(dataset.numericalColumns[0]);
      }
    } else {
      setSelectedVariable('');
    }
  }, [dataset, selectedVariable]);

  // Compute descriptive statistics dynamically for the chosen variable
  const stats = useMemo(() => {
    if (!dataset || !selectedVariable) return null;
    const rawColValues = dataset.originalRows.map((r) => r[selectedVariable]);
    return calculateDescriptiveStatistics(rawColValues, selectedVariable);
  }, [dataset, selectedVariable]);

  // State for expandable calculations (Answer First, Calculation on Click)
  const [expandedCalcs, setExpandedCalcs] = useState({
    mean: false,
    median: false,
    mode: false,
    variance: false,
    sd: false,
    range: false,
    iqr: false
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
      mean: nextState,
      median: nextState,
      mode: nextState,
      variance: nextState,
      sd: nextState,
      range: nextState,
      iqr: nextState
    });
  };

  return (
    <div>
      <PhaseNotice
        phase="Phase 3 Live"
        title="Descriptive Statistics Mathematical Engine Active"
        description={
          dataset && stats?.hasData
            ? `Active calculation for [${selectedVariable}]: Valid N = ${stats.n}, Mean = ${stats.mean}, Median = ${stats.median}. Numerical moments and deviations are derived dynamically below.`
            : 'Descriptive calculation engine is active. Load a dataset and pick a numerical variable to begin mathematical derivation.'
        }
        color={dataset ? 'purple' : 'gold'}
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
              No Active Dataset Loaded for Descriptive Statistics
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: '520px', margin: '0 auto' }}>
              Descriptive Statistics computes central tendency, dispersion, quartiles, and deviations from real numerical values. Upload a dataset or choose one of our 5 built-in academic samples.
            </p>
          </div>
          <Link to="/dataset" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}>
            <Upload size={18} />
            <span>Go to Dataset Hub</span>
          </Link>
        </div>
      )}

      {/* No Numerical Columns Available State */}
      {dataset && dataset.numericalColumns.length === 0 && (
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
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fca5a5', marginBottom: '0.5rem' }}>
            No Numerical Variables Found
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '500px', margin: '0 auto 1.25rem auto' }}>
            The active dataset "{dataset.name}" has {dataset.columnCount} columns, but none were classified as continuous quantitative numbers. Statistics requires numerical measurements.
          </p>
          <Link to="/dataset" className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            <span>Upload Different Dataset</span>
          </Link>
        </div>
      )}

      {/* Active Variable & Settings Control Bar */}
      {dataset && dataset.numericalColumns.length > 0 && stats && (
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-purple">Active Metric</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                #{selectedVariable}
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
              {stats.n} valid observations • {stats.excludedCount} excluded / null cells • {stats.skewnessLabel}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Variable Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
                Variable:
              </label>
              <select
                value={selectedVariable}
                onChange={(e) => setSelectedVariable(e.target.value)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 14, 26, 0.9)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
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

            {/* Variance Convention Toggle */}
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
                onClick={() => setVarianceType('sample')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: varianceType === 'sample' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                  color: varianceType === 'sample' ? '#e9d5ff' : '#94a3b8',
                  border: varianceType === 'sample' ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
                }}
              >
                Sample (n - 1)
              </button>
              <button
                type="button"
                onClick={() => setVarianceType('population')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  backgroundColor: varianceType === 'population' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                  color: varianceType === 'population' ? '#cffafe' : '#94a3b8',
                  border: varianceType === 'population' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                }}
              >
                Population (N)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calculated Parameter KPI Grid */}
      {dataset && stats && stats.hasData && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sigma size={20} color="#c084fc" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Summary Statistics Table
              </h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={14} /> Active Dataset N = {stats.n}
              </span>
              <button
                type="button"
                onClick={toggleAllCalcs}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: anyExpanded ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${anyExpanded ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: anyExpanded ? '#e9d5ff' : '#cbd5e1',
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <StatCard
              title="Arithmetic Mean (x̄)"
              value={stats.mean}
              subtitle={`Sum: ${stats.sum} / n: ${stats.n}`}
              icon={BarChart3}
              accentColor="purple"
              badgeText="Center"
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.mean}
              onToggleCalculation={() => toggleCalc('mean')}
            />
            <StatCard
              title="Median (Q₂ / P50)"
              value={stats.median}
              subtitle="50th percentile rank"
              icon={Calculator}
              accentColor="cyan"
              badgeText="Robust"
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.median}
              onToggleCalculation={() => toggleCalc('median')}
            />
            <StatCard
              title="Mode (Mo)"
              value={stats.mode.hasRepeatedMode ? stats.mode.modes.join(', ') : 'None'}
              subtitle={stats.mode.description}
              icon={Layers}
              accentColor="pink"
              badgeText={stats.mode.isMultimodal ? 'Multi' : 'Peak'}
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.mode}
              onToggleCalculation={() => toggleCalc('mode')}
            />
            <StatCard
              title={varianceType === 'sample' ? 'Sample Variance (s²)' : 'Population Variance (σ²)'}
              value={varianceType === 'sample' ? (stats.sampleVariance !== null ? stats.sampleVariance : 'N/A') : stats.populationVariance}
              subtitle={varianceType === 'sample' ? `Divisor: n - 1 = ${stats.n - 1}` : `Divisor: N = ${stats.n}`}
              icon={Sigma}
              accentColor="gold"
              badgeText={varianceType === 'sample' ? 's²' : 'σ²'}
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.variance}
              onToggleCalculation={() => toggleCalc('variance')}
            />
            <StatCard
              title={varianceType === 'sample' ? 'Sample SD (s)' : 'Population SD (σ)'}
              value={varianceType === 'sample' ? (stats.sampleSD !== null ? stats.sampleSD : 'N/A') : stats.populationSD}
              subtitle="Square root of variance"
              icon={Activity}
              accentColor="emerald"
              badgeText={varianceType === 'sample' ? 's' : 'σ'}
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.sd}
              onToggleCalculation={() => toggleCalc('sd')}
            />
            <StatCard
              title="Range (Max - Min)"
              value={stats.range}
              subtitle={`[${stats.min} to ${stats.max}]`}
              icon={Sliders}
              accentColor="purple"
              badgeText="Span"
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.range}
              onToggleCalculation={() => toggleCalc('range')}
            />
            <StatCard
              title="Interquartile Range (IQR)"
              value={stats.iqr}
              subtitle={`Q3 (${stats.q3}) - Q1 (${stats.q1})`}
              icon={Layers}
              accentColor="cyan"
              badgeText="Mid 50%"
              showCalculationButton={true}
              isCalculationExpanded={expandedCalcs.iqr}
              onToggleCalculation={() => toggleCalc('iqr')}
            />
          </div>

          {/* ACTIVE EXPANDED CALCULATIONS SECTION (ANSWER FIRST, CALCULATION ON CLICK) */}
          {anyExpanded && (
            <div
              style={{
                marginTop: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                padding: '1.25rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calculator size={18} color="#c084fc" />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Step-by-Step Mathematical Solutions (Active Selections)
                  </h4>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Click "Hide Calculation" on any card or above to collapse
                </span>
              </div>

              {expandedCalcs.mean && stats.explanations.mean && (
                <ExpandableCalculation
                  title="Arithmetic Mean"
                  conceptName={stats.explanations.mean.conceptName}
                  definition={stats.explanations.mean.definition}
                  formula={stats.explanations.mean.formula}
                  symbols={stats.explanations.mean.symbols}
                  substitution={stats.explanations.mean.substitution}
                  steps={stats.explanations.mean.steps}
                  step={stats.explanations.mean.step}
                  result={stats.explanations.mean.result}
                  interpretation={stats.explanations.mean.interpretation}
                  accentColor="purple"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('mean')}
                >
                  <DescriptiveDerivationContent statKey="mean" stats={stats} />
                </ExpandableCalculation>
              )}

              {expandedCalcs.median && stats.explanations.median && (
                <ExpandableCalculation
                  title="Sample Median"
                  conceptName={stats.explanations.median.conceptName}
                  definition={stats.explanations.median.definition}
                  formula={stats.explanations.median.formula}
                  symbols={stats.explanations.median.symbols}
                  substitution={stats.explanations.median.substitution}
                  steps={stats.explanations.median.steps}
                  step={stats.explanations.median.step}
                  result={stats.explanations.median.result}
                  interpretation={stats.explanations.median.interpretation}
                  accentColor="cyan"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('median')}
                >
                  <DescriptiveDerivationContent statKey="median" stats={stats} />
                </ExpandableCalculation>
              )}

              {expandedCalcs.mode && stats.explanations.mode && (
                <ExpandableCalculation
                  title="Statistical Mode"
                  conceptName={stats.explanations.mode.conceptName}
                  definition={stats.explanations.mode.definition}
                  formula={stats.explanations.mode.formula}
                  symbols={stats.explanations.mode.symbols}
                  substitution={stats.explanations.mode.substitution}
                  steps={stats.explanations.mode.steps}
                  step={stats.explanations.mode.step}
                  result={stats.explanations.mode.result}
                  interpretation={stats.explanations.mode.interpretation}
                  accentColor="pink"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('mode')}
                >
                  <DescriptiveDerivationContent statKey="mode" stats={stats} />
                </ExpandableCalculation>
              )}

              {expandedCalcs.variance && (
                <ExpandableCalculation
                  title={varianceType === 'sample' ? 'Sample Variance' : 'Population Variance'}
                  conceptName={varianceType === 'sample' ? stats.explanations.sampleVariance.conceptName : stats.explanations.populationVariance.conceptName}
                  definition={varianceType === 'sample' ? stats.explanations.sampleVariance.definition : stats.explanations.populationVariance.definition}
                  formula={varianceType === 'sample' ? stats.explanations.sampleVariance.formula : stats.explanations.populationVariance.formula}
                  symbols={varianceType === 'sample' ? stats.explanations.sampleVariance.symbols : stats.explanations.populationVariance.symbols}
                  substitution={varianceType === 'sample' ? stats.explanations.sampleVariance.substitution : stats.explanations.populationVariance.substitution}
                  steps={varianceType === 'sample' ? stats.explanations.sampleVariance.steps : stats.explanations.populationVariance.steps}
                  step={varianceType === 'sample' ? stats.explanations.sampleVariance.step : stats.explanations.populationVariance.step}
                  result={varianceType === 'sample' ? stats.explanations.sampleVariance.result : stats.explanations.populationVariance.result}
                  interpretation={varianceType === 'sample' ? stats.explanations.sampleVariance.interpretation : stats.explanations.populationVariance.interpretation}
                  accentColor="gold"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('variance')}
                >
                  <DescriptiveDerivationContent statKey="variance" stats={stats} varianceType={varianceType} />
                </ExpandableCalculation>
              )}

              {expandedCalcs.sd && (
                <ExpandableCalculation
                  title={varianceType === 'sample' ? 'Sample Standard Deviation' : 'Population Standard Deviation'}
                  conceptName={varianceType === 'sample' ? stats.explanations.sampleSD.conceptName : stats.explanations.populationSD.conceptName}
                  definition={varianceType === 'sample' ? stats.explanations.sampleSD.definition : stats.explanations.populationSD.definition}
                  formula={varianceType === 'sample' ? stats.explanations.sampleSD.formula : stats.explanations.populationSD.formula}
                  symbols={varianceType === 'sample' ? stats.explanations.sampleSD.symbols : stats.explanations.populationSD.symbols}
                  substitution={varianceType === 'sample' ? stats.explanations.sampleSD.substitution : stats.explanations.populationSD.substitution}
                  steps={varianceType === 'sample' ? stats.explanations.sampleSD.steps : stats.explanations.populationSD.steps}
                  step={varianceType === 'sample' ? stats.explanations.sampleSD.step : stats.explanations.populationSD.step}
                  result={varianceType === 'sample' ? stats.explanations.sampleSD.result : stats.explanations.populationSD.result}
                  interpretation={varianceType === 'sample' ? stats.explanations.sampleSD.interpretation : stats.explanations.populationSD.interpretation}
                  accentColor="emerald"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('sd')}
                >
                  <DescriptiveDerivationContent statKey="sd" stats={stats} varianceType={varianceType} />
                </ExpandableCalculation>
              )}

              {expandedCalcs.range && stats.explanations.range && (
                <ExpandableCalculation
                  title="Sample Range"
                  conceptName={stats.explanations.range.conceptName}
                  definition={stats.explanations.range.definition}
                  formula={stats.explanations.range.formula}
                  symbols={stats.explanations.range.symbols}
                  substitution={stats.explanations.range.substitution}
                  steps={stats.explanations.range.steps}
                  step={stats.explanations.range.step}
                  result={stats.explanations.range.result}
                  interpretation={stats.explanations.range.interpretation}
                  accentColor="purple"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('range')}
                >
                  <DescriptiveDerivationContent statKey="range" stats={stats} />
                </ExpandableCalculation>
              )}

              {expandedCalcs.iqr && stats.explanations.iqr && (
                <ExpandableCalculation
                  title="Interquartile Range"
                  conceptName={stats.explanations.iqr.conceptName}
                  definition={stats.explanations.iqr.definition}
                  formula={stats.explanations.iqr.formula}
                  symbols={stats.explanations.iqr.symbols}
                  substitution={stats.explanations.iqr.substitution}
                  steps={stats.explanations.iqr.steps}
                  step={stats.explanations.iqr.step}
                  result={stats.explanations.iqr.result}
                  interpretation={stats.explanations.iqr.interpretation}
                  accentColor="cyan"
                  defaultExpanded={true}
                  onToggle={() => toggleCalc('iqr')}
                >
                  <DescriptiveDerivationContent statKey="iqr" stats={stats} />
                </ExpandableCalculation>
              )}
            </div>
          )}

          {/* Skewness & Central Comparison Banner */}
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(10, 14, 26, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ color: stats.mean >= stats.median ? '#38bdf8' : '#f472b6' }}>
                {stats.mean >= stats.median ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  Distribution Symmetry: {stats.skewnessLabel}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Mean (x̄ = {stats.mean}) vs. Median (Q₂ = {stats.median}) difference: {(stats.mean - stats.median).toFixed(4)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem' }}>
              <span style={{ color: '#94a3b8' }}>P10: <strong style={{ color: '#f8fafc' }}>{stats.percentiles.p10}</strong></span>
              <span>•</span>
              <span style={{ color: '#94a3b8' }}>P25 (Q1): <strong style={{ color: '#38bdf8' }}>{stats.q1}</strong></span>
              <span>•</span>
              <span style={{ color: '#94a3b8' }}>P50: <strong style={{ color: '#fbbf24' }}>{stats.median}</strong></span>
              <span>•</span>
              <span style={{ color: '#94a3b8' }}>P75 (Q3): <strong style={{ color: '#c084fc' }}>{stats.q3}</strong></span>
              <span>•</span>
              <span style={{ color: '#94a3b8' }}>P90: <strong style={{ color: '#f8fafc' }}>{stats.percentiles.p90}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation for Deep Analysis */}
      {dataset && stats && stats.hasData && (
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
                borderBottom: activeTab === 'visuals' ? '2px solid #a855f7' : '2px solid transparent',
                color: activeTab === 'visuals' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <BarChart3 size={16} />
              <span>Distribution Visualizations</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('steps')}
              style={{
                padding: '0.65rem 1.25rem',
                borderBottom: activeTab === 'steps' ? '2px solid #06b6d4' : '2px solid transparent',
                color: activeTab === 'steps' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Calculator size={16} />
              <span>Step-by-Step Derivations</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('deviations')}
              style={{
                padding: '0.65rem 1.25rem',
                borderBottom: activeTab === 'deviations' ? '2px solid #ec4899' : '2px solid transparent',
                color: activeTab === 'deviations' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <TableIcon size={16} />
              <span>Deviations Table (Σ(x - x̄)²)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('frequency')}
              style={{
                padding: '0.65rem 1.25rem',
                borderBottom: activeTab === 'frequency' ? '2px solid #10b981' : '2px solid transparent',
                color: activeTab === 'frequency' ? '#ffffff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Layers size={16} />
              <span>Frequency Distribution Table</span>
            </button>
          </div>

          {/* TAB 1: Visuals (Histogram & Box Plot) */}
          {activeTab === 'visuals' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {/* Histogram Panel */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                      Histogram & Density Distribution
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Frequency binning with Mean and Median reference indicators
                    </p>
                  </div>
                  <span className="badge badge-purple">Recharts</span>
                </div>
                <HistogramChart
                  frequencyDistribution={stats.frequencyDistribution}
                  mean={stats.mean}
                  median={stats.median}
                  columnName={selectedVariable}
                />
              </div>

              {/* Box Plot Panel */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                      Five-Number Summary & Box-and-Whisker Plot
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Min, Q1, Median, Q3, Max, and Tukey 1.5×IQR outlier detection
                    </p>
                  </div>
                  <span className="badge badge-cyan">Box-Whisker</span>
                </div>
                <BoxPlotChart boxPlotData={stats.boxPlot} columnName={selectedVariable} />
              </div>
            </div>
          )}

          {/* TAB 2: Step-by-Step Derivations */}
          {activeTab === 'steps' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
              <MathExplanationCard
                title="1. Arithmetic Mean"
                symbol="x̄"
                definition={stats.explanations.mean.definition}
                formula={stats.explanations.mean.formula}
                symbols={stats.explanations.mean.symbols}
                substitution={stats.explanations.mean.substitution}
                steps={stats.explanations.mean.steps}
                step={stats.explanations.mean.step}
                result={stats.explanations.mean.result}
                interpretation={stats.explanations.mean.interpretation}
                accentColor="purple"
                collapsible={true}
                defaultExpanded={false}
              >
                <DescriptiveDerivationContent statKey="mean" stats={stats} />
              </MathExplanationCard>

              <MathExplanationCard
                title="2. Sample Median"
                symbol="Q₂"
                definition={stats.explanations.median.definition}
                formula={stats.explanations.median.formula}
                symbols={stats.explanations.median.symbols}
                substitution={stats.explanations.median.substitution}
                steps={stats.explanations.median.steps}
                step={stats.explanations.median.step}
                result={stats.explanations.median.result}
                interpretation={stats.explanations.median.interpretation}
                accentColor="cyan"
                collapsible={true}
                defaultExpanded={false}
              >
                <DescriptiveDerivationContent statKey="median" stats={stats} />
              </MathExplanationCard>

              <MathExplanationCard
                title="3. Statistical Mode"
                symbol="Mo"
                definition={stats.explanations.mode.definition}
                formula={stats.explanations.mode.formula}
                symbols={stats.explanations.mode.symbols}
                substitution={stats.explanations.mode.substitution}
                steps={stats.explanations.mode.steps}
                step={stats.explanations.mode.step}
                result={stats.explanations.mode.result}
                interpretation={stats.explanations.mode.interpretation}
                accentColor="pink"
                collapsible={true}
                defaultExpanded={false}
              >
                <DescriptiveDerivationContent statKey="mode" stats={stats} />
              </MathExplanationCard>

              <MathExplanationCard
                title={varianceType === 'sample' ? '4. Sample Variance (Bessel Correction)' : '4. Population Variance'}
                symbol={varianceType === 'sample' ? 's²' : 'σ²'}
                definition={varianceType === 'sample' ? stats.explanations.sampleVariance.definition : stats.explanations.populationVariance.definition}
                formula={varianceType === 'sample' ? stats.explanations.sampleVariance.formula : stats.explanations.populationVariance.formula}
                symbols={varianceType === 'sample' ? stats.explanations.sampleVariance.symbols : stats.explanations.populationVariance.symbols}
                substitution={varianceType === 'sample' ? stats.explanations.sampleVariance.substitution : stats.explanations.populationVariance.substitution}
                steps={varianceType === 'sample' ? stats.explanations.sampleVariance.steps : stats.explanations.populationVariance.steps}
                step={varianceType === 'sample' ? stats.explanations.sampleVariance.step : stats.explanations.populationVariance.step}
                result={varianceType === 'sample' ? stats.explanations.sampleVariance.result : stats.explanations.populationVariance.result}
                interpretation={varianceType === 'sample' ? stats.explanations.sampleVariance.interpretation : stats.explanations.populationVariance.interpretation}
                accentColor="gold"
                collapsible={true}
                defaultExpanded={false}
              >
                <DescriptiveDerivationContent statKey="variance" stats={stats} varianceType={varianceType} />
              </MathExplanationCard>

              <MathExplanationCard
                title={varianceType === 'sample' ? '5. Sample Standard Deviation' : '5. Population Standard Deviation'}
                symbol={varianceType === 'sample' ? 's' : 'σ'}
                definition={varianceType === 'sample' ? stats.explanations.sampleSD.definition : stats.explanations.populationSD.definition}
                formula={varianceType === 'sample' ? stats.explanations.sampleSD.formula : stats.explanations.populationSD.formula}
                symbols={varianceType === 'sample' ? stats.explanations.sampleSD.symbols : stats.explanations.populationSD.symbols}
                substitution={varianceType === 'sample' ? stats.explanations.sampleSD.substitution : stats.explanations.populationSD.substitution}
                steps={varianceType === 'sample' ? stats.explanations.sampleSD.steps : stats.explanations.populationSD.steps}
                step={varianceType === 'sample' ? stats.explanations.sampleSD.step : stats.explanations.populationSD.step}
                result={varianceType === 'sample' ? stats.explanations.sampleSD.result : stats.explanations.populationSD.result}
                interpretation={varianceType === 'sample' ? stats.explanations.sampleSD.interpretation : stats.explanations.populationSD.interpretation}
                accentColor="emerald"
                collapsible={true}
                defaultExpanded={false}
              >
                <DescriptiveDerivationContent statKey="sd" stats={stats} varianceType={varianceType} />
              </MathExplanationCard>

              <MathExplanationCard
                title="6. Sample Range"
                symbol="R"
                definition={stats.explanations.range.definition}
                formula={stats.explanations.range.formula}
                symbols={stats.explanations.range.symbols}
                substitution={stats.explanations.range.substitution}
                steps={stats.explanations.range.steps}
                step={stats.explanations.range.step}
                result={stats.explanations.range.result}
                interpretation={stats.explanations.range.interpretation}
                accentColor="purple"
                collapsible={true}
                defaultExpanded={false}
              >
                <DescriptiveDerivationContent statKey="range" stats={stats} />
              </MathExplanationCard>

              <MathExplanationCard
                title="7. Interquartile Range (IQR)"
                symbol="IQR"
                definition={stats.explanations.iqr.definition}
                formula={stats.explanations.iqr.formula}
                symbols={stats.explanations.iqr.symbols}
                substitution={stats.explanations.iqr.substitution}
                steps={stats.explanations.iqr.steps}
                step={stats.explanations.iqr.step}
                result={stats.explanations.iqr.result}
                interpretation={stats.explanations.iqr.interpretation}
                accentColor="cyan"
                collapsible={true}
                defaultExpanded={false}
              >
                <DescriptiveDerivationContent statKey="iqr" stats={stats} />
              </MathExplanationCard>
            </div>
          )}

          {/* TAB 3: Deviations Table */}
          {activeTab === 'deviations' && (
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  Individual Deviation & Sum of Squares Matrix
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  <MathText text="Demonstrating the fundamental mathematical theorem: deviations from the mean sum to zero (\(\sum (x_i - \bar{x}) = 0\))." />
                </p>
              </div>

              <DeviationsTable
                deviations={stats.deviations}
                mean={stats.mean}
                sumOfSquares={stats.sumOfSquares}
              />
            </div>
          )}

          {/* TAB 4: Frequency Distribution Table */}
          {activeTab === 'frequency' && (
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    Grouped Frequency Distribution Table
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    <MathText text={`Bin intervals generated via Sturges' rule (\\(k = \\lceil 1 + \\log_2(n) \\rceil = ${stats.frequencyDistribution.binCount}\\))`} />
                  </p>
                </div>
                <span className="badge badge-emerald">{stats.frequencyDistribution.binCount} Bins</span>
              </div>

              <div
                style={{
                  overflowX: 'auto',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: 'rgba(10, 14, 26, 0.7)',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#cbd5e1' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Bin Index</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Class Interval [Lower, Upper)</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Midpoint (xᵢ)</th>
                      <th style={{ padding: '0.75rem 1rem', color: '#c084fc' }}>Frequency (fᵢ)</th>
                      <th style={{ padding: '0.75rem 1rem', color: '#38bdf8' }}>Relative Frequency (%)</th>
                      <th style={{ padding: '0.75rem 1rem', color: '#34d399' }}>Cumulative Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.frequencyDistribution.bins.map((bin) => (
                      <tr key={bin.index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)', color: '#64748b' }}>Bin {bin.index}</td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>[{bin.lower}, {bin.upper})</td>
                        <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>{bin.center}</td>
                        <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>{bin.frequency}</td>
                        <td style={{ padding: '0.65rem 1rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{bin.relativeFrequencyPct}%</td>
                        <td style={{ padding: '0.65rem 1rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>{bin.cumulativeFrequency} ({bin.cumulativeFrequencyPct}%)</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderTop: '2px solid rgba(255, 255, 255, 0.12)', fontWeight: 700 }}>
                      <td colSpan={3} style={{ padding: '0.75rem 1rem', color: '#ffffff' }}>Total:</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>Σf = {stats.n}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>100%</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>N = {stats.n}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Axiomatic Formula Reference Panel */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
              Mathematical Notation & Axioms
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Standard statistical reference compliant with university curriculum.
            </p>
          </div>
          <span className="badge badge-purple">Statistical Axioms</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(10, 14, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Sample vs Population Variance Difference:
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Dividing by <code style={{ color: '#c084fc' }}>n - 1</code> instead of <code style={{ color: '#06b6d4' }}>N</code> corrects for downward bias in estimating population variability from samples (Bessel's correction).
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(10, 14, 26, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Quantile Convention (Method 7):
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              INSIGHTX computes percentiles and quartiles using linear interpolation on rank index <code style={{ color: '#fbbf24' }}>(n - 1)p</code>, matching NumPy, R type 7, and Excel PERCENTILE.INC.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
