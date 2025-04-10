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

  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    width: '100%',
    cursor: 'pointer'
  };

  const labelStyle = {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '500'
  };

  return (
    <div className="card" style={{ 
      margin: '20px',
      padding: '20px',
    }}>
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      }}>
        {/* Search Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label 
            htmlFor="search"
            style={labelStyle}
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by any field..."
            style={selectStyle}
          />
        </div>

        {/* URI Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label 
            htmlFor="uri-filter"
            style={labelStyle}
          >
            URI
          </label>
          <select
            id="uri-filter"
            value={uriFilter}
            onChange={(e) => setUriFilter(e.target.value)}
            style={selectStyle}
          >
            {renderOptions(availableURIs, "All URIs")}
          </select>
        </div>

        {/* Product Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label 
            htmlFor="product-filter"
            style={labelStyle}
          >
            Product
          </label>
          <select
            id="product-filter"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            style={selectStyle}
          >
            {renderOptions(availableProducts, "All Products")}
          </select>
        </div>

        {/* Device Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label 
            htmlFor="device-filter"
            style={labelStyle}
          >
            Device
          </label>
          <select
            id="device-filter"
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            style={selectStyle}
          >
            {renderOptions(availableDevices, "All Devices")}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GlobalFilters;
