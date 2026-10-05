import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import MathView, { MathText } from './MathView';

/**
 * ExpandableCalculation component implementing the "Answer First, Calculation on Click" design.
 * Initially collapsed to keep the view clean and focused on final answers.
 * When expanded, displays all 7 required components:
 * 1. Name and definition of the mathematical concept
 * 2. Standard mathematical formula (via KaTeX)
 * 3. Meaning of each symbol
 * 4. Actual values substituted from the active dataset (via KaTeX)
 * 5. Each calculation step in logical order
 * 6. The final answer (highlighted)
 * 7. A short interpretation of the result
 */
export default function ExpandableCalculation({
  id,
  title,
  conceptName,
  definition,
  formula,
  symbols = [], // Array of { symbol: string, meaning: string }
  substitution,
  steps = [], // Array of string steps or { label: string, math?: string, note?: string }
  step, // Fallback single step string
  result,
  interpretation,
  accentColor = 'purple',
  defaultExpanded = false,
  isExpanded: controlledExpanded,
  onToggle: controlledOnToggle,
  badgeText,
  buttonLabel = 'View Step-by-Step Solution',
  hideLabel = 'Hide Calculation',
  children
}) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const toggle = () => {
    if (isControlled && controlledOnToggle) {
      controlledOnToggle(!expanded);
    } else {
      setInternalExpanded(!expanded);
    }
  };

  const colorMap = {
    purple: {
      border: 'rgba(168, 85, 247, 0.35)',
      btnBg: 'rgba(168, 85, 247, 0.15)',
      btnHover: 'rgba(168, 85, 247, 0.28)',
      btnText: '#e9d5ff',
      title: '#c084fc',
      resultBg: 'rgba(168, 85, 247, 0.2)',
      resultText: '#f3e8ff',
      glow: '0 0 16px rgba(168, 85, 247, 0.15)',
    },
    cyan: {
      border: 'rgba(6, 182, 212, 0.35)',
      btnBg: 'rgba(6, 182, 212, 0.15)',
      btnHover: 'rgba(6, 182, 212, 0.28)',
      btnText: '#cffafe',
      title: '#22d3ee',
      resultBg: 'rgba(6, 182, 212, 0.2)',
      resultText: '#ecfeff',
      glow: '0 0 16px rgba(6, 182, 212, 0.15)',
    },
    emerald: {
      border: 'rgba(16, 185, 129, 0.35)',
      btnBg: 'rgba(16, 185, 129, 0.15)',
      btnHover: 'rgba(16, 185, 129, 0.28)',
      btnText: '#d1fae5',
      title: '#34d399',
      resultBg: 'rgba(16, 185, 129, 0.2)',
      resultText: '#ecfdf5',
      glow: '0 0 16px rgba(16, 185, 129, 0.15)',
    },
    gold: {
      border: 'rgba(245, 158, 11, 0.35)',
      btnBg: 'rgba(245, 158, 11, 0.15)',
      btnHover: 'rgba(245, 158, 11, 0.28)',
      btnText: '#fef3c7',
      title: '#fbbf24',
      resultBg: 'rgba(245, 158, 11, 0.2)',
      resultText: '#fffbeb',
      glow: '0 0 16px rgba(245, 158, 11, 0.15)',
    },
    pink: {
      border: 'rgba(236, 72, 153, 0.35)',
      btnBg: 'rgba(236, 72, 153, 0.15)',
      btnHover: 'rgba(236, 72, 153, 0.28)',
      btnText: '#fce7f3',
      title: '#f472b6',
      resultBg: 'rgba(236, 72, 153, 0.2)',
      resultText: '#fdf2f8',
      glow: '0 0 16px rgba(236, 72, 153, 0.15)',
    }
  };

  const scheme = colorMap[accentColor] || colorMap.purple;

  // Normalize steps
  const normalizedSteps = steps && steps.length > 0 ? steps : (step ? [step] : []);

  return (
    <div
      id={id}
      style={{
        borderRadius: '12px',
        backgroundColor: 'rgba(10, 14, 26, 0.85)',
        border: `1px solid ${expanded ? scheme.border : 'rgba(255, 255, 255, 0.08)'}`,
        boxShadow: expanded ? scheme.glow : 'none',
        transition: 'all 0.25s ease',
        overflow: 'hidden',
      }}
    >
      {/* Toggle Bar / Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          backgroundColor: expanded ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              padding: '0.45rem',
              borderRadius: '8px',
              backgroundColor: scheme.btnBg,
              color: scheme.title,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calculator size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
              {conceptName || title}
            </div>
            {result !== undefined && result !== null && (
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Final Result:</span>
                <strong style={{ color: scheme.title, fontFamily: 'var(--font-mono)' }}>{String(result)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Action Toggle Button */}
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          style={{
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            backgroundColor: expanded ? scheme.btnBg : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${expanded ? scheme.border : 'rgba(255, 255, 255, 0.12)'}`,
            color: expanded ? scheme.btnText : '#cbd5e1',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <span>{expanded ? hideLabel : buttonLabel}</span>
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Expanded Detailed 7-Part Calculation View */}
      {expanded && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* 1. Name and Definition */}
          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: scheme.title, textTransform: 'uppercase', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={13} />
              <span>1. Concept & Mathematical Definition</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.5 }}>
              <MathText text={definition} />
            </div>
          </div>

          {/* 2 & 4. Standard Formula & Active Dataset Substitution */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* 2. Standard Mathematical Formula */}
            <div
              className="math-formula-box"
              style={{
                fontSize: '0.95rem',
                color: '#38bdf8',
                backgroundColor: 'rgba(10, 14, 26, 0.9)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>
                2. Axiomatic Mathematical Formula
              </div>
              <MathView math={formula} block />
            </div>

            {/* 4. Active Dataset Substitution */}
            <div
              className="math-formula-box"
              style={{
                fontSize: '0.95rem',
                color: '#fbbf24',
                backgroundColor: 'rgba(10, 14, 26, 0.9)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>
                4. Active Dataset Substitution
              </div>
              <MathView math={substitution} block />
            </div>
          </div>

          {/* 3. Meaning of Each Symbol */}
          {symbols && symbols.length > 0 && (
            <div
              style={{
                padding: '0.85rem 1.1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={13} />
                <span>3. Meaning of Mathematical Symbols</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.6rem',
                }}
              >
                {symbols.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: scheme.title,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '0.825rem',
                        minWidth: '24px',
                        textAlign: 'center',
                      }}
                    >
                      <MathView math={item.symbol} />
                    </span>
                    <span>= {item.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Logical Calculation Steps / Detailed Derivations */}
          {children ? (
            <div
              style={{
                padding: '0.85rem 1.1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: scheme.title, textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calculator size={13} />
                <span>5. Step-by-Step Mathematical Derivation</span>
              </div>
              {children}
            </div>
          ) : normalizedSteps.length > 0 ? (
            <div
              style={{
                padding: '0.85rem 1.1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                5. Step-by-Step Computational Working
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {normalizedSteps.map((st, idx) => (
                  <div key={idx} style={{ fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span
                      style={{
                        color: scheme.title,
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        flexShrink: 0,
                      }}
                    >
                      Step {idx + 1}:
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.5 }}>
                      <MathText text={typeof st === 'string' ? st : (st.label || st.math || '')} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* 6. Final Answer Display */}
          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: '8px',
              backgroundColor: scheme.resultBg,
              border: `1px solid ${scheme.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.825rem', color: '#cbd5e1', fontWeight: 600 }}>
              6. Final Calculated Result
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: scheme.resultText,
                fontWeight: 700,
                fontSize: '1.05rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span>=</span>
              <span>{result !== undefined && result !== null ? result : 'N/A'}</span>
            </div>
          </div>

          {/* 7. Short Statistical Interpretation */}
          {interpretation && (
            <div
              style={{
                fontSize: '0.825rem',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#10b981', fontStyle: 'normal' }}>7. Mathematical Interpretation: </strong>
                <MathText text={interpretation} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
