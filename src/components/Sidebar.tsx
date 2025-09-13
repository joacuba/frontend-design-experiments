import React from 'react';
import { Package, BarChart3, Settings, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { User } from '../types/auth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'suppliers', label: 'Suppliers', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const getRoleBasedMenuItems = (role: string) => {
  switch (role) {
    case 'admin':
      return menuItems; // Admin sees all tabs
    case 'manager':
      return menuItems.filter(item => 
        ['inventory', 'suppliers', 'settings'].includes(item.id)
      );
    case 'employee':
      return menuItems.filter(item => 
        ['dashboard', 'analytics'].includes(item.id)
      );
    default:
      return [];
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, user }) => {
  const visibleMenuItems = getRoleBasedMenuItems(user.role);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">InventoryPro</h1>
        </div>
        <div className="mt-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            {user.role} Portal
          </span>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};