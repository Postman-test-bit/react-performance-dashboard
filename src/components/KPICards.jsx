import React from 'react';

const KPICards = ({ data, theme }) => {
  // Calculate averages from the latest scores of filtered data
  const calculateAverages = () => {
    if (!data || data.length === 0) return null;

    // Debug: Log first item to check data structure
    console.log('Sample data item:', data[0]);

    // Group by scenario to get latest entries
    const scenarioGroups = data.reduce((acc, item) => {
      if (!acc[item.scenario]) {
        acc[item.scenario] = [];
      }
      acc[item.scenario].push(item);
      return acc;
    }, {});

    // Get latest entry for each scenario
    const latestEntries = Object.values(scenarioGroups).map(group => {
      return group.reduce((latest, current) => {
        return !latest || new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
      });
    });

    // Debug: Log a latest entry
    console.log('Sample latest entry:', latestEntries[0]);

    // Calculate averages from latest entries
    const totals = latestEntries.reduce((acc, item) => {
      // Debug: Log the best practices value being added
      console.log('Best practices value:', item.best_practice_metrics);
      
      return {
        performance: acc.performance + parseFloat(item.performance_metrics || 0),
        seo: acc.seo + parseFloat(item.seo_metrics || 0),
        accessibility: acc.accessibility + parseFloat(item.accessibility_metrics || 0),
        bestPractices: acc.bestPractices + parseFloat(item.best_practice_metrics || 0), 
        count: acc.count + 1
      };
    }, { performance: 0, seo: 0, accessibility: 0, bestPractices: 0, count: 0 });

    // Debug: Log totals
    console.log('Totals:', totals);

    return {
      performance: (totals.performance / totals.count).toFixed(1),
      seo: (totals.seo / totals.count).toFixed(1),
      accessibility: (totals.accessibility / totals.count).toFixed(1),
      bestPractices: (totals.bestPractices / totals.count).toFixed(1)
    };
  };

  const averages = calculateAverages();
  if (!averages) return null;

  const getScoreColor = (score) => {
    score = parseFloat(score);
    if (score >= 90) return theme === 'light' ? '#22c55e' : '#4ade80';
    if (score >= 70) return theme === 'light' ? '#3b82f6' : '#60a5fa';
    if (score >= 50) return theme === 'light' ? '#f97316' : '#fb923c';
    return theme === 'light' ? '#ef4444' : '#f87171';
  };

  const cardStyle = {
    backgroundColor: theme === 'light' ? 'white' : 'var(--bg-secondary)',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: theme === 'light' ? 
      '0 1px 3px rgba(0, 0, 0, 0.1)' : 
      '0 1px 3px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-2px)'
    }
  };

  const titleStyle = {
    fontSize: '14px',
    color: theme === 'light' ? 'var(--text-secondary)' : 'var(--text-secondary)',
    marginBottom: '4px'
  };

  const scoreStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: getScoreColor(averages.performance)
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      padding: '1rem',
      width: '100%'
    }}>
      {/* Performance Card */}
      <div style={cardStyle}>
        <div style={{
          fontSize: '24px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme === 'light' ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
          borderRadius: '8px'
        }}>
          ⚡
        </div>
        <div>
          <h3 style={titleStyle}>Performance</h3>
          <p style={scoreStyle}>{averages.performance}%</p>
        </div>
      </div>

      {/* SEO Card */}
      <div style={cardStyle}>
        <div style={{
          fontSize: '24px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme === 'light' ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
          borderRadius: '8px'
        }}>
          🔍
        </div>
        <div>
          <h3 style={titleStyle}>SEO</h3>
          <p style={scoreStyle}>{averages.seo}%</p>
        </div>
      </div>

      {/* Accessibility Card */}
      <div style={cardStyle}>
        <div style={{
          fontSize: '24px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme === 'light' ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
          borderRadius: '8px'
        }}>
          ♿
        </div>
        <div>
          <h3 style={titleStyle}>Accessibility</h3>
          <p style={scoreStyle}>{averages.accessibility}%</p>
        </div>
      </div>

      {/* Best Practices Card */}
      <div style={cardStyle}>
        <div style={{
          fontSize: '24px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme === 'light' ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
          borderRadius: '8px'
        }}>
          ✨
        </div>
        <div>
          <h3 style={{
            ...titleStyle,
            whiteSpace: 'nowrap',
            fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem'
          }}>Best Practices</h3>
          <p style={scoreStyle}>{averages.bestPractices}%</p>
        </div>
      </div>
    </div>
  );
};

export default KPICards;
