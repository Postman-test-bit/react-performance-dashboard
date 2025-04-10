import React, { useState, useEffect } from "react";
import MetricsCard from "../components/MetricsCard";

const BestPracticeChart = ({ data, allData, theme }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'score', order: 'asc' });
  const [columnCount, setColumnCount] = useState(1);

  // Process data outside of hooks to avoid dependencies
  const processData = () => {
    if (!data || data.length === 0) return [];

    let filtered = [...data];

    // Group data by scenario
    const grouped = filtered.reduce((acc, item) => {
      const key = item.scenario;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    // Process and sort scenarios
    return Object.entries(grouped).map(([scenario, entries]) => {
      const sorted = entries
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .reverse();

      const scores = sorted.map(item => parseFloat(item.best_practice_metrics) || 0);
      const currentScore = scores[scores.length - 1];
      const trend = currentScore - scores[0];

      return {
        scenario,
        entries: sorted,
        currentScore,
        trend
      };
    }).sort((a, b) => {
      const { key, order } = sortConfig;
      const multiplier = order === 'asc' ? 1 : -1;
      
      if (key === 'score') {
        return (a.currentScore - b.currentScore) * multiplier;
      } else {
        return (a.trend - b.trend) * multiplier;
      }
    });
  };

  const processedScenarios = processData();

  // Update column count based on screen width and data length
  const getColumnCount = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth < 768) return 1;  // Mobile
    if (window.innerWidth < 1200) return 2; // Tablet
    return processedScenarios.length <= 4 ? 1 : 
           processedScenarios.length <= 9 ? 2 : 3; // Desktop
  };

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };

    handleResize(); // Initial column count setup
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [processedScenarios.length]);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const SortButton = ({ type, label, order }) => (
    <button
      onClick={() => setSortConfig({ key: type, order })}
      style={{
        background: sortConfig.key === type && sortConfig.order === order ? 
          (theme === 'light' ? '#e2e8f0' : '#374151') : 'transparent',
        border: 'none',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        cursor: 'pointer',
        color: theme === 'light' ? '#475569' : '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      {label} {order === 'asc' ? '↑' : '↓'}
    </button>
  );

  const scenariosPerColumn = Math.ceil(processedScenarios.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) => 
    processedScenarios.slice(i * scenariosPerColumn, (i + 1) * scenariosPerColumn)
  );

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{ 
      padding: '20px',
      color: theme === 'light' ? '#1e293b' : '#e2e8f0'
    }}>
      {/* Sort Controls */}
      <div style={{
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        gap: '8px',
        marginBottom: '16px',
        justifyContent: 'flex-end'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: isSmallScreen ? 'column' : 'row',
          alignItems: isSmallScreen ? 'stretch' : 'center',
          gap: '8px',
          backgroundColor: theme === 'light' ? 'white' : '#1f2937',
          padding: '8px',
          borderRadius: '6px',
          boxShadow: theme === 'light' ? 
            '0 1px 2px rgba(0,0,0,0.05)' : 
            '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          <span style={{ 
            fontSize: '12px', 
            color: theme === 'light' ? '#64748b' : '#94a3b8',
            marginBottom: isSmallScreen ? '4px' : '0'
          }}>
            Sort by:
          </span>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isSmallScreen ? '1fr 1fr' : 'auto auto auto auto',
            gap: '4px'
          }}>
            <SortButton type="score" label="Lowest Score" order="asc" />
            <SortButton type="score" label="Highest Score" order="desc" />
            <SortButton type="trend" label="Most Declining" order="asc" />
            <SortButton type="trend" label="Most Improving" order="desc" />
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: isSmallScreen ? '12px' : '20px',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        {columns.map((columnScenarios, columnIndex) => (
          <div key={columnIndex} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            backgroundColor: theme === 'light' ? '#e2e8f0' : '#374151'
          }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isSmallScreen ? 
                'minmax(0, 1fr) auto' : 
                '3fr 80px 120px',
              gap: isSmallScreen ? '8px' : '12px',
              padding: isSmallScreen ? '8px 12px' : '12px 16px',
              backgroundColor: theme === 'light' ? '#f8fafc' : '#111827',
              borderBottom: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
              fontWeight: '600',
              fontSize: '13px'
            }}>
              {isSmallScreen ? (
                <div>Page</div>
              ) : (
                <>
                  <div>Page</div>
                  <div style={{ textAlign: 'center' }}>Latest Score</div>
                  <div style={{ textAlign: 'center' }}>Trend</div>
                </>
              )}
            </div>

            {/* Rows */}
            {columnScenarios.map((scenarioData) => (
              <MetricsCard
                key={scenarioData.scenario}
                scenario={scenarioData.scenario}
                currentScore={scenarioData.currentScore}
                trend={scenarioData.trend}
                entries={scenarioData.entries}
                theme={theme}
                metricType="best_practice_metrics"
                isSmallScreen={isSmallScreen}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestPracticeChart;
