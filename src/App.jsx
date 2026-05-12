import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import Layout    from './components/layout/Layout';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Tasks     from './pages/Tasks';
import Calendar  from './pages/Calendar';
import MyTasks   from './pages/MyTasks';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuthStore();
  return currentUser ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index           element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/tasks"     element={<Tasks />} />
        <Route path="/calendar"  element={<Calendar />} />
        <Route path="/my-tasks"  element={<MyTasks />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
