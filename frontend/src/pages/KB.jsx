import { useCallback, useEffect, useState } from 'react';
import { BookOpen, Pencil, Plus, Save, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../store/authStore';
import StatusBadge from '../components/StatusBadge';

const emptyForm = {
  title: '',
  body: '',
  tags: '',
  status: 'draft',
};

export default function KB() {
  const { user, isAdmin } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [articleForm, setArticleForm] = useState(emptyForm);

  const loadArticles = useCallback(async (searchText = '') => {
    setLoading(true);

    try {
      const { data } = await api.get(`/kb?query=${encodeURIComponent(searchText)}`);
      setResults(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load knowledge base articles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles, user?.role]);

  function resetForm() {
    setEditingId(null);
    setArticleForm(emptyForm);
  }

  async function handleSearch(event) {
    event.preventDefault();
    await loadArticles(query);
  }

  async function handleSaveArticle(event) {
    event.preventDefault();

    if (!articleForm.title.trim() || !articleForm.body.trim()) {
      toast.error('Article title and content are required.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: articleForm.title,
        body: articleForm.body,
        tags: articleForm.tags,
        status: articleForm.status,
      };

      if (editingId) {
        await api.put(`/kb/${editingId}`, payload);
        toast.success('Knowledge base article updated.');
      } else {
        await api.post('/kb', payload);
        toast.success('Knowledge base article created.');
      }

      resetForm();
      await loadArticles(query);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save the article.');
    } finally {
      setSaving(false);
    }
  }

  function startEditing(article) {
    setEditingId(article._id);
    setArticleForm({
      title: article.title,
      body: article.body,
      tags: (article.tags || []).join(', '),
      status: article.status,
    });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this knowledge base article?')) {
      return;
    }

    try {
      await api.delete(`/kb/${id}`);
      toast.success('Knowledge base article removed.');

      if (editingId === id) {
        resetForm();
      }

      await loadArticles(query);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete the article.');
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="surface-panel rounded-[2rem] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
              Knowledge base
            </h1>
            <p className="text-sm text-slate-500">
              Search published answers and, if you are an admin, manage article content.
            </p>
          </div>
        </div>

        <form className="mt-6 flex gap-3" onSubmit={handleSearch}>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            placeholder="Search articles, keywords, or tags"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>

        {isAdmin() && (
          <form className="mt-8 rounded-[1.75rem] bg-slate-50 p-5" onSubmit={handleSaveArticle}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {editingId ? 'Edit article' : 'Create article'}
                </h2>
                <p className="text-sm text-slate-500">
                  Keep WEXA guidance current for support and customers.
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
              >
                Reset
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <input
                value={articleForm.title}
                onChange={(event) =>
                  setArticleForm((previous) => ({ ...previous, title: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Article title"
              />

              <textarea
                rows={6}
                value={articleForm.body}
                onChange={(event) =>
                  setArticleForm((previous) => ({ ...previous, body: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Article content"
              />

              <input
                value={articleForm.tags}
                onChange={(event) =>
                  setArticleForm((previous) => ({ ...previous, tags: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Tags, separated by commas"
              />

              <select
                value={articleForm.status}
                onChange={(event) =>
                  setArticleForm((previous) => ({ ...previous, status: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving ? 'Saving article...' : editingId ? 'Save article' : 'Create article'}
            </button>
          </form>
        )}
      </section>

      <section className="surface-panel rounded-[2rem] p-6">
        <h2 className="text-xl font-bold text-slate-950">Article library</h2>
        <p className="mt-2 text-sm text-slate-500">
          {isAdmin()
            ? 'Published and draft knowledge assets for the WEXA support operation.'
            : 'Published help content available to authenticated users.'}
        </p>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500">
              Loading articles...
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500">
              No articles match this search yet.
            </div>
          ) : (
            results.map((article) => (
              <div key={article._id} className="rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge value={article.status} />
                      {(article.tags || []).map((tag) => (
                        <StatusBadge key={tag} value={tag} label={tag} />
                      ))}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-slate-950">{article.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{article.body}</p>
                  </div>

                  {isAdmin() && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(article)}
                        className="rounded-full border border-slate-200 bg-white p-3 text-slate-600 transition hover:text-sky-700"
                        aria-label={`Edit ${article.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(article._id)}
                        className="rounded-full border border-slate-200 bg-white p-3 text-slate-600 transition hover:text-rose-600"
                        aria-label={`Delete ${article.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Updated {format(new Date(article.updatedAt), 'dd MMM yyyy, h:mm a')}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
