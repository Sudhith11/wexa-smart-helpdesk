import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/authStore';

export default function Tickets() {
  const { logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTickets = async () => {
    try {
      const { data } = await api.get('/tickets?mine=true');
      setTickets(data);
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const createTicket = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/tickets', { title, description });
      setTitle('');
      setDescription('');
      setTimeout(loadTickets, 900);
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">My Tickets</h1>
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="text-red-600"
        >
          Logout
        </button>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <form onSubmit={createTicket} className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-3"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>

      <ul className="space-y-2">
        {tickets.map((t) => (
          <li
            key={t._id}
            className="border p-2 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-gray-600">
                {t.status} • {t.category}
              </div>
            </div>
            <Link className="text-blue-600" to={`/tickets/${t._id}`}>
              Open
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
