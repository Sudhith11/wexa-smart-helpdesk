import { useState } from 'react';
import { useAuth } from '../store/authStore';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      window.location.href = '/login';
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl mb-4">Register</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white p-2"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="text-sm mt-3">
        Already have an account?{' '}
        <a className="text-blue-600" href="/login">
          Login
        </a>
      </div>
    </div>
  );
}
