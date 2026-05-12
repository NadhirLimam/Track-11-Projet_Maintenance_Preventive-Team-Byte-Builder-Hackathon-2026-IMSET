import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, CheckCircle2, AlertTriangle, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/useAuthStore';
import { useTaskStore } from '../stores/useTaskStore';

const pageVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

function Section({ title, icon, children }) {
  return (
    <div className="bg-app-surface border border-app-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-app-border">
        <span className="text-app-muted">{icon}</span>
        <h2 className="text-sm font-semibold text-app-text">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function Profile() {
  const { currentUser, updateProfile, changePassword } = useAuthStore();
  const tasks = useTaskStore((s) => s.tasks);

  // ── Profile edit form ─────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName ?? '',
    lastName:  currentUser?.lastName  ?? '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  const profileChanged =
    profileForm.firstName.trim() !== currentUser?.firstName ||
    profileForm.lastName.trim()  !== currentUser?.lastName;

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      toast.error('First and last name are required');
      return;
    }
    setProfileSaving(true);
    setTimeout(() => {
      updateProfile({ firstName: profileForm.firstName, lastName: profileForm.lastName });
      toast.success('Profile updated');
      setProfileSaving(false);
    }, 400);
  };

  // ── Password form ─────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      toast.error('All password fields are required');
      return;
    }
    if (pwForm.next.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setPwSaving(true);
    setTimeout(() => {
      const result = changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
      if (result === 'ok') {
        toast.success('Password changed successfully');
        setPwForm({ current: '', next: '', confirm: '' });
      } else if (result === 'wrong') {
        toast.error('Current password is incorrect');
      } else {
        toast.error('Something went wrong');
      }
      setPwSaving(false);
    }, 400);
  };

  // ── Task stats ────────────────────────────────────────────────────
  const myTasks = useMemo(
    () => tasks.filter((t) => t.assignedToId === currentUser?.id),
    [tasks, currentUser]
  );

  const stats = useMemo(() => {
    const counts = { completed: 0, in_progress: 0, overdue: 0, scheduled: 0 };
    myTasks.forEach((t) => { if (counts[t.status] !== undefined) counts[t.status]++; });
    return counts;
  }, [myTasks]);

  const initials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : '??';

  const togglePw = (field) => setShowPw((p) => ({ ...p, [field]: !p[field] }));

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-5"
    >
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-app-text">My Profile</h1>
        <p className="text-sm text-app-muted mt-0.5">Manage your account details and password</p>
      </div>

      {/* Avatar + identity card */}
      <div className="bg-app-surface border border-app-border rounded-xl p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-brand">{initials}</span>
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-app-text">
            {currentUser?.firstName} {currentUser?.lastName}
          </p>
          <p className="text-sm text-app-muted truncate">{currentUser?.email}</p>
          <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20 capitalize">
            {currentUser?.role ?? 'user'}
          </span>
        </div>

        {/* Quick stats */}
        <div className="ml-auto flex gap-4 flex-shrink-0">
          {[
            { label: 'Done',     value: stats.completed,   color: 'text-emerald-400' },
            { label: 'Active',   value: stats.in_progress, color: 'text-purple-400'  },
            { label: 'Overdue',  value: stats.overdue,     color: 'text-red-400'     },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-app-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit profile */}
      <Section title="Personal Information" icon={<User className="w-4 h-4" />}>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-app-muted mb-1.5">First name</label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))}
                className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-app-muted mb-1.5">Last name</label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-app-muted mb-1.5">Email address</label>
            <input
              type="email"
              value={currentUser?.email ?? ''}
              disabled
              className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2 text-sm text-app-muted opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-app-muted mt-1">Email cannot be changed</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!profileChanged || profileSaving}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              {profileSaving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </Section>

      {/* Change password */}
      <Section title="Change Password" icon={<Lock className="w-4 h-4" />}>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          {[
            { field: 'current', label: 'Current password' },
            { field: 'next',    label: 'New password' },
            { field: 'confirm', label: 'Confirm new password' },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-app-muted mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={showPw[field] ? 'text' : 'password'}
                  value={pwForm[field]}
                  onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2 pr-10 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors"
                  placeholder={label}
                  autoComplete={field === 'current' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => togglePw(field)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text transition-colors"
                  tabIndex={-1}
                >
                  {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          {pwForm.next && pwForm.confirm && pwForm.next !== pwForm.confirm && (
            <div className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              Passwords do not match
            </div>
          )}
          {pwForm.next && pwForm.confirm && pwForm.next === pwForm.confirm && pwForm.next.length >= 6 && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Passwords match
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pwSaving}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Lock className="w-4 h-4" />
              {pwSaving ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </Section>
    </motion.div>
  );
}
