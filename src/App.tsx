import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './lib/apollo-client';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import Dashboard from './components/dashboard/Dashboard';
import CompanyOnboarding from './components/onboarding/CompanyOnboarding';
import ProductsPage from './components/products/ProductsPage';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import Loading from './components/common/Loading/Loading';
import Layout from './components/layout/Layout';

const AppRoutes: React.FC = () => {
  const { user, isLoading, hasCompanies } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // Si el usuario está autenticado pero no tiene empresas, ir al onboarding
  const shouldShowOnboarding = user && !hasCompanies();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to={shouldShowOnboarding ? "/onboarding" : "/dashboard"} replace />
          ) : (
            <Layout showTopBar={false} showSidebar={false}>
              <Login />
            </Layout>
          )
        } 
      />
      <Route 
        path="/register" 
        element={
          user ? (
            <Navigate to={shouldShowOnboarding ? "/onboarding" : "/dashboard"} replace />
          ) : (
            <Layout showTopBar={false} showSidebar={false}>
              <Register />
            </Layout>
          )
        } 
      />
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <Layout showTopBar={true} showSidebar={false}>
              {shouldShowOnboarding ? <CompanyOnboarding /> : <Navigate to="/dashboard" replace />}
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout showTopBar={true} showSidebar={true}>
              {shouldShowOnboarding ? <Navigate to="/onboarding" replace /> : <Dashboard />}
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products" 
        element={
          <ProtectedRoute>
            <Layout showTopBar={true} showSidebar={true}>
              {shouldShowOnboarding ? <Navigate to="/onboarding" replace /> : <ProductsPage />}
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          <Navigate to={
            user 
              ? (shouldShowOnboarding ? "/onboarding" : "/dashboard") 
              : "/login"
          } replace /> 
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;