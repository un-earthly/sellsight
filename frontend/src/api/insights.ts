
export const fetchInsights = async () => {
  const response = await fetch('http://localhost:3000/api/dashboard')
  if (!response.ok) {
    throw new Error('Failed to fetch insights');
  }
  const result = await response.json()
  const data = {
    totalProducts: result.overview.totalProducts,
    latestScrapeDate: result.overview.lastScrapeDate,
    averagePrice: result.overview.avgPrice,
    categoryData: result.categorySales.map((item: { category: string, avgSales: number }) => ({
      category: item.category,
      sales: item.avgSales,
    })),
    trendData: result.salesTrend,
  }
  return data;
};