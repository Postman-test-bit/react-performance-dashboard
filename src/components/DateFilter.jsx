import React from 'react';

const DateFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange, theme }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label
          htmlFor="start-date"
          style={{
            fontSize: '12px',
            color: theme === 'light' ? '#64748b' : '#94a3b8'
          }}
        >
          Start Date
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate || ''}
          onChange={(e) => onStartDateChange(e.target.value)}
          style={{
            padding: '6px 8px',
            borderRadius: '4px',
            border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
            backgroundColor: theme === 'light' ? 'white' : '#1f2937',
            color: theme === 'light' ? '#1e293b' : '#e2e8f0',
            fontSize: '14px'
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label
          htmlFor="end-date"
          style={{
            fontSize: '12px',
            color: theme === 'light' ? '#64748b' : '#94a3b8'
          }}
        >
          End Date
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate || ''}
          onChange={(e) => onEndDateChange(e.target.value)}
          style={{
            padding: '6px 8px',
            borderRadius: '4px',
            border: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
            backgroundColor: theme === 'light' ? 'white' : '#1f2937',
            color: theme === 'light' ? '#1e293b' : '#e2e8f0',
            fontSize: '14px'
          }}
        />
      </div>
    </div>
  );
};

export default DateFilter;
