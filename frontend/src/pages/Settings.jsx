import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../store/authStore';

export default function Settings() {
  const { user } = useAuth();
  const [config, setConfig] = useState({
    autoClose: true,
    threshold: 0.78,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const { data } = await api.get('/agent/config');

        if (active) {
          setConfig({
            autoClose: data.autoClose,
            threshold: data.threshold,
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load settings.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  async function saveSettings() {
    setSaving(true);

    try {
      const payload = {
        autoClose: config.autoClose,
        threshold: Number(config.threshold),
      };

      const { data } = await api.put('/agent/config', payload);
      setConfig({
        autoClose: data.autoClose,
        threshold: data.threshold,
      });
      toast.success('Assistant settings updated.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="surface-panel rounded-[2rem] p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950">Admin access only</h1>
        <p className="mt-3 max-w-xl text-sm text-slate-600">
          Assistant settings are restricted to WEXA admins because they change how tickets are
          automatically resolved.
        </p>
        <Link
          to="/tickets"
          className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Return to tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="surface-panel rounded-[2rem] p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <Settings2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Assistant settings
          </h1>
          <p className="text-sm text-slate-500">
            Control how WEXA Smart Helpdesk auto-closes tickets after triage.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500">
          Loading settings...
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[1.75rem] bg-slate-50 p-6">
            <label className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5">
              <div>
                <p className="text-sm font-semibold text-slate-900">Auto-close confident tickets</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  When enabled, the assistant can resolve tickets automatically when the confidence
                  score clears the threshold below.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.autoClose}
                onChange={(event) =>
                  setConfig((previous) => ({ ...previous, autoClose: event.target.checked }))
                }
                className="mt-1 h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
            </label>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Confidence threshold</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Tickets auto-close when confidence is at least{' '}
                    <span className="font-semibold text-slate-900">
                      {Math.round(config.threshold * 100)}%
                    </span>
                    .
                  </p>
                </div>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={config.threshold}
                  onChange={(event) =>
                    setConfig((previous) => ({
                      ...previous,
                      threshold: Number(event.target.value),
                    }))
                  }
                  className="w-24 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.threshold}
                onChange={(event) =>
                  setConfig((previous) => ({
                    ...previous,
                    threshold: Number(event.target.value),
                  }))
                }
                className="mt-5 w-full accent-slate-900"
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-slate-900 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
              Live policy preview
            </p>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Current rule</h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              {config.autoClose
                ? `If the assistant reaches ${Math.round(config.threshold * 100)}% confidence or more, the ticket can resolve automatically.`
                : 'Automatic resolution is disabled, so every ticket will stay in the queue for human review.'}
            </p>

            <button
              type="button"
              onClick={() => void saveSettings()}
              disabled={saving}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving settings...' : 'Save assistant policy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
