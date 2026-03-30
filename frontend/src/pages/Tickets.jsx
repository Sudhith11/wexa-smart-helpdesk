import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, PlusCircle, RefreshCcw, Sparkles, Ticket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../store/authStore';
import StatusBadge from '../components/StatusBadge';

export default function Tickets() {
  const navigate = useNavigate();
  const { user, isSupport } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '' });

  const fetchTickets = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get('/tickets');
      setTickets(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTickets();
  }, [fetchTickets]);

  const metrics = useMemo(() => {
    const total = tickets.length;
    const resolved = tickets.filter((ticket) => ticket.status === 'resolved').length;
    const human = tickets.filter((ticket) => ticket.status === 'waiting_human').length;

    return [
      { label: 'Total tickets', value: total },
      { label: 'Resolved by flow', value: resolved },
      { label: 'Needs human review', value: human },
    ];
  }, [tickets]);

  async function handleCreateTicket(event) {
    event.preventDefault();

    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast.error('Please add both a title and a description.');
      return;
    }

    setCreating(true);

    try {
      const { data } = await api.post('/tickets', newTicket);
      toast.success('Ticket created and triaged.');
      setNewTicket({ title: '', description: '' });
      await fetchTickets();
      navigate(`/tickets/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create the ticket.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            <Sparkles className="h-4 w-4" />
            {isSupport() ? 'Support Queue' : 'Customer Workspace'}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {isSupport() ? 'See every support request in one place.' : 'Create and track support requests.'}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {isSupport()
              ? 'Review WEXA tickets, inspect AI-generated recommendations, and jump into the requests that need human attention.'
              : 'Submit a request, let the assistant classify it, and review the recommendation and audit trail from the detail view.'}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {metrics.map((metric) => (
            <div key={metric.label} className="surface-panel rounded-3xl p-5">
              <p className="text-sm font-medium text-slate-500">{metric.label}</p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{metric.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form className="surface-panel rounded-[2rem] p-6" onSubmit={handleCreateTicket}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Create a ticket</h2>
              <p className="text-sm text-slate-500">Describe the issue so the assistant can triage it.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Title</span>
              <input
                value={newTicket.title}
                onChange={(event) =>
                  setNewTicket((previous) => ({ ...previous, title: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Example: Login error after password reset"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
              <textarea
                value={newTicket.description}
                onChange={(event) =>
                  setNewTicket((previous) => ({ ...previous, description: event.target.value }))
                }
                rows={7}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Share what happened, when it started, and what outcome you need."
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Creating ticket...' : 'Create and triage'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="surface-panel rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {user?.role === 'user' ? 'My tickets' : 'Open operations queue'}
              </h2>
              <p className="text-sm text-slate-500">
                Review current support activity and jump into the full detail view.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void fetchTickets()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500">
                Loading tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center">
                <Ticket className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">No tickets yet</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Create the first ticket to see WEXA Smart Helpdesk start triaging requests.
                </p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/tickets/${ticket._id}`}
                  className="block rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge value={ticket.status} />
                        <StatusBadge value={ticket.category} />
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-slate-950">{ticket.title}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        {ticket.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                    <span>{format(new Date(ticket.createdAt), 'dd MMM yyyy, h:mm a')}</span>
                    {ticket.createdBy?.name && user?.role !== 'user' && (
                      <span>Created by {ticket.createdBy.name}</span>
                    )}
                    {ticket.agentSuggestionId?.confidence !== undefined && (
                      <span>
                        Confidence {Math.round(ticket.agentSuggestionId.confidence * 100)}%
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
