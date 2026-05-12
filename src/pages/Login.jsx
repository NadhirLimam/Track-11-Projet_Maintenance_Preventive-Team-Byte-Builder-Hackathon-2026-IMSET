/**
 * Login.jsx
 * Public login page — accessible without authentication.
 * Redirects already-logged-in users to their home page immediately.
 *
 * Layout (desktop): two columns — brand panel left (60%) + form right (40%)
 * Layout (mobile):  form panel only, centered
 *
 * Features:
 *   - Email + password form with validation feedback
 *   - Two Quick Demo buttons for instant demo login (Admin / Technician)
 *   - On success: admin → /dashboard, technician → /my-tasks
 */

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Settings2, Zap } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export default function Login() {
  const { currentUser, login, loginAs } = useAuthStore();
  const navigate                         = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // If already logged in, redirect to the appropriate home page
  if (currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/dashboard' : '/my-tasks'} replace />;
  }

  // handleSubmit: validates the form and calls login()
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = login(email.trim(), password);
    setLoading(false);

    if (!success) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    // Redirect based on role after successful login
    const user = useAuthStore.getState().currentUser;
    navigate(user?.role === 'admin' ? '/dashboard' : '/my-tasks', { replace: true });
  };

  // handleQuickLogin: bypasses the form for demo convenience
  const handleQuickLogin = (role) => {
    loginAs(role);
    navigate(role === 'admin' ? '/dashboard' : '/my-tasks', { replace: true });
  };

  return (
    <div className="min-h-screen bg-app-bg flex">
      {/* ── Left brand panel (hidden on mobile) ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-3/5 bg-app-surface border-r border-app-border flex-col items-center justify-center p-12 gap-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand/10 rounded-2xl">
            <Settings2 className="w-10 h-10 text-brand" />
          </div>
          <span className="text-3xl font-bold text-app-text">MaintixPro</span>
        </div>

        <div className="text-center max-w-md">
          <p className="text-4xl font-bold text-app-text leading-tight">
            Predict.
            <br />
            Prevent.
            <br />
            Perform.
          </p>
          <p className="text-app-muted mt-4 text-base leading-relaxed">
            Smart preventive maintenance management for industrial facilities.
            Keep your machines running at peak performance.
          </p>
        </div>

        {/* Stats row for visual interest */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-xs mt-4">
          {[
            { value: '10', label: 'Machines' },
            { value: '20', label: 'Tasks' },
            { value: '99%', label: 'Uptime' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-brand">{value}</p>
              <p className="text-xs text-app-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <Settings2 className="w-7 h-7 text-brand" />
            <span className="text-xl font-bold text-app-text">MaintixPro</span>
          </div>

          <h2 className="text-2xl font-bold text-app-text mb-1">Welcome back</h2>
          <p className="text-sm text-app-muted mb-6">Sign in to your account</p>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@maintixpro.com"
                required
                className="
                  w-full bg-app-bg border border-app-border rounded-lg px-3 py-2.5
                  text-sm text-app-text placeholder:text-app-muted
                  focus:outline-none focus:border-brand transition-colors
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="
                  w-full bg-app-bg border border-app-border rounded-lg px-3 py-2.5
                  text-sm text-app-text placeholder:text-app-muted
                  focus:outline-none focus:border-brand transition-colors
                "
              />
            </div>

            {/* Error feedback */}
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-brand hover:bg-blue-500 active:scale-95
                text-white text-sm font-medium py-2.5 rounded-lg
                transition-all duration-150 disabled:opacity-50
              "
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-app-border" />
            <span className="text-xs text-app-muted">or try a demo account</span>
            <div className="flex-1 h-px bg-app-border" />
          </div>

          {/* Quick Demo buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="
                flex items-center justify-center gap-2
                bg-brand/10 border border-brand/30 text-brand
                text-sm font-medium py-2.5 rounded-lg
                hover:bg-brand/20 transition-all active:scale-95
              "
            >
              <Zap className="w-4 h-4" />
              Admin Demo
            </button>
            <button
              onClick={() => handleQuickLogin('technician')}
              className="
                flex items-center justify-center gap-2
                bg-emerald-500/10 border border-emerald-500/30 text-emerald-400
                text-sm font-medium py-2.5 rounded-lg
                hover:bg-emerald-500/20 transition-all active:scale-95
              "
            >
              <Zap className="w-4 h-4" />
              Tech Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
