import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Sun, Moon, LogOut, User, Settings } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore }   from '../../stores/useUIStore';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/equipment': 'Equipment',
  '/tasks':     'Maintenance Tasks',
  '/calendar':  'Maintenance Calendar',
  '/my-tasks':  'My Tasks',
};

export default function TopBar() {
  const { currentUser, logout }             = useAuthStore();
  const { toggleSidebar, darkMode, toggleDarkMode } = useUIStore();
  const { pathname }                        = useLocation();
  const navigate                            = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const pageTitle = pageTitles[pathname] ?? 'MaintixPro';
  const initials  = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : '??';
  const fullName  = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex items-center h-16 px-4 gap-4 bg-app-surface border-b border-app-border shrink-0">
      {/* Left: sidebar toggle + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-app-muted hover:bg-app-border/50 hover:text-app-text transition-all"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-app-text truncate">{pageTitle}</h1>
      </div>

      {/* Center: search */}
      <div className="flex-1 max-w-sm mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search equipment, tasks…"
            className="w-full bg-app-bg border border-app-border rounded-lg pl-9 pr-3 py-2 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors"
          />
        </div>
      </div>

      {/* Right: dark mode toggle + profile avatar */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-app-muted hover:bg-app-border/50 hover:text-app-text transition-all"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Profile avatar + dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center hover:ring-2 hover:ring-brand/40 transition-all"
            aria-label="Open profile menu"
          >
            <span className="text-xs font-bold text-brand">{initials}</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-10 w-60 bg-app-surface border border-app-border rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Profile header */}
              <div className="px-4 py-3 border-b border-app-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-brand">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-app-text truncate">{fullName}</p>
                    <p className="text-xs text-app-muted truncate">{currentUser?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-app-text hover:bg-app-bg transition-colors"
                >
                  <User className="w-4 h-4 text-app-muted" />
                  Profile
                </button>

                <button
                  onClick={() => { toggleDarkMode(); setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-app-text hover:bg-app-bg transition-colors"
                >
                  {darkMode
                    ? <Sun className="w-4 h-4 text-app-muted" />
                    : <Moon className="w-4 h-4 text-app-muted" />}
                  {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-app-border py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

