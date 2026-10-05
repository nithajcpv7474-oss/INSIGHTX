import React from 'react';
import { Sparkles, Info, Clock } from 'lucide-react';

export default function PhaseNotice({ phase, title, description, color = 'purple' }) {
  const colorMap = {
    purple: {
      bg: 'rgba(168, 85, 247, 0.08)',
      border: 'rgba(168, 85, 247, 0.25)',
      badgeBg: 'rgba(168, 85, 247, 0.2)',
      text: '#c084fc',
      icon: '#c084fc'
    },
    cyan: {
      bg: 'rgba(6, 182, 212, 0.08)',
      border: 'rgba(6, 182, 212, 0.25)',
      badgeBg: 'rgba(6, 182, 212, 0.2)',
      text: '#22d3ee',
      icon: '#22d3ee'
    },
    gold: {
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.25)',
      badgeBg: 'rgba(245, 158, 11, 0.2)',
      text: '#fbbf24',
      icon: '#fbbf24'
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.25)',
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      text: '#34d399',
      icon: '#34d399'
    }
  };

  const scheme = colorMap[color] || colorMap.purple;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        backgroundColor: scheme.bg,
        border: `1px solid ${scheme.border}`,
        marginBottom: '1.5rem',
      }}
    >
      <div
        style={{
          padding: '0.4rem',
          borderRadius: '8px',
          backgroundColor: scheme.badgeBg,
          color: scheme.icon,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '2px',
        }}
      >
        <Clock size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              backgroundColor: scheme.badgeBg,
              color: scheme.text,
            }}
          >
            {phase} Roadmap
          </span>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f1f5f9' }}>
            {title}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
    </div>
  );
}
