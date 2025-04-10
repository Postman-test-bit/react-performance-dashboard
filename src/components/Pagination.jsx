import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage, theme }) => {
  const maxVisiblePages = 4;
  
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let end = start + maxVisiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const buttonStyle = {
    padding: '8px',
    margin: '0 2px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    ':hover': {
      backgroundColor: 'var(--hover-bg)'
    }
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderColor: '#2563eb'
  };

  const visiblePages = getVisiblePages();

  // Determine if we need to show First/Last buttons
  const showFirstLast = totalPages > maxVisiblePages;

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      gap: '4px', 
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginTop: '20px',
      padding: '0 8px'
    }}>
      {/* First/Prev buttons wrapper */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {showFirstLast && (
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            style={{
              ...buttonStyle,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'none',
              '@media (min-width: 480px)': {
                display: 'flex'
              }
            }}
            aria-label="First page"
          >
            ⟪
          </button>
        )}
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...buttonStyle,
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
          aria-label="Previous page"
        >
          ⟨
        </button>
      </div>

      {/* Page numbers */}
      <div style={{ 
        display: 'flex', 
        gap: '4px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {visiblePages.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            style={currentPage === number ? activeButtonStyle : buttonStyle}
            aria-label={`Page ${number}`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        ))}
      </div>

      {/* Next/Last buttons wrapper */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...buttonStyle,
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
          aria-label="Next page"
        >
          ⟩
        </button>
        {showFirstLast && (
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            style={{
              ...buttonStyle,
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'none',
              '@media (min-width: 480px)': {
                display: 'flex'
              }
            }}
            aria-label="Last page"
          >
            ⟫
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;