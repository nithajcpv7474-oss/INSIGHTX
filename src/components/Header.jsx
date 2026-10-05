import React from 'react';
import { Menu, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDataset } from '../context/DatasetContext';

export default function Header({ onMenuClick, title, subtitle }) {
  const { dataset } = useDataset();

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          className="mobile-hamburger-btn"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Dynamic Status Indicator */}
        {dataset ? (
          <Link
            to="/dataset"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.35rem 0.8rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.78rem',
              color: '#a7f3d0',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            className="header-dataset-status"
            title={`Active: ${dataset.name} (${dataset.rowCount} rows, ${dataset.columnCount} cols)`}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981',
                display: 'inline-block',
              }}
            />
            <span style={{ fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {dataset.name}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#6ee7b7', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '0.05rem 0.4rem', borderRadius: '4px' }}>
              {dataset.rowCount} rec
            </span>
          </Link>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.75rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              fontSize: '0.78rem',
              color: '#fca5a5',
            }}
            className="header-dataset-status"
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                display: 'inline-block',
              }}
            />
            <span style={{ fontWeight: 500 }}>No Dataset Loaded</span>
          </div>
        )}

        {/* Quick upload button */}
        <Link
          to="/dataset"
          className="btn-outline-cyan"
          style={{
            padding: '0.45rem 0.9rem',
            fontSize: '0.825rem',
            borderRadius: '8px',
          }}
        >
          <Upload size={15} />
          <span>{dataset ? 'Manage Dataset' : 'Upload Dataset'}</span>
        </Link>
      </div>
    </header>
  );
}
