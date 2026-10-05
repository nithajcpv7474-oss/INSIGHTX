import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Calculator, Layers } from 'lucide-react';
import MathView, { MathText } from './MathView';

export default function MathExplanationCard({
  title,
  symbol,
  definition,
  formula,
  symbols = [], // Array of { symbol, meaning }
  substitution,
  step,
  steps = [],
  result,
  interpretation,
  accentColor = 'purple',
  collapsible = true,
  defaultExpanded = false,
  children
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const colorMap = {
    purple: {
      border: 'rgba(168, 85, 247, 0.35)',
      title: '#c084fc',
      resultBg: 'rgba(168, 85, 247, 0.18)',
      resultText: '#f3e8ff',
      btnBg: 'rgba(168, 85, 247, 0.15)',
      btnBorder: 'rgba(168, 85, 247, 0.35)',
      btnText: '#e9d5ff',
      glow: '0 0 20px rgba(168, 85, 247, 0.12)'
    },
    cyan: {
      border: 'rgba(6, 182, 212, 0.35)',
      title: '#22d3ee',
      resultBg: 'rgba(6, 182, 212, 0.18)',
      resultText: '#ecfeff',
      btnBg: 'rgba(6, 182, 212, 0.15)',
      btnBorder: 'rgba(6, 182, 212, 0.35)',
      btnText: '#cffafe',
      glow: '0 0 20px rgba(6, 182, 212, 0.12)'
    },
    emerald: {
      border: 'rgba(16, 185, 129, 0.35)',
      title: '#34d399',
      resultBg: 'rgba(16, 185, 129, 0.18)',
      resultText: '#ecfdf5',
      btnBg: 'rgba(16, 185, 129, 0.15)',
      btnBorder: 'rgba(16, 185, 129, 0.35)',
      btnText: '#d1fae5',
      glow: '0 0 20px rgba(16, 185, 129, 0.12)'
    },
    gold: {
      border: 'rgba(245, 158, 11, 0.35)',
      title: '#fbbf24',
      resultBg: 'rgba(245, 158, 11, 0.18)',
      resultText: '#fffbeb',
      btnBg: 'rgba(245, 158, 11, 0.15)',
      btnBorder: 'rgba(245, 158, 11, 0.35)',
      btnText: '#fef3c7',
      glow: '0 0 20px rgba(245, 158, 11, 0.12)'
    },
    pink: {
      border: 'rgba(236, 72, 153, 0.35)',
      title: '#f472b6',
      resultBg: 'rgba(236, 72, 153, 0.18)',
      resultText: '#fdf2f8',
      btnBg: 'rgba(236, 72, 153, 0.15)',
      btnBorder: 'rgba(236, 72, 153, 0.35)',
      btnText: '#fce7f3',
      glow: '0 0 20px rgba(236, 72, 153, 0.12)'
    }
  };

  const scheme = colorMap[accentColor] || colorMap.purple;
  const showContent = !collapsible || isExpanded;
  const stepList = steps.length > 0 ? steps : (step ? [step] : []);

  return (
    <div
      style={{
        borderRadius: '12px',
        backgroundColor: 'rgba(10, 14, 26, 0.85)',
        border: `1px solid ${showContent ? scheme.border : 'rgba(255, 255, 255, 0.08)'}`,
        boxShadow: showContent ? scheme.glow : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Card Header & Summary Bar */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          backgroundColor: showContent ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                {title}
              </h4>
              {symbol && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: scheme.title,
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '5px',
                    backgroundColor: scheme.resultBg,
                    border: `1px solid ${scheme.border}`,
                  }}
                >
                  <MathView math={symbol} />
                </span>
              )}
            </div>
            {result !== undefined && result !== null && (
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Calculated Answer:</span>
                <strong style={{ color: scheme.title, fontFamily: 'var(--font-mono)' }}>{String(result)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Action Toggle Button */}
        {collapsible && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: isExpanded ? scheme.btnBg : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isExpanded ? scheme.btnBorder : 'rgba(255, 255, 255, 0.12)'}`,
              color: isExpanded ? scheme.btnText : '#cbd5e1',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{isExpanded ? 'Hide Calculation' : 'Show Calculation'}</span>
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        )}
      </div>

      {/* Expanded 7-Part Calculation Body */}
      {showContent && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.15rem',
          }}
        >
          {/* 1. Name & Definition */}
          {definition && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: scheme.title, textTransform: 'uppercase', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={12} />
                <span>1. Concept Definition</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                <MathText text={definition} />
              </div>
            </div>
          )}

          {/* 2 & 4. Standard Formula & Active Dataset Substitution */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {/* 2. Axiomatic Formula */}
            <div
              className="math-formula-box"
              style={{
                fontSize: '0.9rem',
                color: '#38bdf8',
                backgroundColor: 'rgba(10, 14, 26, 0.9)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 700 }}>
                2. Axiomatic Formula
              </div>
              <MathView math={formula} block />
            </div>

            {/* 4. Active Dataset Substitution */}
            <div
              className="math-formula-box"
              style={{
                fontSize: '0.9rem',
                color: '#fbbf24',
                backgroundColor: 'rgba(10, 14, 26, 0.9)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 700 }}>
                4. Active Dataset Substitution
              </div>
              <MathView math={substitution} block />
            </div>
          </div>

          {/* 3. Meaning of Each Symbol */}
          {symbols && symbols.length > 0 && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={12} />
                <span>3. Meaning of Symbols</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {symbols.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.78rem',
                      color: '#cbd5e1',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: scheme.title,
                        fontWeight: 700,
                        fontSize: '0.8rem',
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

          {/* 5. Computational Steps / Detailed Derivations */}
          {children ? (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: scheme.title, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calculator size={13} />
                <span>5. Step-by-Step Mathematical Derivation</span>
              </div>
              {children}
            </div>
          ) : stepList.length > 0 ? (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                5. Computational Working
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {stepList.map((st, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <span style={{ color: scheme.title, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      Step {stepList.length > 1 ? `${idx + 1}:` : ':'}
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.5 }}>
                      <MathText text={typeof st === 'string' ? st : (st.label || st.math || '')} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* 6. Final Result Display */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: scheme.resultBg,
              border: `1px solid ${scheme.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.65rem',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
              6. Final Answer
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                color: scheme.resultText,
                fontWeight: 700,
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span>=</span>
              <span>{result !== undefined && result !== null ? result : 'N/A'}</span>
            </div>
          </div>

          {/* 7. Interpretation */}
          {interpretation && (
            <div
              style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.45rem',
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#10b981', fontStyle: 'normal' }}>7. Interpretation: </strong>
                <MathText text={interpretation} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
