import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import TopBar from '../TopBar';
import Sidebar from '../Sidebar/Sidebar';
import Loading from '../../common/Loading';

interface LayoutProps {
  children: React.ReactNode;
  showTopBar?: boolean;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showTopBar = true, showSidebar = true }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // Si no hay usuario y se requiere TopBar, no mostrar nada (se manejará en ProtectedRoute)
  if ((showTopBar || showSidebar) && !user) {
    return null;
  }

  // Layout para páginas con sidebar (dashboard, productos, etc.)
  if (showSidebar && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        
        <div className="flex-1 ml-64">
          {showTopBar && <TopBar />}
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Layout para páginas sin sidebar (login, register)
  return (
    <div className="min-h-screen bg-gray-50">
      {showTopBar && user && <TopBar />}
      
      <main className={showTopBar ? "flex-1" : "min-h-screen"}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
