import { useEffect, useState } from 'react';
import { ArrowRight, Bot, Lock, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../store/authStore';

export default function Register() {
  const { register, loading, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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

    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }

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
      await register(formData.name, formData.email, formData.password);
      toast.success('Your account is ready.');
      navigate('/tickets');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create account.');
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-8 sm:px-6">
      <div className="surface-panel w-full rounded-[2rem] p-6 shadow-2xl shadow-slate-200/60 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">WEXA</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
              Create your workspace account
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm text-slate-600">
          New accounts start as customer users. Admin and support agent demo accounts are available
          from the sign-in page if you want to explore the full WEXA workflow.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User className="h-4 w-4" />
                Full name
              </span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              placeholder="Your name"
            />
            {formErrors.name && <p className="mt-2 text-sm text-rose-600">{formErrors.name}</p>}
          </label>

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
              placeholder="Choose a secure password"
            />
            {formErrors.password && (
              <p className="mt-2 text-sm text-rose-600">{formErrors.password}</p>
            )}
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have access?{' '}
          <Link className="font-semibold text-sky-700 hover:text-sky-800" to="/login">
            Return to sign in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
