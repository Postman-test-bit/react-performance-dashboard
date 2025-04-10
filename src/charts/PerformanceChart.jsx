import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PerformanceChart = ({ data, theme = 'light' }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'score', order: 'asc' });
  const [columnCount, setColumnCount] = useState(1);

  // Process data outside of hooks to avoid dependencies
  const processData = () => {
    if (!data || data.length === 0) return [];

    // Group data by scenario
    const grouped = data.reduce((acc, item) => {
      const key = item.scenario;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    // Process and sort scenarios
    return Object.entries(grouped).map(([scenario, entries]) => {
      const sorted = entries
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))  // Sort chronologically (oldest to newest)
        .slice(-3);  // Get last 3 entries

      const scores = sorted.map(item => parseFloat(item.performance_metrics) || 0);
      const currentScore = scores[scores.length - 1];  // Latest score
      const previousScore = scores[scores.length - 2] || scores[scores.length - 1];  // Previous score or latest if not available
      const trend = currentScore - previousScore;  // Calculate trend between latest and previous run

      // Debug logging
      console.log('Scenario:', scenario, {
        scores,
        currentScore,
        previousScore,
        trend
      });

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
  }, [processedScenarios.length]); // Add dependency since we use it in getColumnCount

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const getScoreColor = (score) => {
    if (score >= 90) return theme === 'light' ? '#22c55e' : '#4ade80';
    if (score >= 70) return theme === 'light' ? '#3b82f6' : '#60a5fa';
    if (score >= 50) return theme === 'light' ? '#f97316' : '#fb923c';
    return theme === 'light' ? '#ef4444' : '#f87171';
  };

  const sparklineOptions = {
    chart: {
      type: 'line',
      height: 30,
      width: 80,
      backgroundColor: 'transparent',
      margin: [2, 0, 2, 0],
      style: {
        overflow: 'visible'
      }
    },
    title: null,
    credits: { enabled: false },
    xAxis: {
      visible: false
    },
    yAxis: {
      visible: false,
      min: Math.min(...processedScenarios[0].entries.map(e => parseFloat(e.performance_metrics))) - 5,
      max: Math.max(...processedScenarios[0].entries.map(e => parseFloat(e.performance_metrics))) + 5
    },
    tooltip: {
      hideDelay: 0,
      outside: true,
      shared: true,
      backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
      style: {
        color: theme === 'light' ? '#1e293b' : '#e2e8f0'
      }
    },
    legend: { enabled: false },
    plotOptions: {
      series: {
        animation: false,
        lineWidth: 2,
        marker: {
          enabled: true,
          radius: 3
        },
        states: {
          hover: {
            lineWidth: 2
          }
        }
      }
    },
    series: [{
      data: processedScenarios[0].entries.map(e => parseFloat(e.performance_metrics)),
      color: processedScenarios[0].trend > 0 ?  // Changed from >= to > to only show green for actual improvements
        (theme === 'light' ? '#22c55e' : '#4ade80') : 
        (theme === 'light' ? '#ef4444' : '#f87171')
    }]
  };

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

  return (
    <div style={{ 
      padding: '20px',
      color: theme === 'light' ? '#1e293b' : '#e2e8f0'
    }}>
      {/* Sort Controls */}
      <div style={{
        display: 'flex',
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        gap: '8px',
        marginBottom: '16px',
        justifyContent: 'flex-end'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          alignItems: window.innerWidth < 768 ? 'stretch' : 'center',
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
            marginBottom: window.innerWidth < 768 ? '4px' : '0'
          }}>
            Sort by:
          </span>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr 1fr' : 'auto auto auto auto',
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
        gap: window.innerWidth < 768 ? '12px' : '20px',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        {columns.map((columnScenarios, columnIndex) => (
          <div key={columnIndex} style={{
            backgroundColor: theme === 'light' ? 'white' : '#1f2937',
            borderRadius: '8px',
            boxShadow: theme === 'light' ? 
              '0 1px 3px rgba(0,0,0,0.1)' : 
              '0 1px 3px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? 
                'minmax(0, 1fr) auto' : 
                '3fr 80px 120px',
              gap: window.innerWidth < 768 ? '8px' : '12px',
              padding: window.innerWidth < 768 ? '8px 12px' : '12px 16px',
              backgroundColor: theme === 'light' ? '#f8fafc' : '#111827',
              borderBottom: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
              fontWeight: '600',
              color: theme === 'light' ? '#475569' : '#94a3b8'
            }}>
              {window.innerWidth < 768 ? (
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
              <div key={scenarioData.scenario} style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 768 ? 
                  'minmax(0, 1fr) auto' : 
                  '3fr 80px 120px',
                gap: window.innerWidth < 768 ? '8px' : '12px',
                padding: window.innerWidth < 768 ? '8px 12px' : '12px 16px',
                borderBottom: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
                alignItems: 'center',
                backgroundColor: scenarioData.currentScore < 70 ? 
                  (theme === 'light' ? '#fff1f2' : '#450a0a') : 
                  (theme === 'light' ? 'white' : '#1f2937')
              }}>
                <div>
                  {/* Page Name */}
                  <div style={{ 
                    fontSize: window.innerWidth < 768 ? '12px' : '13px',
                    fontWeight: '500',
                    wordBreak: 'break-word',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4',
                    minHeight: '2.8em',
                    margin: '4px 0'
                  }}>
                    {scenarioData.scenario}
                  </div>

                  {window.innerWidth < 768 && (
                    <div style={{
                      fontSize: '11px',
                      color: scenarioData.trend >= 0 ? 
                        (theme === 'light' ? '#22c55e' : '#4ade80') : 
                        (theme === 'light' ? '#ef4444' : '#f87171'),
                      marginTop: '2px'
                    }}>
                      {scenarioData.trend > 0 ? '↑' : '↓'} {Math.abs(scenarioData.trend).toFixed(1)}%
                    </div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {/* Current Score */}
                  <div style={{ 
                    fontSize: window.innerWidth < 768 ? '13px' : '14px',
                    fontWeight: '600',
                    color: getScoreColor(scenarioData.currentScore),
                    textAlign: 'center',
                    alignSelf: 'center',
                    padding: '4px 0'
                  }}>
                    {scenarioData.currentScore.toFixed(0)}%
                  </div>

                  {/* Sparkline - Only show on larger screens */}
                  {window.innerWidth >= 768 && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      alignSelf: 'center',
                      padding: '4px 0'
                    }}>
                      <HighchartsReact 
                        highcharts={Highcharts} 
                        options={sparklineOptions}
                      />
                      <div style={{ 
                        marginLeft: '4px',
                        fontSize: '11px',
                        fontWeight: '500',
                        color: scenarioData.trend >= 0 ? 
                          (theme === 'light' ? '#22c55e' : '#4ade80') : 
                          (theme === 'light' ? '#ef4444' : '#f87171'),
                        whiteSpace: 'nowrap'
                      }}>
                        {scenarioData.trend > 0 ? '↑' : '↓'} {Math.abs(scenarioData.trend).toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;
