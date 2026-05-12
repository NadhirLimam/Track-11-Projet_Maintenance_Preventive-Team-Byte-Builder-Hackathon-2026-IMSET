import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Settings2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/useAuthStore';

export default function Register() {
  const { currentUser, register } = useAuthStore();
  const navigate                   = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/dashboard' : '/my-tasks'} replace />;
  }

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.firstName.trim().length < 2) {
      setError('Please enter your first name.');
      return;
    }
    if (form.lastName.trim().length < 2) {
      setError('Please enter your last name.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = register({
      firstName: form.firstName,
      lastName:  form.lastName,
      email:     form.email,
      password:  form.password,
    });
    setLoading(false);

    if (result === 'exists') {
      setError('An account with that email already exists. Try signing in instead.');
      return;
    }

    toast.success(`Welcome, ${form.firstName}!`);
    navigate('/dashboard', { replace: true });
  };

  const inputClass =
    'w-full bg-app-bg border border-app-border rounded-lg px-3 py-2.5 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors';

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
            Join your team's maintenance workspace. Track equipment health,
            manage tasks, and stay on top of your maintenance schedule.
          </p>
        </div>

        <div className="bg-app-bg border border-app-border rounded-xl p-5 max-w-xs w-full">
          <p className="text-xs font-semibold text-app-muted uppercase tracking-wide mb-3">New accounts</p>
          <ul className="space-y-2 text-sm text-app-muted">
            <li className="flex items-start gap-2">
              <span className="text-brand mt-0.5">—</span>
              <span>Full access to the dashboard, equipment, and task management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand mt-0.5">—</span>
              <span>Create and assign maintenance tasks to your team</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand mt-0.5">—</span>
              <span>Monitor equipment health and respond to alerts</span>
            </li>
          </ul>
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

          <div className="flex items-center gap-2.5 mb-1">
            <UserPlus className="w-5 h-5 text-brand" />
            <h2 className="text-2xl font-bold text-app-text">Create account</h2>
          </div>
          <p className="text-sm text-app-muted mb-7">Fill in your details to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-app-text mb-1.5">First name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={set('firstName')}
                  required
                  autoComplete="given-name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-app-text mb-1.5">Last name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={set('lastName')}
                  required
                  autoComplete="family-name"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                required
                autoComplete="new-password"
                className={inputClass}
              />
              <p className="text-xs text-app-muted mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Confirm password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={set('confirm')}
                required
                autoComplete="new-password"
                className={inputClass}
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
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-app-muted text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
