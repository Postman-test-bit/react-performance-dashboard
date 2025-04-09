import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PerformanceChart = ({ data, theme = 'light' }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'score', order: 'asc' });

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Group data by scenario
  const grouped = data.reduce((acc, item) => {
    const key = item.scenario;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // Process and sort scenarios
  const processedScenarios = Object.entries(grouped).map(([scenario, entries]) => {
    const sorted = entries
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .reverse();

    const scores = sorted.map(item => parseFloat(item.performance_metrics) || 0);
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

  const getScoreColor = (score) => {
    if (score >= 90) return theme === 'light' ? '#22c55e' : '#4ade80';
    if (score >= 70) return theme === 'light' ? '#3b82f6' : '#60a5fa';
    if (score >= 50) return theme === 'light' ? '#f97316' : '#fb923c';
    return theme === 'light' ? '#ef4444' : '#f87171';
  };

  // Split scenarios into columns based on count
  const columnCount = processedScenarios.length <= 4 ? 1 : 
                     processedScenarios.length <= 9 ? 2 : 3;
  
  const scenariosPerColumn = Math.ceil(processedScenarios.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) => 
    processedScenarios.slice(i * scenariosPerColumn, (i + 1) * scenariosPerColumn)
  );

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

  return (
    <div style={{ 
      padding: '20px',
      color: theme === 'light' ? '#1e293b' : '#e2e8f0'
    }}>
      {/* Sort Controls */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        justifyContent: 'flex-end'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          backgroundColor: theme === 'light' ? 'white' : '#1f2937',
          padding: '4px',
          borderRadius: '6px',
          boxShadow: theme === 'light' ? 
            '0 1px 2px rgba(0,0,0,0.05)' : 
            '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          <span style={{ 
            fontSize: '12px', 
            color: theme === 'light' ? '#64748b' : '#94a3b8' 
          }}>
            Sort by:
          </span>
          <SortButton type="score" label="Lowest Score" order="asc" />
          <SortButton type="score" label="Highest Score" order="desc" />
          <SortButton type="trend" label="Most Declining" order="asc" />
          <SortButton type="trend" label="Most Improving" order="desc" />
        </div>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: '20px',
        maxWidth: columnCount === 1 ? '600px' : '1400px',
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
              gridTemplateColumns: '3fr 80px 120px',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: theme === 'light' ? '#f8fafc' : '#111827',
              borderBottom: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
              fontWeight: '600',
              color: theme === 'light' ? '#475569' : '#94a3b8'
            }}>
              <div>Page</div>
              <div style={{ textAlign: 'center' }}>Latest Score</div>
              <div style={{ textAlign: 'center' }}>Trend</div>
            </div>

            {/* Rows */}
            {columnScenarios.map((scenarioData) => {
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
                  min: Math.min(...scenarioData.entries.map(e => parseFloat(e.performance_metrics))) - 5,
                  max: Math.max(...scenarioData.entries.map(e => parseFloat(e.performance_metrics))) + 5
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
                  data: scenarioData.entries.map(e => parseFloat(e.performance_metrics)),
                  color: scenarioData.trend >= 0 ? 
                    (theme === 'light' ? '#22c55e' : '#4ade80') : 
                    (theme === 'light' ? '#ef4444' : '#f87171')
                }]
              };

              return (
                <div key={scenarioData.scenario} style={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 80px 120px',
                  gap: '12px',
                  padding: '12px 16px',
                  borderBottom: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
                  alignItems: 'center',
                  backgroundColor: scenarioData.currentScore < 70 ? 
                    (theme === 'light' ? '#fff1f2' : '#450a0a') : 
                    (theme === 'light' ? 'white' : '#1f2937')
                }}>
                  {/* Page Name */}
                  <div style={{ 
                    fontSize: '13px',
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

                  {/* Current Score */}
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: '600',
                    color: getScoreColor(scenarioData.currentScore),
                    textAlign: 'center',
                    alignSelf: 'center',
                    padding: '4px 0'
                  }}>
                    {scenarioData.currentScore.toFixed(0)}%
                  </div>

                  {/* Sparkline */}
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
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;
