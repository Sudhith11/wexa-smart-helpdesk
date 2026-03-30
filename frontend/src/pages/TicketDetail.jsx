import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Bot, RefreshCcw, ScrollText, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../lib/api';
import StatusBadge from '../components/StatusBadge';

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [audit, setAudit] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTicket = useCallback(async () => {
    setLoading(true);

    try {
      const [ticketResponse, auditResponse, suggestionResponse] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/tickets/${id}/audit`),
        api.get(`/agent/suggestion/${id}`),
      ]);

      setTicket(ticketResponse.data);
      setAudit(auditResponse.data);
      setSuggestion(suggestionResponse.data);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load this ticket.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  if (loading) {
    return (
      <div className="surface-panel rounded-[2rem] p-8 text-center text-sm text-slate-500">
        Loading ticket details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="surface-panel rounded-[2rem] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600">Unable to load</p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">Ticket unavailable</h1>
        <p className="mt-3 text-sm text-slate-600">{error}</p>
        <Link
          to="/tickets"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tickets
        </Link>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/tickets"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tickets
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
            {ticket.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })} on{' '}
            {format(new Date(ticket.createdAt), 'dd MMM yyyy, h:mm a')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void loadTicket();
            toast.success('Ticket refreshed.');
          }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="surface-panel rounded-[2rem] p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge value={ticket.status} />
              <StatusBadge value={ticket.category} />
            </div>

            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {ticket.description}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Requester
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {ticket.createdBy?.name || 'Customer'}
                </p>
                <p className="text-sm text-slate-500">{ticket.createdBy?.email || 'Unknown email'}</p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Assigned to
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {ticket.assignee?.name || 'Unassigned'}
                </p>
                <p className="text-sm text-slate-500">
                  {ticket.assignee?.email || 'Waiting for support action'}
                </p>
              </div>
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">Assistant recommendation</h2>
                <p className="text-sm text-slate-500">
                  Suggested response, confidence, and linked knowledge articles.
                </p>
              </div>
            </div>

            {suggestion ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge value={suggestion.predictedCategory} label="Predicted category" />
                    <StatusBadge
                      value={suggestion.autoClosed ? 'resolved' : 'waiting_human'}
                      label={`Confidence ${Math.round(suggestion.confidence * 100)}%`}
                    />
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {suggestion.draftReply}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">Referenced knowledge</p>
                  <div className="mt-3 space-y-3">
                    {suggestion.KBItemIds?.length ? (
                      suggestion.KBItemIds.map((article) => (
                        <div key={article._id} className="rounded-3xl border border-slate-200 bg-white px-4 py-4">
                          <p className="font-semibold text-slate-900">{article.title}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(article.tags || []).map((tag) => (
                              <StatusBadge key={tag} value={tag} label={tag} />
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
                        No knowledge base articles were linked to this recommendation.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
                The assistant has not generated a recommendation for this ticket yet.
              </div>
            )}
          </div>
        </section>

        <section className="surface-panel rounded-[2rem] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-200">
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Audit timeline</h2>
              <p className="text-sm text-slate-500">
                Every support action and assistant step captured in sequence.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {audit.length ? (
              audit.map((log) => (
                <div key={log._id} className="relative rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {log.actor || 'system'}
                      </p>
                      <h3 className="mt-2 text-base font-bold text-slate-900">{log.action}</h3>
                    </div>
                    <Sparkles className="h-4 w-4 text-sky-400" />
                  </div>

                  {log.meta?.message && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">{log.meta.message}</p>
                  )}

                  <p className="mt-4 text-sm text-slate-500">
                    {format(new Date(log.createdAt), 'dd MMM yyyy, h:mm a')}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
                No audit entries are available for this ticket yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
