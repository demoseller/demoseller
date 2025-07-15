// src/App.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout'; // <-- Import the new layout
import { StoreSettingsProvider } from './contexts/StoreSettingsContext'; // Import the new provider
import { HelmetProvider } from 'react-helmet-async';



import Index from './pages/Index';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import ConfirmationPage from './pages/ConfirmationPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
        <HelmetProvider>

    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreSettingsProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                        <Route path="/" element={<MainLayout><Index /></MainLayout>} />
                        <Route path="/products/:typeId" element={<MainLayout><ProductsPage /></MainLayout>} />
                        <Route path="/products/:typeId/:productId" element={<MainLayout><ProductPage /></MainLayout>} />
                        <Route path="/confirmation" element={<MainLayout><ConfirmationPage /></MainLayout>} />

                        {/* Routes without the main footer and sticky button */}
                        <Route
                          path="/dashboard"
                          element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                          }
                        />
                        <Route path="/auth" element={<AuthPage />} />

                        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
                        </Routes>
                        <Toaster />
                      </div>
                      </Router>
                    </StoreSettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
        </HelmetProvider>

  );
}

export default App;