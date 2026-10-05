import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sigma,
  Table as TableIcon
} from 'lucide-react';

export default function DeviationsTable({ deviations = [], mean = 0, sumOfSquares = 0 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  if (!deviations || deviations.length === 0) return null;

  const totalPages = Math.max(1, Math.ceil(deviations.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const currentRows = deviations.slice(startIndex, startIndex + pageSize);

  // Sum of deviations for mathematical proof: sum(x_i - mean) should be ~0
  const sumDeviations = deviations.reduce((acc, r) => acc + r.deviation, 0);

  return (
    <div style={{ width: '100%' }}>
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
          Displaying observations {startIndex + 1}–{Math.min(startIndex + pageSize, deviations.length)} of {deviations.length}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
          <span style={{ color: '#38bdf8' }}>
            Mean (x̄) = <strong>{mean}</strong>
          </span>
          <span style={{ color: '#c084fc' }}>
            Σ(x - x̄)² = <strong>{sumOfSquares}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
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
            fontSize: '0.825rem',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
              }}
            >
              <th style={{ padding: '0.65rem 0.85rem', width: '50px', textAlign: 'center' }}>i</th>
              <th style={{ padding: '0.65rem 0.85rem' }}>Observed Value (xᵢ)</th>
              <th style={{ padding: '0.65rem 0.85rem', color: '#38bdf8' }}>Deviation (xᵢ - x̄)</th>
              <th style={{ padding: '0.65rem 0.85rem', color: '#c084fc' }}>Squared Deviation (xᵢ - x̄)²</th>
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
                <td style={{ padding: '0.55rem 0.85rem', textAlign: 'center', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  {row.index}
                </td>
                <td style={{ padding: '0.55rem 0.85rem', fontWeight: 600, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                  {row.x}
                </td>
                <td
                  style={{
                    padding: '0.55rem 0.85rem',
                    color: row.deviation < 0 ? '#f87171' : '#34d399',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {row.deviation >= 0 ? `+${row.deviation.toFixed(4)}` : row.deviation.toFixed(4)}
                </td>
                <td style={{ padding: '0.55rem 0.85rem', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                  {row.deviationSquared.toFixed(4)}
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
              <td colSpan={2} style={{ padding: '0.65rem 0.85rem', color: '#ffffff' }}>
                Mathematical Summation Proof (Total across all {deviations.length} records):
              </td>
              <td style={{ padding: '0.65rem 0.85rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                Σ(x - x̄) = {Math.abs(sumDeviations) < 1e-9 ? '0.0000' : sumDeviations.toFixed(4)}
              </td>
              <td style={{ padding: '0.65rem 0.85rem', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                SS = {sumOfSquares}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination Controls */}
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
