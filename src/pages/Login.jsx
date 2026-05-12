import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export default function Login() {
  const { currentUser, login } = useAuthStore();
  const navigate               = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  if (currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/dashboard' : '/my-tasks'} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email.trim(), password);
    setLoading(false);

    if (result !== 'ok') {
      setError('The email or password you entered is incorrect.');
      return;
    }

    const user = useAuthStore.getState().currentUser;
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-app-bg flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-3/5 bg-app-surface border-r border-app-border flex-col items-center justify-center p-16 gap-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand/10 rounded-xl">
            <Settings2 className="w-9 h-9 text-brand" />
          </div>
          <span className="text-3xl font-bold text-app-text tracking-tight">MaintixPro</span>
        </div>

        <div className="text-center max-w-sm">
          <h1 className="text-4xl font-bold text-app-text leading-snug">
            Predict.<br />Prevent.<br />Perform.
          </h1>
          <p className="text-app-muted mt-5 text-sm leading-relaxed">
            Preventive maintenance management for industrial facilities.
            Monitor equipment health, track tasks, and keep your operations running.
          </p>
        </div>

        <div className="flex gap-10 mt-2">
          {[{ value: '10', label: 'Machines tracked' }, { value: '20', label: 'Active tasks' }, { value: '94%', label: 'Fleet health' }].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-brand">{value}</p>
              <p className="text-xs text-app-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <Settings2 className="w-6 h-6 text-brand" />
            <span className="text-lg font-bold text-app-text">MaintixPro</span>
          </div>

          <h2 className="text-2xl font-bold text-app-text">Sign in</h2>
          <p className="text-sm text-app-muted mt-1 mb-7">Enter your credentials to access your workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2.5 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-app-text">Password</label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2.5 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150 disabled:opacity-50 mt-1"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-app-muted text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
