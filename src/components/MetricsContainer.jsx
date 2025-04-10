import React, { useState } from 'react';
import TabsContainer from './TabsContainer';
import PerformanceChart from '../charts/PerformanceChart';
import SEOChart from '../charts/SEOChart';
import AccessibilityChart from '../charts/AccessibilityChart';
import BestPracticeChart from '../charts/BestPracticeChart';

const MetricsContainer = ({ data, allData, theme }) => {
  const [activeTab, setActiveTab] = useState('performance');

  const renderChart = () => {
    switch (activeTab) {
      case 'performance':
        return <PerformanceChart data={data} allData={allData} theme={theme} />;
      case 'seo':
        return <SEOChart data={data} allData={allData} theme={theme} />;
      case 'accessibility':
        return <AccessibilityChart data={data} allData={allData} theme={theme} />;
      case 'bestPractices':
        return <BestPracticeChart data={data} allData={allData} theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#f8fafc' : '#111827',
      minHeight: '100vh'
    }}>
      <TabsContainer 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        theme={theme} 
      />
      {renderChart()}
    </div>
  );
};

export default MetricsContainer;
