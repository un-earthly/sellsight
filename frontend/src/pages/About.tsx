import React from 'react';
import { BarChart3, Search, TrendingUp, Shield, Zap, Globe } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights into market trends, pricing patterns, and sales performance across different categories."
    },
    {
      icon: Search,
      title: "Smart Product Discovery",
      description: "Powerful search and filtering capabilities to find exactly what you're looking for in our extensive product database."
    },
    {
      icon: TrendingUp,
      title: "Market Trends",
      description: "Track sales trends over time and identify emerging opportunities in various product categories."
    },
    {
      icon: Shield,
      title: "Reliable Data",
      description: "Continuous data scraping and validation ensures you always have access to the most current market information."
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Stay ahead of the competition with real-time price monitoring and sales tracking capabilities."
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Comprehensive market coverage across multiple platforms and regions for a complete market view."
    }
  ];

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About SellSight</h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
          SellSight is a comprehensive market analysis tool that empowers businesses and entrepreneurs 
          to make data-driven decisions by providing deep insights into product performance, pricing 
          trends, and market opportunities.
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white mb-12">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Transform Your Market Strategy</h2>
          <p className="text-xl opacity-90 mb-6">
            Leverage our advanced scraping technology and analytics platform to gain competitive 
            advantages and identify profitable opportunities in your market.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>24/7 Monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Advanced Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Platform Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10M+</div>
            <div className="text-gray-600">Products Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Data Updates</div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Built with Modern Technology</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚛️</span>
              </div>
              <h3 className="font-semibold text-gray-900">React</h3>
              <p className="text-sm text-gray-600">Frontend Framework</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900">Recharts</h3>
              <p className="text-sm text-gray-600">Data Visualization</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900">Tailwind CSS</h3>
              <p className="text-sm text-gray-600">Styling Framework</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900">Vite</h3>
              <p className="text-sm text-gray-600">Build Tool</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of businesses already using SellSight to make smarter, data-driven decisions 
          and stay ahead of market trends.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
          Contact Sales
        </button>
      </div>
    </div>
  );
};

export default About;