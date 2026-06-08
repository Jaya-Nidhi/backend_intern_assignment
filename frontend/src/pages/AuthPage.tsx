import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await api.post('/auth/register', { email, password, role });
        setSuccess('Account created! Please sign in.');
        setMode('login');
        setPassword('');
      } else {
        const res = await api.post('/auth/login', { email, password });
        login(res.data.data.token, res.data.data.user);
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight">NoteVault</span>
          </div>
          <p className="text-sm text-slate-500">
            {mode === 'login' ? 'Sign in to your workspace' : 'Create your account'}
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-ink-700/50 rounded-lg mb-5">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  mode === m ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-jade-500/10 border border-jade-500/20 text-jade-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" className="input-field"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Min 6 chars, 1 uppercase, 1 number' : '••••••••'}
                className="input-field"
              />
            </div>
            {mode === 'register' && (
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Role</label>
                <select
                  value={role} onChange={e => setRole(e.target.value as 'USER' | 'ADMIN')}
                  className="input-field cursor-pointer"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-1 flex items-center justify-center gap-2">
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-4 p-3 rounded-lg bg-ink-700/40 border border-white/5 text-xs text-slate-500 font-mono">
              {/* <p className="text-slate-400 font-sans font-medium text-xs mb-1.5">Demo Credentials</p> */}
              {/* <p>admin@example.com / Admin123</p>
              <p>user@example.com / User1234</p> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
