
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './hooks/useAuth';
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products/:typeId" element={<ProductsPage />} />
              <Route path="/products/:typeId/:productId" element={<ProductPage />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
