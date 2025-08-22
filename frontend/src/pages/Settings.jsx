import { useState, useEffect } from 'react';
import { useAuth } from '../store/authStore';
import toast from 'react-hot-toast';
import api from '../lib/api';

export default function Settings() {
  const { user } = useAuth();
  const [config, setConfig] = useState({
    autoClose: true,
    threshold: 0.7
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current config from backend
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/agent/config');
        setConfig(data);
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveSettings = async () => {
    setLoading(true);
    try {
      await api.put('/agent/config', config);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.role || user.role !== 'admin') {
    return <div className="p-4">Access denied. Admins only.</div>;
  }

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.autoClose}
              onChange={e => setConfig(prev => ({ ...prev, autoClose: e.target.checked }))}
              className="h-4 w-4"
            />
            Auto-close tickets above threshold
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">Confidence Threshold</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={config.threshold}
            onChange={e => setConfig(prev => ({ ...prev, threshold: parseFloat(e.target.value) }))}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={saveSettings}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
