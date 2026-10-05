import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  BarChart3,
  GitCompare,
  TrendingUp,
  FlaskConical,
  FileText,
  Sigma,
  Home,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    path: '/dataset',
    label: 'Dataset Hub',
    icon: Database
  },
  {
    path: '/statistics',
    label: 'Statistics',
    icon: BarChart3
  },
  {
    path: '/correlation',
    label: 'Correlation',
    icon: GitCompare
  },
  {
    path: '/regression',
    label: 'Regression',
    icon: TrendingUp
  },
  {
    path: '/formula-lab',
    label: 'Formula Lab',
    icon: FlaskConical
  },
  {
    path: '/report',
    label: 'Analysis Report',
    icon: FileText
  }
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
            display: 'block',
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: '#0c1322',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`sidebar-nav ${isOpen ? 'sidebar-open' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            height: '70px',
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)',
              }}
            >
              <Sigma size={22} color="#ffffff" strokeWidth={2.4} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                INSIGHT<span style={{ color: '#06b6d4' }}>X</span>
              </div>
              <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>
                MATH ANALYTICS
              </div>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            style={{
              color: '#94a3b8',
              display: 'none',
              padding: '0.25rem',
            }}
            className="mobile-close-btn"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav
          style={{
            flex: 1,
            padding: '0.75rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#475569',
              padding: '0.5rem 0.75rem 0.25rem 0.75rem',
              letterSpacing: '0.08em',
            }}
          >
            NAVIGATION
          </div>

          <NavLink
            to="/"
            onClick={onClose}
            className={({ isActive }) =>
              `nav-link-item ${isActive ? 'nav-link-active' : ''}`
            }
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isActive ? '#38bdf8' : '#94a3b8',
              backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
              border: isActive ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            <Home size={18} />
            <span>Home Overview</span>
          </NavLink>

          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#475569',
              padding: '0.75rem 0.75rem 0.25rem 0.75rem',
              letterSpacing: '0.08em',
            }}
          >
            ANALYTICS SUITE
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? 'nav-link-active' : ''}`
                }
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 16px rgba(168, 85, 247, 0.15)' : 'none',
                  transition: 'all 0.15s ease',
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info box */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(10, 14, 26, 0.5)',
          }}
        >
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.2rem' }}>
              System Build
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Frontend UI Architecture
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
