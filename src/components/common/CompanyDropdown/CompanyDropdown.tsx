import React, { useState, useRef, useEffect } from 'react';
import { useCompanyDropdown } from '../../../hooks/useCompanies';

const CompanyDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    activeCompany,
    companies,
    shouldShowDropdown,
    dropdownItems,
    selectCompany,
  } = useCompanyDropdown();

  // Debug logs - comentados para producción

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Si no hay múltiples empresas, no mostrar dropdown
  if (!shouldShowDropdown) {
    return activeCompany ? (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-700">
          {activeCompany.name}
        </span>
      </div>
    ) : null;
  }

  const handleCompanySelect = (companyId: string) => {
    selectCompany(companyId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="max-w-32 truncate">
          {activeCompany?.name || 'Seleccionar empresa'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {/* Header */}
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
              Mis Empresas ({companies.length})
            </div>
            
            {/* Company Items */}
            {dropdownItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleCompanySelect(item.id)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                  item.isActive ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {item.isActive && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      )}
                      <p className={`text-sm font-medium truncate ${
                        item.isActive ? 'text-indigo-900' : 'text-gray-900'
                      }`}>
                        {item.label}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`text-xs ${
                        item.isActive ? 'text-indigo-700' : 'text-gray-500'
                      }`}>
                        {item.sublabel}
                      </span>
                      <span className={`text-xs ${
                        item.isActive ? 'text-indigo-600' : 'text-gray-400'
                      }`}>
                        {item.memberCount} miembro{item.memberCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  {item.isActive && (
                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDropdown;
