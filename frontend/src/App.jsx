import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './store/authStore';
import Login from './pages/Login';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import KB from './pages/KB';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { token, logout, initializeAuth, isAdmin } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <BrowserRouter>
        <nav className="p-4 bg-white border-b flex items-center space-x-4">
          <Link to="/" className="font-bold text-lg">TicketsKB</Link>
          {token && (
            <>
              <Link to="/tickets" className="hover:underline">Tickets</Link>
              {isAdmin() && (
                <Link to="/kb" className="hover:underline">Knowledge Base</Link>
              )}
              <Link to="/settings" className="hover:underline">Settings</Link>
              <button
                onClick={() => logout()}
                className="ml-auto text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/tickets"
            element={<PrivateRoute><Tickets /></PrivateRoute>}
          />
          <Route
            path="/tickets/:id"
            element={<PrivateRoute><TicketDetail /></PrivateRoute>}
          />
          <Route
            path="/kb"
            element={<PrivateRoute><KB /></PrivateRoute>}
          />
          <Route
            path="/settings"
            element={<PrivateRoute><Settings /></PrivateRoute>}
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={<Navigate to={token ? "/tickets" : "/login"} replace />}
          />
          <Route
            path="*"
            element={<Navigate to={token ? "/tickets" : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}
