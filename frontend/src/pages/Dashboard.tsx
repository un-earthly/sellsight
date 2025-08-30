import { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import Charts from '../components/Charts';
import { fetchInsights } from '../api/insights';

interface InsightsData {
  totalProducts: number;
  latestScrapeDate: string;
  averagePrice: number;
  categoryData: Array<{ category: string; sales: number }>;
  trendData: Array<{ date: string; sales: number }>;
}

const Dashboard = () => {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await fetchInsights();
        setInsights(data);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Market insights and product analytics overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Total Products Scraped"
          value={insights.totalProducts.toLocaleString()}
          icon={Package}
          trend={{ value: 12.5, isPositive: true }}
        />
        <KpiCard
          title="Latest Scrape Date"
          value={new Date(insights.latestScrapeDate).toLocaleDateString()}
          icon={Calendar}
          subtitle="Last data update"
        />
        <KpiCard
          title="Average Product Price"
          value={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(insights.averagePrice)}
          icon={DollarSign}
          trend={{ value: 3.2, isPositive: false }}
        />
        <KpiCard
          title="Market Growth"
          value="8.7%"
          icon={TrendingUp}
          trend={{ value: 8.7, isPositive: true }}
          subtitle="vs last quarter"
        />
      </div>

      {/* Charts */}
      <Charts
        categoryData={insights.categoryData}
        trendData={insights.trendData}
      />
    </div>
  );
};

export default Dashboard;