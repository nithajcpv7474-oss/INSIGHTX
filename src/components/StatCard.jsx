import React from 'react';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { MathText } from './MathView';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'purple',
  badgeText,
  showCalculationButton = false,
  isCalculationExpanded = false,
  onToggleCalculation,
  calculationLabel = 'Show Calculation',
  children
}) {
  const accentStyles = {
    purple: {
      border: 'rgba(168, 85, 247, 0.25)',
      activeBorder: 'rgba(168, 85, 247, 0.5)',
      iconBg: 'rgba(168, 85, 247, 0.12)',
      iconColor: '#c084fc',
      btnBg: 'rgba(168, 85, 247, 0.12)',
      btnHover: 'rgba(168, 85, 247, 0.22)',
      btnText: '#e9d5ff',
      glow: '0 0 20px rgba(168, 85, 247, 0.1)'
    },
    cyan: {
      border: 'rgba(6, 182, 212, 0.25)',
      activeBorder: 'rgba(6, 182, 212, 0.5)',
      iconBg: 'rgba(6, 182, 212, 0.12)',
      iconColor: '#22d3ee',
      btnBg: 'rgba(6, 182, 212, 0.12)',
      btnHover: 'rgba(6, 182, 212, 0.22)',
      btnText: '#cffafe',
      glow: '0 0 20px rgba(6, 182, 212, 0.1)'
    },
    pink: {
      border: 'rgba(236, 72, 153, 0.25)',
      activeBorder: 'rgba(236, 72, 153, 0.5)',
      iconBg: 'rgba(236, 72, 153, 0.12)',
      iconColor: '#f472b6',
      btnBg: 'rgba(236, 72, 153, 0.12)',
      btnHover: 'rgba(236, 72, 153, 0.22)',
      btnText: '#fce7f3',
      glow: '0 0 20px rgba(236, 72, 153, 0.1)'
    },
    emerald: {
      border: 'rgba(16, 185, 129, 0.25)',
      activeBorder: 'rgba(16, 185, 129, 0.5)',
      iconBg: 'rgba(16, 185, 129, 0.12)',
      iconColor: '#34d399',
      btnBg: 'rgba(16, 185, 129, 0.12)',
      btnHover: 'rgba(16, 185, 129, 0.22)',
      btnText: '#d1fae5',
      glow: '0 0 20px rgba(16, 185, 129, 0.1)'
    },
    gold: {
      border: 'rgba(245, 158, 11, 0.25)',
      activeBorder: 'rgba(245, 158, 11, 0.5)',
      iconBg: 'rgba(245, 158, 11, 0.12)',
      iconColor: '#fbbf24',
      btnBg: 'rgba(245, 158, 11, 0.12)',
      btnHover: 'rgba(245, 158, 11, 0.22)',
      btnText: '#fef3c7',
      glow: '0 0 20px rgba(245, 158, 11, 0.1)'
    }
  };

  const style = accentStyles[accentColor] || accentStyles.purple;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${isCalculationExpanded ? style.activeBorder : style.border}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        boxShadow: style.glow,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <MathText text={title} />
        </span>
        {Icon && (
          <div
            style={{
              padding: '0.5rem',
              borderRadius: '10px',
              backgroundColor: style.iconBg,
              color: style.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: '1.85rem',
            fontWeight: 700,
            color: 'var(--text-heading)',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>
        {badgeText && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              backgroundColor: style.iconBg,
              color: style.iconColor,
            }}
          >
            <MathText text={badgeText} />
          </span>
        )}
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <MathText text={subtitle} />
        </span>
      )}

      {/* Expandable Calculation Button */}
      {showCalculationButton && (
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onToggleCalculation}
            aria-expanded={isCalculationExpanded}
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: isCalculationExpanded ? style.btnBg : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${isCalculationExpanded ? style.border : 'rgba(255, 255, 255, 0.08)'}`,
              color: isCalculationExpanded ? style.btnText : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calculator size={13} color={style.iconColor} />
              <span>{isCalculationExpanded ? 'Hide Calculation' : calculationLabel}</span>
            </span>
            {isCalculationExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      )}

      {/* Render children if expanded */}
      {isCalculationExpanded && children && (
        <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
          {children}
        </div>
      )}
    </div>
  );
}
