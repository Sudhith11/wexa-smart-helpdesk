import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from '../store/authStore';

export default function KB() {
  const { logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/kb?query=${encodeURIComponent(query)}`);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">Knowledge Base</h1>
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

      <div className="flex gap-2 mb-3">
        <input
          className="border p-2 flex-1"
          placeholder="Search KB"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={search} className="bg-blue-600 text-white px-3">
          Search
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <ul className="space-y-2">
        {results.map((r) => (
          <li key={r._id} className="border p-2 rounded">
            <div className="font-semibold">{r.title}</div>
            <div className="text-sm text-gray-600">{r.tags?.join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
