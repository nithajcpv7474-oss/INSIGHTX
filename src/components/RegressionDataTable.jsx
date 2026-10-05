import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function RegressionDataTable({
  rows = [],
  xName = 'X',
  yName = 'Y',
  sse = 0,
  residualSum = 0
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const query = searchQuery.toLowerCase().trim();
    return rows.filter((r) => {
      return (
        String(r.originalIndex).includes(query) ||
        String(r.x).includes(query) ||
        String(r.y).includes(query) ||
        String(r.yHat).includes(query) ||
        String(r.residual).includes(query)
      );
    });
  }, [rows, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safePage, pageSize]);

  return (
    <div style={{ width: '100%' }}>
      {/* Table Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ position: 'relative', width: '240px' }}>
          <Search
            size={14}
            color="#64748b"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search rows or values..."
            style={{
              width: '100%',
              padding: '0.45rem 0.65rem 0.45rem 2rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(10, 14, 26, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          <span>
            Showing {filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, filteredRows.length)} of {filteredRows.length} observations
          </span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: safePage <= 1 ? '#475569' : '#f8fafc',
                cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: safePage >= totalPages ? '#475569' : '#f8fafc',
                cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th style={{ padding: '0.65rem 0.85rem', color: '#94a3b8', fontWeight: 600 }}>#</th>
              <th style={{ padding: '0.65rem 0.85rem', color: '#38bdf8', fontWeight: 600 }}>{xName} (xᵢ)</th>
              <th style={{ padding: '0.65rem 0.85rem', color: '#f472b6', fontWeight: 600 }}>{yName} (yᵢ)</th>
              <th style={{ padding: '0.65rem 0.85rem', color: '#a855f7', fontWeight: 600 }}>Fitted (ŷᵢ)</th>
              <th style={{ padding: '0.65rem 0.85rem', color: '#fbbf24', fontWeight: 600 }}>Residual (eᵢ = yᵢ - ŷᵢ)</th>
              <th style={{ padding: '0.65rem 0.85rem', color: '#34d399', fontWeight: 600 }}>Squared Error (eᵢ²)</th>
              <th style={{ padding: '0.65rem 0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Absolute Error (|eᵢ|)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No matching observations found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((r) => (
                <tr
                  key={r.originalIndex}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '0.55rem 0.85rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    {r.originalIndex}
                  </td>
                  <td style={{ padding: '0.55rem 0.85rem', color: '#f8fafc', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {r.x}
                  </td>
                  <td style={{ padding: '0.55rem 0.85rem', color: '#f8fafc', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {r.y}
                  </td>
                  <td style={{ padding: '0.55rem 0.85rem', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                    {r.yHat !== null ? r.yHat : '—'}
                  </td>
                  <td
                    style={{
                      padding: '0.55rem 0.85rem',
                      color: r.residual > 0 ? '#34d399' : r.residual < 0 ? '#fbbf24' : '#94a3b8',
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {r.residual !== null ? (r.residual > 0 ? `+${r.residual}` : r.residual) : '—'}
                  </td>
                  <td style={{ padding: '0.55rem 0.85rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    {r.residualSquared !== null ? r.residualSquared : '—'}
                  </td>
                  <td style={{ padding: '0.55rem 0.85rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    {r.absResidual !== null ? r.absResidual : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {/* Summation Footer */}
          <tfoot>
            <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderTop: '2px solid rgba(255, 255, 255, 0.1)' }}>
              <td colSpan={4} style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                Total Summary (n = {rows.length})
              </td>
              <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fbbf24' }}>
                Σeᵢ = {residualSum}
              </td>
              <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#34d399' }}>
                SSE = {sse}
              </td>
              <td style={{ padding: '0.65rem 0.85rem', color: '#64748b' }}>—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
