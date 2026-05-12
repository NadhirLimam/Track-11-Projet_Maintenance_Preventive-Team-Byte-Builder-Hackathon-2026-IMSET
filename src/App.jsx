// App.jsx
// Root component. Defines all routes with role-based protection.
//
// Route protection:
//   ProtectedRoute — redirects to /login if no user is logged in
//   AdminRoute     — redirects technicians to /my-tasks (they can't access admin pages)
//
// Route map:
//   /           → redirects to /dashboard (or /login via ProtectedRoute)
//   /login      → public, no auth required
//   /dashboard  → admin only
//   /equipment  → admin only
//   /tasks      → admin only
//   /calendar   → admin only
//   /my-tasks   → technician only (but admin can also access)

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import Layout    from './components/layout/Layout';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Tasks     from './pages/Tasks';
import Calendar  from './pages/Calendar';
import MyTasks   from './pages/MyTasks';

// ProtectedRoute: renders children only when a user is logged in.
// Redirects to /login otherwise — preserves the intended destination.
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuthStore();
  return currentUser ? children : <Navigate to="/login" replace />;
};

// AdminRoute: renders children only when the logged-in user is an admin.
// Technicians are redirected to /my-tasks — the only page they can access.
const AdminRoute = ({ children }) => {
  const { currentUser } = useAuthStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'admin') return <Navigate to="/my-tasks" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public route — no auth required */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes — all wrapped in the Layout shell */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Root redirect: send / to /dashboard (Layout's ProtectedRoute handles auth) */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Admin-only pages */}
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/equipment" element={<AdminRoute><Equipment /></AdminRoute>} />
        <Route path="/tasks"     element={<AdminRoute><Tasks /></AdminRoute>} />
        <Route path="/calendar"  element={<AdminRoute><Calendar /></AdminRoute>} />

        {/* Technician page (accessible to both roles) */}
        <Route path="/my-tasks"  element={<MyTasks />} />
      </Route>

      {/* Catch-all: redirect unknown routes to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
