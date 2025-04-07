export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const calculateAverageData = (data) => {
  const totalTests = data.length;
  return {
    performance_metrics:
      data.reduce((sum, d) => sum + d.performance_metrics, 0) / totalTests,
    accessibility_metrics:
      data.reduce((sum, d) => sum + d.accessibility_metrics, 0) / totalTests,
    seo_metrics: data.reduce((sum, d) => sum + d.seo_metrics, 0) / totalTests,
    best_practice_metrics:
      data.reduce((sum, d) => sum + d.best_practice_metrics, 0) / totalTests,
  };
};
