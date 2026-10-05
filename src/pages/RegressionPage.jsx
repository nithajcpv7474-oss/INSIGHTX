import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Sliders,
  Target,
  LineChart as LineChartIcon,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Database,
  Upload,
  AlertTriangle,
  Layers,
  Calculator,
  Table,
  Activity,
  CheckCircle2,
  Info
} from 'lucide-react';
import PhaseNotice from '../components/PhaseNotice';
import StatCard from '../components/StatCard';
import { useDataset } from '../context/DatasetContext';
import { calculateRegression } from '../statistics/regression';
import RegressionLineChart from '../components/RegressionLineChart';
import ResidualPlotChart from '../components/ResidualPlotChart';
import RegressionDataTable from '../components/RegressionDataTable';
import ExpandableCalculation from '../components/ExpandableCalculation';
import RegressionDerivationContent from '../components/RegressionDerivationContent';
import MathView, { MathText } from '../components/MathView';

export default function RegressionPage() {
  const { dataset } = useDataset();
  const [indepVar, setIndepVar] = useState('');
  const [depVar, setDepVar] = useState('');
  const [predictionInput, setPredictionInput] = useState('');
  const [activeTab, setActiveTab] = useState('chart');

  // Auto-populate Independent X and Dependent Y with first two numerical variables
  useEffect(() => {
    if (dataset && dataset.numericalColumns.length >= 2) {
      if (!indepVar || !dataset.numericalColumns.includes(indepVar)) {
        setIndepVar(dataset.numericalColumns[0]);
      }
      if (!depVar || !dataset.numericalColumns.includes(depVar) || (depVar === dataset.numericalColumns[0] && dataset.numericalColumns.length > 1 && !dataset.numericalColumns.includes(indepVar))) {
        setDepVar(dataset.numericalColumns[1]);
      }
    } else if (dataset && dataset.numericalColumns.length === 1) {
      setIndepVar(dataset.numericalColumns[0]);
      setDepVar('');
    } else {
      setIndepVar('');
      setDepVar('');
    }
  }, [dataset]);

  // Compute live regression results
  const regResults = useMemo(() => {
    if (!dataset || !indepVar || !depVar) return null;
    const rawX = dataset.originalRows.map((r) => r[indepVar]);
    const rawY = dataset.originalRows.map((r) => r[depVar]);
    return calculateRegression(rawX, rawY, indepVar, depVar);
  }, [dataset, indepVar, depVar]);

  // Live arbitrary prediction
  const predictedValue = useMemo(() => {
    if (!regResults || !regResults.hasData || regResults.isUndefined || predictionInput === '') {
      return null;
    }
    return regResults.predict(predictionInput);
  }, [regResults, predictionInput]);

  const hasEnoughCols = dataset && dataset.numericalColumns.length >= 2;
  const isAutocorrelation = indepVar && depVar && indepVar === depVar;

  const [expandedCalcs, setExpandedCalcs] = useState({
    slope: false,
    intercept: false,
    r2: false,
    rmse: false
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
      slope: nextState,
      intercept: nextState,
      r2: nextState,
      rmse: nextState
    });
  };

  return (
    <div>
      <PhaseNotice
        phase="Phase 5 Complete"
        title="Linear Regression Modeling & Estimation Engine"
        description={
          dataset && regResults?.hasData
            ? `Active OLS model fitted on dataset "${dataset.name}": predicting ${depVar} (Response) from ${indepVar} (Predictor) across ${regResults.n} paired observations.`
            : 'No dataset is loaded. Upload a CSV/Excel file or choose a sample dataset in the Dataset Hub to fit linear models.'
        }
        color={dataset ? 'pink' : 'gold'}
      />

      {/* No Dataset Warning Prompt */}
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
            gap: '1.25rem',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            backgroundColor: 'rgba(245, 158, 11, 0.04)',
          }}
        >
          <Database size={40} color="#fbbf24" />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
              No Active Dataset Available for Regression
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
              Regression Analysis requires continuous numerical variables to calculate Ordinary Least Squares (OLS) slope, intercept, and ANOVA variance partitioning.
            </p>
          </div>
          <Link to="/dataset" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.75rem 1.5rem' }}>
            <Upload size={16} />
            <span>Go to Dataset Hub</span>
          </Link>
        </div>
      )}

      {/* Insufficient Numerical Columns Warning */}
      {dataset && !hasEnoughCols && (
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
            borderColor: 'rgba(236, 72, 153, 0.3)',
            backgroundColor: 'rgba(236, 72, 153, 0.04)',
          }}
        >
          <AlertTriangle size={36} color="#f472b6" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
            At Least 2 Numerical Variables Required
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
            The active dataset contains only {dataset.numericalColumns.length} quantitative variable. Regression requires both a predictor (X) and response (Y).
          </p>
        </div>
      )}

      {/* Regression Variable Configuration & Causation Warning */}
      {dataset && hasEnoughCols && (
        <>
          <div
            className="glass-panel"
            style={{
              padding: '1.75rem',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                Linear Regression Model Specification
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Dataset: <strong>{dataset.name}</strong> • Specify the predictor (X) and response (Y) variables.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                alignItems: 'center',
              }}
            >
              {/* Independent Var X */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#38bdf8',
                    marginBottom: '0.5rem',
                  }}
                >
                  Predictor / Independent Variable (X):
                </label>
                <select
                  value={indepVar}
                  onChange={(e) => setIndepVar(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(10, 14, 26, 0.8)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {dataset.numericalColumns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dependent Var Y */}
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
                  Response / Dependent Variable (Y):
                </label>
                <select
                  value={depVar}
                  onChange={(e) => setDepVar(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(10, 14, 26, 0.8)',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {dataset.numericalColumns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Methodological Note Informational Banner */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1.15rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Info size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.825rem', color: '#e0f2fe', lineHeight: 1.5 }}>
                <strong style={{ color: '#38bdf8' }}>Methodological Note:</strong> Linear regression describes the mathematical association between X and Y and estimates the expected value of Y (<MathText text="\hat{y}" />) for a given X. A fitted regression model does not by itself establish causal direction.
              </div>
            </div>

            {/* Autocorrelation Advisory */}
            {isAutocorrelation && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  fontSize: '0.8rem',
                  color: '#fbbf24',
                }}
              >
                ⚠️ <strong>Autocorrelation Selected:</strong> Predictor and Response are identical ({indepVar}). Slope = 1.0, Intercept = 0.0, R² = 1.0, and residuals are identically zero.
              </div>
            )}
          </div>

          {/* Constant Predictor X Warning */}
          {regResults?.isXConstant && (
            <div
              className="glass-panel"
              style={{
                padding: '1.5rem',
                marginBottom: '1.75rem',
                borderColor: 'rgba(244, 63, 94, 0.4)',
                backgroundColor: 'rgba(244, 63, 94, 0.06)',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f87171', marginBottom: '0.5rem' }}>
                Constant Predictor Variable (Zero Variance)
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                All observed values in column <strong>{indepVar}</strong> are identical ({regResults.meanX}).
                The denominator <MathText text="SS_x = \sum (x_i - \bar{x})^2 = 0" />, rendering the slope <MathText text="\beta_1 = SP_{xy} / 0" /> mathematically undefined.
              </p>
            </div>
          )}

          {/* Constant Response Y Advisory */}
          {regResults?.isYConstant && (
            <div
              className="glass-panel"
              style={{
                padding: '1.5rem',
                marginBottom: '1.75rem',
                borderColor: 'rgba(245, 158, 11, 0.4)',
                backgroundColor: 'rgba(245, 158, 11, 0.06)',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.5rem' }}>
                Constant Response Variable (Zero Variance)
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                All observed values in column <strong>{depVar}</strong> are identical ({regResults.meanY}).
                The slope <MathText text="\beta_1 = 0" /> and intercept <MathText text={`\\beta_0 = ${regResults.meanY}`} />. The total sum of squares <MathText text="SST = 0" />, so <MathText text="R^2" /> is mathematically indeterminate (0/0).
              </p>
            </div>
          )}

          {/* Regression KPI Stat Cards */}
          {regResults && regResults.hasData && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={20} color="#ec4899" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Regression Model Parameters
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={14} /> OLS Fit N = {regResults.n}
                  </span>
                  <button
                    type="button"
                    onClick={toggleAllCalcs}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '6px',
                      backgroundColor: anyExpanded ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${anyExpanded ? 'rgba(236, 72, 153, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
                      color: anyExpanded ? '#fce7f3' : '#cbd5e1',
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
                  marginBottom: '1.25rem',
                }}
              >
                <StatCard
                  title="Regression Equation"
                  value={regResults.isUndefined ? 'Undefined' : regResults.equation}
                  subtitle="Fitted OLS model hyperplane"
                  icon={TrendingUp}
                  accentColor="pink"
                  badgeText={regResults.isUndefined ? 'Undefined' : 'OLS Fit'}
                />
                <StatCard
                  title="Slope (b₁ / β₁)"
                  value={regResults.slope !== null ? regResults.slope : 'Undefined'}
                  subtitle={regResults.seSlope !== null ? `SE = ±${regResults.seSlope.toFixed(4)}` : 'Rate of change in Y per unit X'}
                  icon={TrendingUp}
                  accentColor="purple"
                  badgeText="b₁"
                  showCalculationButton={true}
                  isCalculationExpanded={expandedCalcs.slope}
                  onToggleCalculation={() => toggleCalc('slope')}
                />
                <StatCard
                  title="Intercept (b₀ / β₀)"
                  value={regResults.intercept !== null ? regResults.intercept : 'Undefined'}
                  subtitle={regResults.seIntercept !== null ? `SE = ±${regResults.seIntercept.toFixed(4)}` : 'Expected value when X = 0'}
                  icon={Sliders}
                  accentColor="cyan"
                  badgeText="b₀"
                  showCalculationButton={true}
                  isCalculationExpanded={expandedCalcs.intercept}
                  onToggleCalculation={() => toggleCalc('intercept')}
                />
                <StatCard
                  title="R² (Coefficient of Determination)"
                  value={regResults.rSquared !== null ? regResults.rSquared : 'Indeterminate'}
                  subtitle={regResults.adjRSquared !== null ? `Adj R² = ${regResults.adjRSquared.toFixed(4)}` : 'Proportion of variance explained'}
                  icon={Target}
                  accentColor="gold"
                  badgeText="R²"
                  showCalculationButton={true}
                  isCalculationExpanded={expandedCalcs.r2}
                  onToggleCalculation={() => toggleCalc('r2')}
                />
                <StatCard
                  title="Root Mean Squared Error (RMSE)"
                  value={regResults.rmse !== null ? regResults.rmse : 'N/A'}
                  subtitle={regResults.mae !== null ? `MAE = ${regResults.mae.toFixed(4)}` : 'Standard deviation of residuals'}
                  icon={LineChartIcon}
                  accentColor="emerald"
                  badgeText="RMSE"
                  showCalculationButton={true}
                  isCalculationExpanded={expandedCalcs.rmse}
                  onToggleCalculation={() => toggleCalc('rmse')}
                />
                <StatCard
                  title="Paired Observations"
                  value={regResults.n}
                  subtitle={`${regResults.excludedCount} rows excluded (missing/NaN)`}
                  icon={Database}
                  accentColor="cyan"
                  badgeText={`n = ${regResults.n}`}
                />
              </div>

              {/* ACTIVE EXPANDED CALCULATIONS SECTION (ANSWER FIRST, CALCULATION ON CLICK) */}
              {anyExpanded && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(236, 72, 153, 0.25)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calculator size={18} color="#f472b6" />
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                        Step-by-Step Mathematical Solutions (Active Selections)
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Click "Hide Calculation" on any card or above to collapse
                    </span>
                  </div>

                  {expandedCalcs.slope && regResults.explanations.slope && (
                    <ExpandableCalculation
                      title="Slope Estimator (b₁)"
                      conceptName={regResults.explanations.slope.conceptName}
                      definition={regResults.explanations.slope.definition}
                      formula={regResults.explanations.slope.formula}
                      symbols={regResults.explanations.slope.symbols}
                      substitution={regResults.explanations.slope.substitution}
                      steps={regResults.explanations.slope.steps}
                      step={regResults.explanations.slope.step}
                      result={regResults.explanations.slope.result}
                      interpretation={regResults.explanations.slope.interpretation}
                      accentColor="purple"
                      defaultExpanded={true}
                      onToggle={() => toggleCalc('slope')}
                    />
                  )}

                  {expandedCalcs.intercept && regResults.explanations.intercept && (
                    <ExpandableCalculation
                      title="Intercept Estimator (b₀)"
                      conceptName={regResults.explanations.intercept.conceptName}
                      definition={regResults.explanations.intercept.definition}
                      formula={regResults.explanations.intercept.formula}
                      symbols={regResults.explanations.intercept.symbols}
                      substitution={regResults.explanations.intercept.substitution}
                      steps={regResults.explanations.intercept.steps}
                      step={regResults.explanations.intercept.step}
                      result={regResults.explanations.intercept.result}
                      interpretation={regResults.explanations.intercept.interpretation}
                      accentColor="cyan"
                      defaultExpanded={true}
                      onToggle={() => toggleCalc('intercept')}
                    />
                  )}

                  {expandedCalcs.r2 && regResults.explanations.rSquared && (
                    <ExpandableCalculation
                      title="Coefficient of Determination (R²)"
                      conceptName={regResults.explanations.rSquared.conceptName}
                      definition={regResults.explanations.rSquared.definition}
                      formula={regResults.explanations.rSquared.formula}
                      symbols={regResults.explanations.rSquared.symbols}
                      substitution={regResults.explanations.rSquared.substitution}
                      steps={regResults.explanations.rSquared.steps}
                      step={regResults.explanations.rSquared.step}
                      result={regResults.explanations.rSquared.result}
                      interpretation={regResults.explanations.rSquared.interpretation}
                      accentColor="gold"
                      defaultExpanded={true}
                      onToggle={() => toggleCalc('r2')}
                    />
                  )}

                  {expandedCalcs.rmse && regResults.explanations.rmse && (
                    <ExpandableCalculation
                      title="Root Mean Squared Error (RMSE)"
                      conceptName={regResults.explanations.rmse.conceptName}
                      definition={regResults.explanations.rmse.definition}
                      formula={regResults.explanations.rmse.formula}
                      symbols={regResults.explanations.rmse.symbols}
                      substitution={regResults.explanations.rmse.substitution}
                      steps={regResults.explanations.rmse.steps}
                      step={regResults.explanations.rmse.step}
                      result={regResults.explanations.rmse.result}
                      interpretation={regResults.explanations.rmse.interpretation}
                      accentColor="emerald"
                      defaultExpanded={true}
                      onToggle={() => toggleCalc('rmse')}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Interactive Prediction Sandbox */}
          {regResults && regResults.hasData && !regResults.isUndefined && (
            <div
              className="glass-panel"
              style={{
                padding: '1.75rem',
                marginBottom: '2rem',
                borderLeft: '4px solid #f472b6',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                  Interactive Value Prediction Simulator
                </h3>
                <span className="badge badge-pink">Model Extrapolation</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                Enter any arbitrary value for <strong>{indepVar}</strong> to compute the fitted point estimate <MathText text="\hat{y}" /> using calibrated coefficients <MathText text={`\\beta_0 = ${regResults.intercept}`} /> and <MathText text={`\\beta_1 = ${regResults.slope}`} />.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                    Enter Value for X ({indepVar}):
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder={`e.g. ${regResults.meanX}`}
                    value={predictionInput}
                    onChange={(e) => setPredictionInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(10, 14, 26, 0.8)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(10, 14, 26, 0.7)',
                    border: '1px solid rgba(236, 72, 153, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f472b6', textTransform: 'uppercase' }}>
                    Fitted Estimate ŷ ({depVar})
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                    {predictedValue !== null ? predictedValue : '— (Enter X value)'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    *Note: This is a mathematical regression estimate <MathText text="\hat{y} = \beta_0 + \beta_1 x" />, not a guaranteed empirical outcome.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation: Chart, Residuals, Derivations, Data Table */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '1rem',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('chart')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: activeTab === 'chart' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: activeTab === 'chart' ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeTab === 'chart' ? '#fce7f3' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <LineChartIcon size={16} />
              <span>Fitted Regression Line Plot</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('residuals')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: activeTab === 'residuals' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: activeTab === 'residuals' ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeTab === 'residuals' ? '#cffafe' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <Activity size={16} />
              <span>Residual Diagnostics Plot</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('derivations')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: activeTab === 'derivations' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: activeTab === 'derivations' ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeTab === 'derivations' ? '#e9d5ff' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <Calculator size={16} />
              <span>Step-by-Step Derivations</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('table')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: activeTab === 'table' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: activeTab === 'table' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeTab === 'table' ? '#d1fae5' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <Table size={16} />
              <span>Observations & Residuals Table</span>
            </button>
          </div>

          {/* TAB 1: FITTED REGRESSION LINE PLOT */}
          {activeTab === 'chart' && regResults?.hasData && (
            <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                    Fitted Least-Squares Regression Canvas
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    <MathText text="Observed points \((x_i, y_i)\) overlaid with the minimum variance OLS vector \(\hat{y} = b_0 + b_1 x\)." />
                  </p>
                </div>
                <span className="badge badge-pink">Recharts OLS</span>
              </div>

              <RegressionLineChart
                rows={regResults.rows}
                xName={indepVar}
                yName={depVar}
                slope={regResults.slope}
                intercept={regResults.intercept}
                equation={regResults.equation}
              />
            </div>
          )}

          {/* TAB 2: RESIDUAL DIAGNOSTICS PLOT */}
          {activeTab === 'residuals' && regResults?.hasData && (
            <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                    Residuals vs Predictor Canvas
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    <MathText text="Diagnostic inspection of deviation errors \(e_i = y_i - \hat{y}_i\) against predictor variable." />
                  </p>
                </div>
                <span className="badge badge-cyan">Homoscedasticity Check</span>
              </div>

              <ResidualPlotChart rows={regResults.rows} xName={indepVar} />
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP MATHEMATICAL DERIVATIONS */}
          {activeTab === 'derivations' && regResults?.hasData && (
            <div style={{ marginBottom: '2rem' }}>
              <div
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  marginBottom: '1.25rem',
                  borderLeft: '4px solid #a855f7',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                      Complete 10-Step Mathematical Derivation & Solution
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                      Exhaustive algebraic working evaluated on active dataset: predictor <strong style={{ color: '#38bdf8' }}>{indepVar}</strong> and response <strong style={{ color: '#f472b6' }}>{depVar}</strong> ({regResults.n} paired observations).
                    </p>
                  </div>
                  <span className="badge badge-purple">10 Steps Transparent</span>
                </div>
              </div>

              <RegressionDerivationContent
                regResults={regResults}
                xName={indepVar}
                yName={depVar}
              />
            </div>
          )}

          {/* TAB 4: OBSERVATIONS & RESIDUALS TABLE */}
          {activeTab === 'table' && regResults?.hasData && (
            <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                    Observation Level Fitted Values & Residuals
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    <MathText text="Row-by-row inspection of observations, model predictions \(\hat{y}_i\), and residual errors \(e_i\)." />
                  </p>
                </div>
                <span className="badge badge-emerald">Interactive Sliced Table</span>
              </div>

              <RegressionDataTable
                rows={regResults.rows}
                xName={indepVar}
                yName={depVar}
                sse={regResults.sse}
                residualSum={regResults.residualSum}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
