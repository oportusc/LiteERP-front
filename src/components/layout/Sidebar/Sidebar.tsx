import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
    },
    {
      id: 'products',
      label: 'Productos',
      icon: '🥜',
      path: '/products',
    }
  ];

  return (
    <aside className={`
      bg-gray-900 text-white min-h-screen transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-16'}
      fixed left-0 top-0 z-30 flex flex-col
    `}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🥜</div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-white">Frutos Secos</h1>
              <p className="text-sm text-gray-400">Gestión de Inventario</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                  ${!isOpen ? 'justify-center' : ''}
                `}
                title={!isOpen ? item.label : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className={`flex items-center ${!isOpen ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Usuario</p>
              <p className="text-xs text-gray-400 truncate">Administrador</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
