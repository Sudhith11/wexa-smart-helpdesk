import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import KB from './pages/KB';
import { useAuth } from './store/authStore';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { token, logout } = useAuth();

  return (
    <BrowserRouter>
      <nav className="p-2 border-b flex gap-3 items-center">
        {token && (
          <>
            <Link to="/tickets">Tickets</Link>
            <Link to="/kb">KB</Link>
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="ml-auto text-red-600"
            >
              Logout
            </button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/tickets"
          element={
            <PrivateRoute>
              <Tickets />
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <PrivateRoute>
              <TicketDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/kb"
          element={
            <PrivateRoute>
              <KB />
            </PrivateRoute>
          }
        />

        {/* Redirect any unknown path */}
        <Route path="*" element={<Navigate to={token ? "/tickets" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
