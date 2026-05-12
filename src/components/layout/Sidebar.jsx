/**
 * Sidebar.jsx
 * Left navigation panel for MaintixPro.
 *
 * Behavior:
 *   - Admins see: Dashboard, Equipment, Tasks, Calendar
 *   - Technicians see: My Tasks only
 *   - Collapses to icon-only mode (w-16) when sidebarOpen is false
 *   - Active route gets a blue left border, blue text, and a subtle blue bg tint
 *   - Bottom section shows the user's initials avatar, full name, role, and logout
 */

import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  CalendarDays,
  CheckSquare,
  LogOut,
  Settings2,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';

// navLinks: route definitions for admin users
const adminLinks = [
  { to: '/dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
  { to: '/equipment', label: 'Equipment',  Icon: Wrench },
  { to: '/tasks',     label: 'Tasks',      Icon: ClipboardList },
  { to: '/calendar',  label: 'Calendar',   Icon: CalendarDays },
];

// techLinks: route definitions for technician users
const techLinks = [
  { to: '/my-tasks', label: 'My Tasks', Icon: CheckSquare },
];

export default function Sidebar() {
  const { currentUser, logout }  = useAuthStore();
  const { sidebarOpen }          = useUIStore();
  const navigate                 = useNavigate();

  const links = [...adminLinks, ...techLinks];

  // Generate initials from first and last name for the avatar circle
  const initials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : '??';

  // handleLogout: clears auth state and redirects to the login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        flex flex-col h-screen bg-app-surface border-r border-app-border
        transition-all duration-200 ease-in-out shrink-0
        ${sidebarOpen ? 'w-60' : 'w-16'}
      `}
    >
      {/* ── Logo / Brand ─────────────────────────────────────────────────── */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-app-border shrink-0`}>
        <div className="flex items-center justify-center w-8 h-8 bg-brand/10 rounded-lg shrink-0">
          <Settings2 className="w-5 h-5 text-brand" />
        </div>
        {sidebarOpen && (
          <span className="text-base font-bold text-app-text tracking-tight whitespace-nowrap">
            MaintixPro
          </span>
        )}
      </div>

      {/* ── Navigation Links ─────────────────────────────────────────────── */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {links.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                title={!sidebarOpen ? label : undefined} // Tooltip in collapsed mode
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group relative
                  ${isActive
                    ? 'bg-brand/10 text-brand border-l-2 border-brand pl-[10px]'
                    : 'text-app-muted hover:bg-white/5 hover:text-app-text border-l-2 border-transparent pl-[10px]'
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── User Section (bottom) ─────────────────────────────────────────── */}
      <div className="border-t border-app-border p-3 shrink-0">
        {/* User avatar + info row */}
        <div className={`flex items-center gap-3 px-1 mb-2 ${!sidebarOpen && 'justify-center'}`}>
          {/* Initials avatar circle */}
          <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-brand">{initials}</span>
          </div>

          {/* Name and role — hidden in collapsed mode */}
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-app-text truncate">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <span className="text-xs capitalize text-app-muted">
                {currentUser?.role}
              </span>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          title={!sidebarOpen ? 'Logout' : undefined}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
            text-app-muted hover:bg-red-500/10 hover:text-red-400
            transition-all duration-150
            ${!sidebarOpen && 'justify-center'}
          `}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
