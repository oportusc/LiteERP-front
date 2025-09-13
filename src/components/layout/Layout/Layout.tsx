import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import TopBar from '../TopBar';
import Loading from '../../common/Loading';

interface LayoutProps {
  children: React.ReactNode;
  showTopBar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showTopBar = true }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // Si no hay usuario y se requiere TopBar, no mostrar nada (se manejará en ProtectedRoute)
  if (showTopBar && !user) {
    return null;
  }

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
