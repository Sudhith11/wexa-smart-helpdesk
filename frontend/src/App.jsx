import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/AppLayout';
import { useAuth } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import KB from './pages/KB';
import Settings from './pages/Settings';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-panel w-full max-w-md rounded-[2rem] p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">WEXA</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
          Smart Helpdesk
        </h1>
        <p className="mt-3 text-sm text-slate-600">Preparing your workspace...</p>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { token, initialized } = useAuth();

  if (!initialized) {
    return <LoadingScreen />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function HomeRedirect() {
  const { token, initialized } = useAuth();

  if (!initialized) {
    return <LoadingScreen />;
  }

  return <Navigate to={token ? '/tickets' : '/login'} replace />;
}

export default function App() {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/kb" element={<KB />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<HomeRedirect />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '999px',
            padding: '12px 16px',
            fontWeight: 600,
          },
        }}
      />
    </BrowserRouter>
  );
}
