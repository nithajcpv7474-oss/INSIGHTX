import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Table as TableIcon
} from 'lucide-react';

export default function PairedDataTable({
  pairedRows = [],
  meanX = 0,
  meanY = 0,
  sumCrossProducts = 0,
  sumDevXSquared = 0,
  sumDevYSquared = 0,
  xName = 'X',
  yName = 'Y'
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  if (!pairedRows || pairedRows.length === 0) return null;

  const totalPages = Math.max(1, Math.ceil(pairedRows.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const currentRows = pairedRows.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ width: '100%' }}>
      {/* Header telemetry */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          Displaying pairs {startIndex + 1}–{Math.min(startIndex + pageSize, pairedRows.length)} of {pairedRows.length}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
          <span style={{ color: '#22d3ee' }}>
            x̄ = <strong>{meanX}</strong>
          </span>
          <span style={{ color: '#f472b6' }}>
            ȳ = <strong>{meanY}</strong>
          </span>
          <span style={{ color: '#a855f7' }}>
            SP_{'{xy}'} = <strong>{sumCrossProducts}</strong>
          </span>
        </div>
      </div>

      {/* Responsive Table */}
      <div
        style={{
          overflowX: 'auto',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(10, 14, 26, 0.7)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.8rem',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
              }}
            >
              <th style={{ padding: '0.65rem 0.75rem', width: '45px', textAlign: 'center' }}>i</th>
              <th style={{ padding: '0.65rem 0.75rem', color: '#22d3ee' }}>xᵢ ({xName})</th>
              <th style={{ padding: '0.65rem 0.75rem', color: '#f472b6' }}>yᵢ ({yName})</th>
              <th style={{ padding: '0.65rem 0.75rem', color: '#94a3b8' }}>xᵢ - x̄</th>
              <th style={{ padding: '0.65rem 0.75rem', color: '#94a3b8' }}>yᵢ - ȳ</th>
              <th style={{ padding: '0.65rem 0.75rem', color: '#c084fc' }}>(xᵢ - x̄)(yᵢ - ȳ)</th>
              <th style={{ padding: '0.65rem 0.75rem', color: '#38bdf8' }}>Rank(xᵢ)</th>
              <th style={{ padding: '0.65rem 0.75rem', color: '#fbbf24' }}>Rank(yᵢ)</th>
              <th style={{ padding: '0.65rem 0.75rem', color: '#34d399' }}>dᵢ (Rank Diff)</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row) => (
              <tr
                key={row.index}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <td style={{ padding: '0.55rem 0.75rem', textAlign: 'center', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  {row.index}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 600, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                  {row.x}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 600, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                  {row.y}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: row.devX >= 0 ? '#a7f3d0' : '#fca5a5', fontFamily: 'var(--font-mono)' }}>
                  {row.devX >= 0 ? `+${row.devX.toFixed(3)}` : row.devX.toFixed(3)}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: row.devY >= 0 ? '#a7f3d0' : '#fca5a5', fontFamily: 'var(--font-mono)' }}>
                  {row.devY >= 0 ? `+${row.devY.toFixed(3)}` : row.devY.toFixed(3)}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: '#c084fc', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {row.crossProduct.toFixed(3)}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {row.rankX !== undefined ? row.rankX : '—'}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                  {row.rankY !== undefined ? row.rankY : '—'}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  {row.rankDiff !== undefined ? (row.rankDiff >= 0 ? `+${row.rankDiff}` : row.rankDiff) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderTop: '2px solid rgba(255, 255, 255, 0.12)',
                fontWeight: 700,
              }}
            >
              <td colSpan={3} style={{ padding: '0.65rem 0.75rem', color: '#ffffff' }}>
                Mathematical Sums (N = {pairedRows.length}):
              </td>
              <td style={{ padding: '0.65rem 0.75rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                SS_x = {sumDevXSquared}
              </td>
              <td style={{ padding: '0.65rem 0.75rem', color: '#f472b6', fontFamily: 'var(--font-mono)' }}>
                SS_y = {sumDevYSquared}
              </td>
              <td style={{ padding: '0.65rem 0.75rem', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                SP_{'{xy}'} = {sumCrossProducts}
              </td>
              <td colSpan={3} style={{ padding: '0.65rem 0.75rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                Average tied ranks applied
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Page {safeCurrentPage} of {totalPages}
          </span>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: safeCurrentPage === 1 ? '#475569' : '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronsLeft size={14} />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: safeCurrentPage === 1 ? '#475569' : '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={14} />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: safeCurrentPage === totalPages ? '#475569' : '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: safeCurrentPage === totalPages ? '#475569' : '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
