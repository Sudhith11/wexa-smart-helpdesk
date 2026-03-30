import { useEffect, useState } from 'react';
import { ArrowRight, Bot, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../store/authStore';

const demoAccounts = [
  {
    label: 'Customer',
    email: 'user@helpdesk.com',
    password: 'user123',
    description: 'Raise support requests and track responses.',
  },
  {
    label: 'Support Agent',
    email: 'agent@helpdesk.com',
    password: 'agent123',
    description: 'Review tickets that need human follow-up.',
  },
  {
    label: 'Admin',
    email: 'admin@helpdesk.com',
    password: 'admin123',
    description: 'Manage KB articles and assistant thresholds.',
  },
];

export default function Login() {
  const { login, loading, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: demoAccounts[0].email,
    password: demoAccounts[0].password,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (token) {
      navigate('/tickets');
    }
  }, [token, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((previous) => ({ ...previous, [name]: '' }));
    }
  }

  function validateForm() {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required.';
    } else if (!formData.email.includes('@')) {
      errors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back to WEXA Smart Helpdesk.');
      navigate('/tickets');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to sign in.');
    }
  }

  function applyDemoAccount(account) {
    setFormData({ email: account.email, password: account.password });
    setFormErrors({});
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-5rem] h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute bottom-0 right-[-6rem] h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-100 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            WEXA Support Operations
          </div>

          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
              Help customers faster with AI-assisted triage.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              WEXA Smart Helpdesk combines agent suggestions, knowledge base search, and audit
              visibility so your team can move from intake to resolution with confidence.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="surface-panel rounded-3xl p-5">
              <Bot className="h-6 w-6 text-sky-700" />
              <h2 className="mt-4 text-base font-bold text-slate-900">AI triage</h2>
              <p className="mt-2 text-sm text-slate-600">
                Classify tickets instantly and draft first responses.
              </p>
            </div>
            <div className="surface-panel rounded-3xl p-5">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
              <h2 className="mt-4 text-base font-bold text-slate-900">Audit visibility</h2>
              <p className="mt-2 text-sm text-slate-600">
                Review every assistant action with full operational traceability.
              </p>
            </div>
            <div className="surface-panel rounded-3xl p-5">
              <ArrowRight className="h-6 w-6 text-slate-900" />
              <h2 className="mt-4 text-base font-bold text-slate-900">Team-ready flow</h2>
              <p className="mt-2 text-sm text-slate-600">
                Move work from customers to support and admin teams in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-panel rounded-[2rem] p-6 shadow-2xl shadow-slate-200/60 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">WEXA</p>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Sign in</h2>
            </div>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Mail className="h-4 w-4" />
                Email
              </span>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="you@wexa.com"
              />
              {formErrors.email && <p className="mt-2 text-sm text-rose-600">{formErrors.email}</p>}
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Lock className="h-4 w-4" />
                Password
              </span>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Enter your password"
              />
              {formErrors.password && (
                <p className="mt-2 text-sm text-rose-600">{formErrors.password}</p>
              )}
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Access the workspace'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Demo access</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">One click</p>
            </div>

            <div className="space-y-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.label}
                  type="button"
                  onClick={() => applyDemoAccount(account)}
                  className="flex w-full items-start justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-sky-200 hover:bg-sky-50/70"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{account.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{account.description}</p>
                    <p className="mt-2 text-xs font-medium text-slate-400">{account.email}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-600">
            Need a fresh account?{' '}
            <Link className="font-semibold text-sky-700 hover:text-sky-800" to="/register">
              Create one now
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
