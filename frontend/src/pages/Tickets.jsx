import { useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../store/authStore';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function Tickets() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tickets');
      setTickets(data);
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      toast.error('Title and description are required');
      return;
    }
    try {
      await api.post('/tickets', newTicket);
      toast.success('Ticket created');
      setNewTicket({ title: '', description: '' });
      fetchTickets();
    } catch {
      toast.error('Failed to create ticket');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={newTicket.title}
          onChange={e => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={newTicket.description}
          onChange={e => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={createTicket}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {loading ? (
        <div>Loading tickets...</div>
      ) : (
        <ul className="space-y-4">
          {tickets.map(ticket => (
            <li key={ticket._id} className="p-4 border rounded hover:bg-gray-50">
              <Link to={`/tickets/${ticket._id}`}>
                <h2 className="text-lg font-semibold">{ticket.title}</h2>
              </Link>
              <p className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
