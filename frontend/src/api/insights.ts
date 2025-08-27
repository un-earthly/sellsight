// Mock data for demonstration - replace with actual API calls
export const fetchInsights = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock insights data
  return {
    totalProducts: 125847,
    latestScrapeDate: new Date().toISOString(),
    averagePrice: 89.99,
    categoryData: [
      { category: 'Electronics', sales: 15420 },
      { category: 'Clothing', sales: 12350 },
      { category: 'Home & Garden', sales: 9800 },
      { category: 'Sports', sales: 8900 },
      { category: 'Books', sales: 7200 },
      { category: 'Beauty', sales: 6800 },
      { category: 'Toys', sales: 5500 },
    ],
    trendData: [
      { date: 'Jan 2024', sales: 12500 },
      { date: 'Feb 2024', sales: 13200 },
      { date: 'Mar 2024', sales: 11800 },
      { date: 'Apr 2024', sales: 14500 },
      { date: 'May 2024', sales: 16200 },
      { date: 'Jun 2024', sales: 15800 },
      { date: 'Jul 2024', sales: 17200 },
      { date: 'Aug 2024', sales: 18500 },
      { date: 'Sep 2024', sales: 19200 },
      { date: 'Oct 2024', sales: 20100 },
      { date: 'Nov 2024', sales: 21500 },
      { date: 'Dec 2024', sales: 22800 },
    ],
  };
};

// Uncomment and modify this for actual API integration:
/*
export const fetchInsights = async () => {
  try {
    const response = await fetch('/api/insights');
    if (!response.ok) {
      throw new Error('Failed to fetch insights');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }
};
*/