import React, { useState } from 'react';
import Header from './Header';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Don't show layout on login and register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {isAuthenticated && (
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      )}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
