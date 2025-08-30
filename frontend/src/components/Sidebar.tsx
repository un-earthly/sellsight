import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, Info, Lightbulb, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: BarChart3 },
    { path: '/products', name: 'Products', icon: Package },
    { path: '/brainstorming', name: 'Ideas', icon: Lightbulb },
    { path: '/about', name: 'About', icon: Info },
  ];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-16'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center space-x-3 transition-opacity duration-200 ${isExpanded ? 'flex' : 'hidden'
            }`}>
            <BarChart3 className="h-8 w-8 text-blue-600 flex-shrink-0" />
            {isExpanded && (
              <span className="text-xl font-bold text-gray-800 whitespace-nowrap">SellSight</span>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
          >
            {isExpanded ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6">
          <div className="space-y-2 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (location.pathname === '/' && item.path === '/dashboard');

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${isActive
                    ? 'text-blue-600 bg-blue-50 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  title={!isExpanded ? item.name : undefined}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                    }`} />

                  {isExpanded && (
                    <span className="whitespace-nowrap">{item.name}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className={`transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'
            }`}>
            {isExpanded && (
              <div className="text-xs text-gray-500 text-center">
                <p className="font-medium">SellSight v1.0</p>
                <p>Market Analytics Platform</p>
              </div>
            )}
          </div>

          {!isExpanded && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-1 z-40 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>
    </>
  );
};

export default Sidebar;