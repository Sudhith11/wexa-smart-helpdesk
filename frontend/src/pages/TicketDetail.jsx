import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../store/authStore';

export default function TicketDetail() {
  const { id } = useParams();
  const { logout } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [audit, setAudit] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const t = await api.get(`/tickets/${id}`);
      setTicket(t.data);
      const a = await api.get(`/tickets/${id}/audit`);
      setAudit(a.data);
      const s = await api.get(`/agent/suggestion/${id}`);
      setSuggestion(s.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 1500); // real-time refresh
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!ticket) return <div className="p-4">Ticket not found</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">{ticket.title}</h2>
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="text-red-600 text-sm"
          >
            Logout
          </button>
        </div>

        <p className="mb-2">{ticket.description}</p>
        <div className="text-sm text-gray-700">
          Status: {ticket.status} | Category: {ticket.category}
        </div>

        {suggestion && (
          <div className="mt-4 border p-3 rounded">
            <div className="font-semibold">Agent Suggestion</div>
            <div className="whitespace-pre-wrap text-sm mt-2">
              {suggestion.draftReply}
            </div>
            <div className="text-xs mt-2 text-gray-500">
              Confidence: {suggestion.confidence}
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Audit</h3>
        <ul className="space-y-2 text-sm">
          {audit.map((log) => (
            <li key={log._id} className="border p-2 rounded">
              <div>{log.action}</div>
              <div className="text-gray-500">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
