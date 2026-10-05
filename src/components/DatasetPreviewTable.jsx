import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Hash,
  Type,
  FileSpreadsheet,
  SlidersHorizontal
} from 'lucide-react';

export default function DatasetPreviewTable({ dataset }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  if (!dataset || !dataset.originalRows || dataset.originalRows.length === 0) {
    return null;
  }

  // Filter rows based on search query across all cells
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) {
      return dataset.originalRows;
    }
    const query = searchQuery.toLowerCase().trim();
    return dataset.originalRows.filter(row => {
      return dataset.headers.some(h => {
        const val = row[h];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [dataset.originalRows, dataset.headers, searchQuery]);

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredRows.length);
  const currentRows = filteredRows.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem' }}>
      {/* Table Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileSpreadsheet size={20} color="#06b6d4" />
            <span>Dataset Tabular Matrix Preview</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Showing rows {filteredRows.length > 0 ? startIndex + 1 : 0}–{endIndex} of {filteredRows.length} {searchQuery ? '(filtered)' : 'records'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Quick Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(10, 14, 26, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
            }}
          >
            <Search size={15} color="#64748b" />
            <input
              type="text"
              placeholder="Search table cells..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#f8fafc',
                fontSize: '0.825rem',
                width: '160px',
              }}
            />
          </div>

          {/* Page size dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: '#94a3b8' }}>
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              style={{
                backgroundColor: 'rgba(10, 14, 26, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                borderRadius: '6px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.825rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Scrollable Table Container */}
      <div
        style={{
          overflowX: 'auto',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(10, 14, 26, 0.6)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.85rem',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Row Number Column */}
              <th
                style={{
                  padding: '0.85rem 1rem',
                  color: '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  width: '60px',
                  textAlign: 'center',
                }}
              >
                #
              </th>

              {/* Data Headers */}
              {dataset.headers.map((header) => {
                const isNum = dataset.columnTypes[header] === 'numerical';
                const isDate = dataset.columnTypes[header] === 'date/time' || dataset.columnTypes[header] === 'date';
                return (
                  <th
                    key={header}
                    style={{
                      padding: '0.85rem 1rem',
                      color: isNum ? '#38bdf8' : isDate ? '#facc15' : '#e2e8f0',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                          backgroundColor: isNum ? 'rgba(56, 189, 248, 0.15)' : isDate ? 'rgba(234, 179, 8, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                          color: isNum ? '#38bdf8' : isDate ? '#facc15' : '#c084fc',
                          border: `1px solid ${isNum ? 'rgba(56, 189, 248, 0.3)' : isDate ? 'rgba(234, 179, 8, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`,
                        }}
                      >
                        {isNum ? 'NUM' : isDate ? 'DATE' : 'CAT'}
                      </span>
                      <span>{header}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row, rIdx) => {
              const actualRowIndex = startIndex + rIdx + 1;
              return (
                <tr
                  key={row._rowIndex || actualRowIndex}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    backgroundColor: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)')}
                >
                  {/* Row index */}
                  <td
                    style={{
                      padding: '0.75rem 1rem',
                      color: '#475569',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      textAlign: 'center',
                    }}
                  >
                    {row._rowIndex || actualRowIndex}
                  </td>

                  {/* Cell Values */}
                  {dataset.headers.map((header) => {
                    const val = row[header];
                    const isNum = dataset.columnTypes[header] === 'numerical';
                    const isNull = val === null || val === undefined;

                    return (
                      <td
                        key={header}
                        style={{
                          padding: '0.75rem 1rem',
                          color: isNull ? '#64748b' : '#f1f5f9',
                          fontFamily: isNum ? 'var(--font-mono)' : 'inherit',
                          fontSize: isNum ? '0.825rem' : '0.85rem',
                          borderLeft: '1px solid rgba(255, 255, 255, 0.04)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isNull ? (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-mono)',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(239, 68, 68, 0.12)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              fontStyle: 'italic',
                            }}
                          >
                            null
                          </span>
                        ) : (
                          // Exact preservation of 0 or strings/numbers
                          String(val)
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '1.25rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          Page <strong style={{ color: '#ffffff' }}>{safeCurrentPage}</strong> of{' '}
          <strong style={{ color: '#ffffff' }}>{totalPages}</strong>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            disabled={safeCurrentPage === 1}
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: safeCurrentPage === 1 ? '#475569' : '#cbd5e1',
              cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="First page"
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: safeCurrentPage === 1 ? '#475569' : '#cbd5e1',
              cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.8rem',
            }}
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: safeCurrentPage === totalPages ? '#475569' : '#cbd5e1',
              cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.8rem',
            }}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(totalPages)}
            disabled={safeCurrentPage === totalPages}
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: safeCurrentPage === totalPages ? '#475569' : '#cbd5e1',
              cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
