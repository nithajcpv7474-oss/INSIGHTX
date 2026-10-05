import React, { useState, useEffect, useMemo } from 'react';
import {
  FlaskConical,
  Sigma,
  BookOpen,
  HelpCircle,
  Layers,
  ChevronRight,
  Code2,
  Database,
  CheckCircle2,
  Clock
} from 'lucide-react';
import PhaseNotice from '../components/PhaseNotice';
import MathView, { MathText } from '../components/MathView';
import { useDataset } from '../context/DatasetContext';
import { calculateDescriptiveStatistics } from '../statistics/descriptive';
import { calculateCorrelation } from '../statistics/correlation';
import { calculateRegression } from '../statistics/regression';

export default function FormulaLabPage() {
  const { dataset } = useDataset();
  const [activeTab, setActiveTab] = useState('module-1');
  const [selectedVar, setSelectedVar] = useState('');
  const [varX, setVarX] = useState('');
  const [varY, setVarY] = useState('');
  const [customX, setCustomX] = useState('');

  // Auto-select variables
  useEffect(() => {
    if (dataset && dataset.numericalColumns.length > 0) {
      if (!selectedVar || !dataset.numericalColumns.includes(selectedVar)) {
        setSelectedVar(dataset.numericalColumns[0]);
      }
      if (dataset.numericalColumns.length >= 2) {
        if (!varX || !dataset.numericalColumns.includes(varX)) {
          setVarX(dataset.numericalColumns[0]);
        }
        if (!varY || !dataset.numericalColumns.includes(varY)) {
          setVarY(dataset.numericalColumns[1]);
        }
      } else {
        setVarX(dataset.numericalColumns[0]);
        setVarY(dataset.numericalColumns[0]);
      }
    } else {
      setSelectedVar('');
      setVarX('');
      setVarY('');
    }
  }, [dataset, selectedVar, varX, varY]);

  // Compute live stats for Module I substitutions
  const liveStats = useMemo(() => {
    if (!dataset || !selectedVar) return null;
    const rawVals = dataset.originalRows.map((r) => r[selectedVar]);
    return calculateDescriptiveStatistics(rawVals, selectedVar);
  }, [dataset, selectedVar]);

  // Compute live correlation for Module IX substitutions
  const liveCorr = useMemo(() => {
    if (!dataset || !varX || !varY) return null;
    const rawX = dataset.originalRows.map((r) => r[varX]);
    const rawY = dataset.originalRows.map((r) => r[varY]);
    return calculateCorrelation(rawX, rawY, varX, varY);
  }, [dataset, varX, varY]);

  // Compute live regression for Module X substitutions
  const liveReg = useMemo(() => {
    if (!dataset || !varX || !varY) return null;
    const rawX = dataset.originalRows.map((r) => r[varX]);
    const rawY = dataset.originalRows.map((r) => r[varY]);
    return calculateRegression(rawX, rawY, varX, varY);
  }, [dataset, varX, varY]);

  const hasCorrVars = dataset && dataset.numericalColumns.length >= 2;

  // Dynamic header description based on active tab and live data
  const getNoticeDesc = () => {
    if (activeTab === 'module-1') {
      return dataset && liveStats?.hasData
        ? `Active mathematical substitutions connected to dataset "${dataset.name}" (variable #${selectedVar}). Descriptive statistics formulas display live algebraic evaluations below.`
        : 'Explore pure mathematical proofs and formulas. Load a dataset to observe live numeric substitutions.';
    }
    if (activeTab === 'module-9') {
      return dataset && hasCorrVars && liveCorr?.hasData
        ? `Active bivariate mathematical substitutions connected to dataset "${dataset.name}" (X: #${varX}, Y: #${varY}). Correlation formulas display live algebraic evaluations below.`
        : 'Explore bivariate covariance, Pearson r, and Spearman rank formulas. Load a dataset with 2+ numerical columns to view live substitutions.';
    }
    return dataset && hasCorrVars && liveReg?.hasData
      ? `Active OLS regression substitutions connected to dataset "${dataset.name}" (Predictor: #${varX}, Response: #${varY}). Regression formulas display live algebraic evaluations below.`
      : 'Explore pure mathematical proofs and derivations for Ordinary Least Squares (OLS) regression. Load a dataset with 2+ numerical columns to view live substitutions.';
  };

  return (
    <div>
      <PhaseNotice
        phase="Phase 5 Integration"
        title="Formula Lab — Mathematical Derivations & Active Substitutions"
        description={getNoticeDesc()}
        color={dataset ? (activeTab === 'module-9' ? 'cyan' : activeTab === 'module-10' ? 'pink' : 'purple') : 'cyan'}
      />

      {/* Module Selector Tabs & Variable Picker */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('module-1')}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: activeTab === 'module-1' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: activeTab === 'module-1' ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeTab === 'module-1' ? '#e9d5ff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Sigma size={16} />
            <span>Statistics {liveStats?.hasData ? '(Live)' : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('module-9')}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: activeTab === 'module-9' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: activeTab === 'module-9' ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeTab === 'module-9' ? '#cffafe' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Layers size={16} />
            <span>Correlation {liveCorr?.hasData ? '(Live)' : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('module-10')}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: activeTab === 'module-10' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: activeTab === 'module-10' ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeTab === 'module-10' ? '#fce7f3' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FlaskConical size={16} />
            <span>Regression {liveReg?.hasData ? '(Live)' : ''}</span>
          </button>
        </div>

        {/* Live Variable Selector for Module I */}
        {activeTab === 'module-1' && dataset && dataset.numericalColumns.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.825rem', color: '#cbd5e1', fontWeight: 600 }}>Active Variable:</span>
            <select
              value={selectedVar}
              onChange={(e) => setSelectedVar(e.target.value)}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 14, 26, 0.9)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#f8fafc',
                fontSize: '0.85rem',
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
        )}

        {/* Live Variable Selectors for Module IX & Module X */}
        {(activeTab === 'module-9' || activeTab === 'module-10') && hasCorrVars && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>X:</span>
              <select
                value={varX}
                onChange={(e) => setVarX(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 14, 26, 0.9)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 700 }}>Y:</span>
              <select
                value={varY}
                onChange={(e) => setVarY(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 14, 26, 0.9)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
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
        )}
      </div>

      {/* MODULE I: DESCRIPTIVE STATISTICS (LIVE INTEGRATION) */}
      {activeTab === 'module-1' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Card 1: Mean */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #a855f7' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Arithmetic Mean (Ungrouped)
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="\\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i" block />
            </div>

            {/* Live Substitution Box */}
            {liveStats?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(168, 85, 247, 0.08)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution [#{selectedVar}]
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#f8fafc' }}>
                  {liveStats.explanations.mean.substitution} = <strong style={{ color: '#fbbf24' }}>{liveStats.mean}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {liveStats.explanations.mean.step}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> The unique center of mass where the algebraic sum of deviations <MathText text="\sum (x_i - \\bar{x}) = 0" />.
            </p>
          </div>

          {/* Card 2: Median */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #06b6d4' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Sample Median (50th Percentile Q₂)
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="\\tilde{x} = x_{(\\frac{n+1}{2})} \\text{ (odd)} \\quad | \\quad \\frac{x_{(\\frac{n}{2})} + x_{(\\frac{n}{2}+1)}}{2} \\text{ (even)}" block />
            </div>

            {/* Live Substitution Box */}
            {liveStats?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution [#{selectedVar}]
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#f8fafc' }}>
                  {liveStats.explanations.median.substitution}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {liveStats.explanations.median.step}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> The middle magnitude observation dividing ordered sample values into two equal halves.
            </p>
          </div>

          {/* Card 3: Sample Variance */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Sample Variance (s²) & Bessel's Correction
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="s^2 = \\frac{1}{n-1}\\sum_{i=1}^n (x_i - \\bar{x})^2" block />
            </div>

            {/* Live Substitution Box */}
            {liveStats?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution [#{selectedVar}]
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#f8fafc' }}>
                  {liveStats.explanations.sampleVariance.substitution} = <strong style={{ color: '#fbbf24' }}>{liveStats.sampleVariance}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {liveStats.explanations.sampleVariance.step}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> An unbiased estimator of population variance dividing sum of squared deviations by degrees of freedom <MathText text="n - 1" />.
            </p>
          </div>

          {/* Card 4: Standard Deviation */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Sample Standard Deviation (s)
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="s = \\sqrt{s^2} = \\sqrt{\\frac{\\sum_{i=1}^n (x_i - \\bar{x})^2}{n - 1}}" block />
            </div>

            {/* Live Substitution Box */}
            {liveStats?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution [#{selectedVar}]
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#f8fafc' }}>
                  {liveStats.explanations.sampleSD.substitution} = <strong style={{ color: '#34d399' }}>{liveStats.sampleSD}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  {liveStats.explanations.sampleSD.step}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> Root mean squared deviation, returning variability measurements to the original physical scale of observation.
            </p>
          </div>
        </div>
      )}

      {/* MODULE IX: CORRELATION (LIVE INTEGRATION) */}
      {activeTab === 'module-9' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {liveCorr?.hasData ? (
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <CheckCircle2 size={18} color="#22d3ee" />
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                <strong>Active Bivariate Analysis:</strong> Evaluating #{varX} vs #{varY} across {liveCorr.n} valid pairs
                {liveCorr.excludedCount > 0 && ` (${liveCorr.excludedCount} invalid/missing rows excluded)`}.
                {varX === varY && ' (Note: Identical variables selected — autocorrelation analysis).' }
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <BookOpen size={18} color="#22d3ee" />
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                <strong>Correlation Mathematical Formulas:</strong> Load or select a dataset with at least 2 numerical variables to observe live algebraic substitutions.
              </div>
            </div>
          )}

          {/* Card 1: Covariance */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #06b6d4' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Bivariate Covariance — Sample & Population
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="Cov_{sample}(X, Y) = \\frac{1}{n - 1}\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y}) \\qquad Cov_{pop}(X, Y) = \\frac{1}{n}\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})" block />
            </div>

            {liveCorr?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution [#{varX} & #{varY}]
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                  {liveCorr.explanations.sampleCovariance.substitution} = <strong style={{ color: '#38bdf8' }}>{liveCorr.sampleCovariance ?? 'N/A'}</strong> (Sample)
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                  {liveCorr.explanations.populationCovariance.substitution} = <strong style={{ color: '#22d3ee' }}>{liveCorr.populationCovariance}</strong> (Population)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Sum of cross-products <MathView math="SP_{xy} = \sum (x_i - \bar{x})(y_i - \bar{y}) =" inline /> {liveCorr.sumCrossProducts}. Divided by degrees of freedom {liveCorr.n - 1} for sample vs {liveCorr.n} for population.
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> Covariance measures the joint variability of two random variables. A positive value indicates that larger values of X correspond on average to larger values of Y, while a negative value indicates inverse co-movement.
            </p>
          </div>

          {/* Card 2: Pearson Correlation */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #a855f7' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Pearson Product-Moment Correlation Coefficient (r)
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\cdot \\sum (y_i - \\bar{y})^2}} = \\frac{SP_{xy}}{\\sqrt{SS_x \\cdot SS_y}}" block />
            </div>

            {liveCorr?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(168, 85, 247, 0.08)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution [#{varX} & #{varY}]
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.35rem' }}>
                  {liveCorr.explanations.pearson.substitution} = <strong style={{ color: '#e9d5ff' }}>{liveCorr.pearsonR ?? 'Undefined'}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                  {liveCorr.explanations.pearson.step}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: liveCorr.interpretation.color + '22',
                      color: liveCorr.interpretation.color,
                      border: `1px solid ${liveCorr.interpretation.color}55`,
                    }}
                  >
                    {liveCorr.interpretation.strength} {liveCorr.interpretation.direction}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {liveCorr.interpretation.summary}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontSize: '0.75rem',
                    color: '#fef3c7',
                  }}
                >
                  <strong>Statistical Warning:</strong> Correlation measures linear co-variation, not causal dependence. Latent confounding variables may account for high correlation.
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> The standardized cross-product of deviations, invariant to linear rescaling and strictly bounded by the Cauchy-Schwarz inequality between -1.0 and +1.0.
            </p>
          </div>

          {/* Card 3: Coefficient of Determination */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Coefficient of Determination (r²)
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="r^2 = (r)^2 = \\frac{\\text{Explained Variance}}{\\text{Total Variance}}" block />
            </div>

            {liveCorr?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution [#{varX} & #{varY}]
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                  {liveCorr.explanations.rSquared.substitution} = <strong style={{ color: '#fbbf24' }}>{liveCorr.rSquared ?? 'Undefined'}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Approximately <strong style={{ color: '#fbbf24' }}>{liveCorr.explanations.rSquared.pctExplained}</strong> of the total variance in #{varY} can be linearly predicted or explained by #{varX}.
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> The square of Pearson's correlation representing the proportion of variance in the dependent variable explained by linear association with the independent variable.
            </p>
          </div>

          {/* Card 4: Spearman Rank Correlation */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Spearman Rank Correlation Coefficient (ρ)
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="\\rho = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)} \\quad \\text{(untied ranks)} \\qquad \\rho = \\text{Pearson}(R_X, R_Y) \\quad \\text{(tied ranks)}" block />
            </div>

            {liveCorr?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution [#{varX} & #{varY}]
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                  <MathView math="\rho =" inline /> <strong style={{ color: '#34d399' }}>{liveCorr.spearmanRho ?? 'Undefined'}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {liveCorr.explanations.spearman.step} Fractional average ranks are assigned to repeated values, ensuring rigorous statistical estimation without tie bias.
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> A non-parametric measure of monotonic relationship between two ranked variables, robust to non-linear monotonic stretches and heavy-tailed extreme outliers.
            </p>
          </div>
        </div>
      )}

      {/* MODULE X: REGRESSION (LIVE INTEGRATION) */}
      {activeTab === 'module-10' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {liveReg?.hasData ? (
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(236, 72, 153, 0.08)',
                border: '1px solid rgba(236, 72, 153, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <CheckCircle2 size={18} color="#f472b6" />
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                <strong>Active OLS Regression Analysis:</strong> Calibrated using #{varX} (Predictor) to estimate #{varY} (Response) across {liveReg.n} valid pairs
                {liveReg.excludedCount > 0 && ` (${liveReg.excludedCount} invalid/missing rows excluded)`}.
                {varX === varY && ' (Note: Identical variables selected — autocorrelation analysis).' }
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(236, 72, 153, 0.08)',
                border: '1px solid rgba(236, 72, 153, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <BookOpen size={18} color="#f472b6" />
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                <strong>Regression Mathematical Formulas:</strong> Load or select a dataset with at least 2 numerical variables to observe live algebraic substitutions.
              </div>
            </div>
          )}

          {/* Interactive Prediction Sandbox */}
          {liveReg?.hasData && !liveReg.isUndefined && (
            <div
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderLeft: '4px solid #ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                  Interactive Model Extrapolation Sandbox
                </h4>
                <span className="badge badge-pink">Live Prediction</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                Enter an arbitrary value for predictor \(X\) (#{varX}) to evaluate the calibrated model hyperplane:
              </p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.825rem', color: '#f8fafc', fontWeight: 600 }}>
                    X Value:
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={customX}
                    onChange={(e) => setCustomX(e.target.value)}
                    placeholder={`e.g. ${liveReg.meanX}`}
                    style={{
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(10, 14, 26, 0.8)',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#f8fafc' }}>
                  <MathView math="\hat{y} =" inline /> <strong style={{ color: '#fbbf24' }}>
                    {customX !== '' && liveReg.predict(customX) !== null ? liveReg.predict(customX) : '—'}
                  </strong>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fbcfe8', marginTop: '0.65rem' }}>
                ⚠️ <strong>Model Estimate Notice:</strong> Predicted values represent linear expectations <MathView math="\hat{y} = b_0 + b_1 x" inline /> conditional on the sample data. Extrapolations beyond the observed range of #{varX} may yield unverified estimates.
              </div>
            </div>
          )}

          {/* Card 1: Slope */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #a855f7' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                OLS Slope Coefficient (b₁)
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="b_1 = \\frac{\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum_{i=1}^n (x_i - \\bar{x})^2} = \\frac{SP_{xy}}{SS_x}" block />
            </div>

            {liveReg?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(168, 85, 247, 0.08)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution [#{varX} → #{varY}]
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                  {liveReg.explanations.slope.substitution}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {liveReg.explanations.slope.step}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> The rate of change in response variable <MathText text="Y" /> per unit increment in predictor variable <MathText text="X" />.
            </p>
          </div>

          {/* Card 2: Intercept */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #06b6d4' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Regression Intercept (b₀)
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="b_0 = \\bar{y} - b_1 \\bar{x}" block />
            </div>

            {liveReg?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                  {liveReg.explanations.intercept.substitution}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {liveReg.explanations.intercept.step}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> The baseline response <MathView math="\hat{y}" inline /> when <MathView math="X = 0" inline />, ensuring the fitted line passes through the bivariate center of mass <MathView math="(\bar{x}, \bar{y})" inline />.
            </p>
          </div>

          {/* Card 3: Regression Equation */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #ec4899' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Fitted Regression Model Equation
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="\\hat{y} = b_0 + b_1 x" block />
            </div>

            {liveReg?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(236, 72, 153, 0.08)',
                  border: '1px solid rgba(236, 72, 153, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f472b6', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Calibrated OLS Line
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.3rem' }}>
                  <MathText text={liveReg.equation} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {liveReg.explanations.equation.step}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> The mathematical hyperplane that uniquely minimizes the vertical squared distances <MathText text="\sum (y_i - \hat{y}_i)^2" />.
            </p>
          </div>

          {/* Card 4: Residuals */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Residual Errors & Zero Mean Property
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="e_i = y_i - \\hat{y}_i \\qquad \\sum_{i=1}^n e_i = 0 \\qquad \\bar{e} = 0" block />
            </div>

            {liveReg?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                  Sum of Residuals: <MathView math="\sum e_i =" inline /> <strong style={{ color: '#fbbf24' }}>{liveReg.residualSum}</strong> | Mean Residual: <MathView math="\bar{e} =" inline /> <strong style={{ color: '#fbbf24' }}>{liveReg.residualMean}</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Due to the first-order normal equations of least-squares, the algebraic sum of residuals is analytically equal to zero.
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> The vertical deviation between the empirically observed response <MathText text="y_i" /> and the fitted linear model <MathView math="\hat{y}_i" inline />.
            </p>
          </div>

          {/* Card 5: R² and Adjusted R² */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Coefficient of Determination (R²) & Adjusted R²
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="R^2 = 1 - \\frac{SSE}{SST} = \\frac{SSR}{SST} \\qquad R^2_{adj} = 1 - \\frac{(1 - R^2)(n - 1)}{n - 2}" block />
            </div>

            {liveReg?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                  {liveReg.explanations.rSquared.substitution}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                  {liveReg.explanations.adjRSquared.substitution}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {liveReg.explanations.rSquared.step}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> The proportion of the total variation in response <MathText text="Y" /> that is explained by its linear relationship with predictor <MathText text="X" />.
            </p>
          </div>

          {/* Card 6: RMSE and MAE */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Error Metrics: Root Mean Squared Error (RMSE) & MAE
              </h3>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <MathView math="RMSE = \\sqrt{\\frac{1}{n}\\sum_{i=1}^n e_i^2} = \\sqrt{MSE} \\qquad MAE = \\frac{1}{n}\\sum_{i=1}^n |e_i|" block />
            </div>

            {liveReg?.hasData && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Live Dataset Substitution
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                  {liveReg.explanations.rmse.substitution} | {liveReg.explanations.mae.substitution}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {liveReg.explanations.rmse.step}
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Definition:</strong> RMSE penalizes large deviation outliers more heavily due to quadratic squaring, while MAE represents the average linear magnitude of prediction residuals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
