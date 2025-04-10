import React from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const MetricsCard = ({ 
  scenario, 
  currentScore, 
  trend, 
  entries, 
  theme,
  metricType,
  isSmallScreen
}) => {
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
      min: Math.min(...entries.map(e => parseFloat(e[metricType]) || 0)) - 5,
      max: Math.max(...entries.map(e => parseFloat(e[metricType]) || 0)) + 5
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
      data: entries.map(e => parseFloat(e[metricType]) || 0),
      color: trend >= 0 ? 
        (theme === 'light' ? '#22c55e' : '#4ade80') : 
        (theme === 'light' ? '#ef4444' : '#f87171')
    }]
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isSmallScreen ? 
        'minmax(0, 1fr) auto' : 
        '3fr 80px 120px',
      gap: isSmallScreen ? '8px' : '12px',
      padding: isSmallScreen ? '8px 12px' : '12px 16px',
      borderBottom: `1px solid ${theme === 'light' ? '#e2e8f0' : '#374151'}`,
      alignItems: 'center',
      backgroundColor: currentScore < 70 ? 
        (theme === 'light' ? '#fff1f2' : '#450a0a') : 
        (theme === 'light' ? 'white' : '#1f2937')
    }}>
      <div>
        {/* Page Name */}
        <div style={{ 
          fontSize: isSmallScreen ? '12px' : '13px',
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
          {scenario}
        </div>

        {isSmallScreen && (
          <div style={{
            fontSize: '11px',
            color: trend >= 0 ? 
              (theme === 'light' ? '#22c55e' : '#4ade80') : 
              (theme === 'light' ? '#ef4444' : '#f87171'),
            marginTop: '2px'
          }}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
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
          fontSize: isSmallScreen ? '13px' : '14px',
          fontWeight: '600',
          color: getScoreColor(currentScore),
          textAlign: 'center',
          alignSelf: 'center',
          padding: '4px 0'
        }}>
          {currentScore.toFixed(0)}%
        </div>

        {/* Sparkline - Only show on larger screens */}
        {!isSmallScreen && (
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
              color: trend >= 0 ? 
                (theme === 'light' ? '#22c55e' : '#4ade80') : 
                (theme === 'light' ? '#ef4444' : '#f87171'),
              whiteSpace: 'nowrap'
            }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;
