import {BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import KB from './pages/KB';
import { useAuth } from './store/authStore';

function PrivateRoute({children}) {
  const {token} = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
}

export default function App(){
  return (
    <BrowserRouter>
      <nav className="p-2 border-b flex gap-3">
        <Link to="/tickets">Tickets</Link>
        <Link to="/kb">KB</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/tickets" element={<PrivateRoute><Tickets/></PrivateRoute>} />
        <Route path="/tickets/:id" element={<PrivateRoute><TicketDetail/></PrivateRoute>} />
        <Route path="/kb" element={<PrivateRoute><KB/></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/tickets" />} />
      </Routes>
    </BrowserRouter>
  );
}
