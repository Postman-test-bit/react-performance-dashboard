import React from 'react';

const GlobalFilters = ({ 
  uriFilter, 
  setUriFilter, 
  productFilter, 
  setProductFilter,
  deviceFilter, 
  setDeviceFilter,
  searchQuery,
  setSearchQuery,
  availableProducts = [],
  availableDevices = [],
  availableURIs = [],
  theme 
}) => {
  // Helper function to render select options with "No data" message
  const renderOptions = (options, placeholder) => {
    if (options.length === 0) {
      return <option value="" disabled>No data available</option>;
    }
    return (
      <>
        <option value="">{placeholder}</option>
        {options.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </>
    );
  };

  const clearAllFilters = () => {
    setUriFilter('');
    setProductFilter('');
    setDeviceFilter('');
    setSearchQuery('');
  };

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      backgroundColor: theme === 'light' ? 'white' : 'var(--bg-secondary)',
      borderRadius: '8px',
      boxShadow: theme === 'light' ? 
        '0 1px 3px rgba(0, 0, 0, 0.1)' : 
        '0 1px 3px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Top Row - Clear Filters Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%'
      }}>
        <button
          onClick={clearAllFilters}
          style={{
            padding: '8px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: theme === 'light' ? '#ef4444' : '#dc2626',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: isSmallScreen ? '100%' : 'auto',
            ':hover': {
              backgroundColor: theme === 'light' ? '#dc2626' : '#b91c1c',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Clear All Filters
        </button>
      </div>

      {/* Filters Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(4, 1fr)',
        gap: '16px',
        width: '100%'
      }}>
        {/* Search Input */}
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
              backgroundColor: theme === 'light' ? 'white' : 'var(--bg-tertiary)',
              color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-primary)',
              fontSize: '14px'
            }}
          />
        </div>

        {/* URI Filter */}
        <div>
          <select
            value={uriFilter}
            onChange={(e) => setUriFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
              backgroundColor: theme === 'light' ? 'white' : 'var(--bg-tertiary)',
              color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-primary)',
              fontSize: '14px'
            }}
          >
            {renderOptions(availableURIs, "All URIs")}
          </select>
        </div>

        {/* Product Filter */}
        <div>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
              backgroundColor: theme === 'light' ? 'white' : 'var(--bg-tertiary)',
              color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-primary)',
              fontSize: '14px'
            }}
          >
            {renderOptions(availableProducts, "All Products")}
          </select>
        </div>

        {/* Device Filter */}
        <div>
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
              backgroundColor: theme === 'light' ? 'white' : 'var(--bg-tertiary)',
              color: theme === 'light' ? 'var(--text-primary)' : 'var(--text-primary)',
              fontSize: '14px'
            }}
          >
            {renderOptions(availableDevices, "All Devices")}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GlobalFilters;
