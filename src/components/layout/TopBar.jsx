/**
 * TopBar.jsx
 * Horizontal top navigation bar that spans the content area.
 *
 * Structure (left → center → right):
 *   Left:   Hamburger toggle (calls toggleSidebar) + current page title
 *   Center: Search input (cosmetic for demo — not wired to real search logic)
 *   Right:  Dark mode toggle + user initials avatar
 *
 * The page title is derived from the current pathname so it always
 * matches whatever page the user is on without any prop drilling.
 */

import { useLocation } from 'react-router-dom';
import { Menu, Search, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore }   from '../../stores/useUIStore';

// pageTitles: maps route paths to human-readable page titles
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/equipment': 'Equipment',
  '/tasks':     'Maintenance Tasks',
  '/calendar':  'Maintenance Calendar',
  '/my-tasks':  'My Tasks',
};

export default function TopBar() {
  const { currentUser }                    = useAuthStore();
  const { toggleSidebar, darkMode, toggleDarkMode } = useUIStore();
  const { pathname }                       = useLocation();

  // Derive page title from current route; fall back to app name
  const pageTitle = pageTitles[pathname] ?? 'MaintixPro';

  // Generate initials for the avatar circle
  const initials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : '??';

  return (
    <header className="flex items-center h-16 px-4 gap-4 bg-app-surface border-b border-app-border shrink-0">
      {/* ── Left: sidebar toggle + page title ──────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-app-muted hover:bg-white/5 hover:text-app-text transition-all"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-app-text truncate">
          {pageTitle}
        </h1>
      </div>

      {/* ── Center: search input ────────────────────────────────────────── */}
      <div className="flex-1 max-w-sm mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search equipment, tasks…"
            className="
              w-full bg-app-bg border border-app-border rounded-lg
              pl-9 pr-3 py-2 text-sm text-app-text placeholder:text-app-muted
              focus:outline-none focus:border-brand transition-colors
            "
          />
        </div>
      </div>

      {/* ── Right: dark mode toggle + avatar ───────────────────────────── */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Dark mode toggle — flips the darkMode flag in UIStore */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-app-muted hover:bg-white/5 hover:text-app-text transition-all"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User avatar circle with initials */}
        <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
          <span className="text-xs font-bold text-brand">{initials}</span>
        </div>
      </div>
    </header>
  );
}
