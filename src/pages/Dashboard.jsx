/**
 * Dashboard.jsx
 * Admin-only main dashboard page showing the health of the entire facility.
 *
 * Sections:
 *   1. Page header — title, greeting, Simulate Degradation button, Reset Data button
 *   2. KPI cards row — 4 key metrics computed live from store data
 *   3. Charts row — Tasks by Status (bar) + Equipment Health (donut)
 *   4. Activity feed — last 8 tasks with equipment and technician names
 *
 * All data comes from Zustand stores — nothing is hardcoded.
 * KPI values are memoized so they only recompute when the underlying store changes.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Package, AlertCircle, CheckCircle, Heart, Zap, RotateCcw,
} from 'lucide-react';

import { useEquipmentStore } from '../stores/useEquipmentStore';
import { useTaskStore }      from '../stores/useTaskStore';
import { useAuthStore }      from '../stores/useAuthStore';
import { seedUsers }         from '../data/users';
import KPICard               from '../components/ui/KPICard';
import StatusBadge           from '../components/ui/StatusBadge';
import { timeAgo }           from '../utils/dateHelpers';

// ── Framer Motion page transition variants ────────────────────────────────────
// Applied to the outer wrapper so the page fades + slides in on route change.
const pageVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

// ── Chart color constants ─────────────────────────────────────────────────────
// Defined here (not in JSX) so the same hex values are used in both the chart
// and the custom legend — keeping visual consistency guaranteed.
const TASK_STATUS_COLORS = {
  scheduled:   '#0A84FF',
  in_progress: '#BF5AF2',
  completed:   '#00C896',
  overdue:     '#FF453A',
};

const EQUIPMENT_HEALTH_COLORS = {
  operational: '#00C896',
  warning:     '#FF9F0A',
  critical:    '#FF453A',
  maintenance: '#0A84FF',
  inactive:    '#8B949E',
};

// ── Custom tooltip for the bar chart ─────────────────────────────────────────
// Dark background to match the app theme (Recharts default is light).
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-app-surface border border-app-border rounded-lg px-3 py-2 text-sm">
      <p className="font-medium text-app-text capitalize">{label?.replace('_', ' ')}</p>
      <p className="text-app-muted">{payload[0].value} tasks</p>
    </div>
  );
};

// ── Custom legend for the donut chart ────────────────────────────────────────
const DonutLegend = ({ data }) => (
  <ul className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-3">
    {data.map(({ name, fill, value }) => (
      <li key={name} className="flex items-center gap-1.5 text-xs text-app-muted">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: fill }} />
        <span className="capitalize">{name}</span>
        <span className="text-app-text font-medium">({value})</span>
      </li>
    ))}
  </ul>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { equipment, simulateDegradation, resetToSeed: resetEquipment } = useEquipmentStore();
  const { tasks, resetToSeed: resetTasks }                               = useTaskStore();
  const { currentUser }                                                   = useAuthStore();

  // ── Computed KPI values ──────────────────────────────────────────────────
  // useMemo ensures these are only recalculated when equipment or tasks change,
  // not on every render caused by unrelated state (e.g. UI store).
  const { totalEquipment, overdueTasks, completionRate, avgHealth } = useMemo(() => {
    const totalEquipment  = equipment.length;
    const overdueTasks    = tasks.filter((t) => t.status === 'overdue').length;
    const completedTasks  = tasks.filter((t) => t.status === 'completed').length;
    const completionRate  = tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;
    const avgHealth = equipment.length > 0
      ? Math.round(equipment.reduce((sum, eq) => sum + eq.healthScore, 0) / equipment.length)
      : 0;

    return { totalEquipment, overdueTasks, completionRate, avgHealth };
  }, [equipment, tasks]);

  // Color for the Avg Health KPI card — matches the health ring thresholds
  const healthColor = avgHealth >= 70 ? 'green' : avgHealth >= 40 ? 'amber' : 'red';

  // ── Chart data ───────────────────────────────────────────────────────────
  // Task bar chart: one bar per status, color-coded
  const taskChartData = useMemo(() => {
    const counts = { scheduled: 0, in_progress: 0, completed: 0, overdue: 0 };
    tasks.forEach((t) => { if (counts[t.status] !== undefined) counts[t.status]++; });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      fill: TASK_STATUS_COLORS[name],
    }));
  }, [tasks]);

  // Equipment donut chart: one slice per equipment status
  const equipmentChartData = useMemo(() => {
    const counts = {};
    equipment.forEach((eq) => {
      counts[eq.status] = (counts[eq.status] ?? 0) + 1;
    });
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name,
        value,
        fill: EQUIPMENT_HEALTH_COLORS[name] ?? '#8B949E',
      }));
  }, [equipment]);

  // ── Activity feed ────────────────────────────────────────────────────────
  // Last 8 tasks sorted by createdAt descending — shows the most recent activity
  const recentActivity = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);
  }, [tasks]);

  // ── Helper lookups for the activity feed ─────────────────────────────────
  // Build a quick Map of equipmentId → equipment name to avoid O(n) per row
  const equipmentMap = useMemo(
    () => new Map(equipment.map((eq) => [eq.id, eq.name])),
    [equipment]
  );

  // Build a quick Map of userId → full name from seed data
  const userMap = useMemo(
    () => new Map(seedUsers.map((u) => [u.id, `${u.firstName} ${u.lastName}`])),
    []
  );

  // ── Simulate Degradation handler ─────────────────────────────────────────
  // Calls the store action then shows a toast listing the affected machines.
  const handleSimulateDegradation = () => {
    const degradedNames = simulateDegradation();
    if (degradedNames.length === 0) {
      toast.error('No operational equipment to degrade.');
      return;
    }
    toast.success(`Health dropped: ${degradedNames.join(' & ')}`, {
      icon: '⚡',
      duration: 4000,
    });
  };

  // ── Reset all data handler ────────────────────────────────────────────────
  // Resets both stores to seed data so the demo can be restarted cleanly.
  const handleResetData = () => {
    resetEquipment();
    resetTasks();
    toast.success('All data reset to original seed values.', { icon: '🔄' });
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Section 1: Page Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-app-text">Dashboard</h2>
          <p className="text-sm text-app-muted mt-0.5">
            Good morning, {currentUser?.firstName} 👋
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulate Degradation — key demo button */}
          <button
            onClick={handleSimulateDegradation}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              bg-amber-500/10 border border-amber-500/30 text-amber-400
              hover:bg-amber-500/20 transition-all duration-150 active:scale-95
            "
          >
            <Zap className="w-4 h-4" />
            Simulate Degradation
          </button>

          {/* Reset Data — restores all seed data */}
          <button
            onClick={handleResetData}
            className="
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
              text-app-muted hover:bg-white/5 hover:text-app-text
              transition-all duration-150 active:scale-95
            "
          >
            <RotateCcw className="w-4 h-4" />
            Reset Data
          </button>
        </div>
      </div>

      {/* ── Section 2: KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Equipment"
          value={totalEquipment}
          subtitle="Machines tracked"
          icon={Package}
          color="blue"
        />
        <KPICard
          title="Overdue Tasks"
          value={overdueTasks}
          subtitle="Require immediate action"
          icon={AlertCircle}
          color="red"
        />
        <KPICard
          title="Completion Rate"
          value={completionRate}
          suffix="%"
          subtitle="Of all maintenance tasks"
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          title="Avg Health Score"
          value={avgHealth}
          suffix="/100"
          subtitle="Across all equipment"
          icon={Heart}
          color={healthColor}
        />
      </div>

      {/* ── Section 3: Charts Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Tasks by Status (Bar Chart) ─── */}
        <div className="lg:col-span-2 bg-app-surface border border-app-border rounded-xl p-5">
          <h3 className="text-lg font-semibold text-app-text mb-4">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={taskChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#8B949E', fontSize: 12 }}
                tickFormatter={(v) => v.replace('_', ' ')}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#8B949E', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {taskChartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Right: Equipment Health (Donut Chart) ─── */}
        <div className="bg-app-surface border border-app-border rounded-xl p-5">
          <h3 className="text-lg font-semibold text-app-text mb-4">Equipment Health</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={equipmentChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                paddingAngle={2}
              >
                {equipmentChartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{
                  background: '#161B22',
                  border: '1px solid #21262D',
                  borderRadius: '8px',
                  color: '#E6EDF3',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <DonutLegend data={equipmentChartData} />
        </div>
      </div>

      {/* ── Section 4: Activity Feed ───────────────────────────────────── */}
      <div className="bg-app-surface border border-app-border rounded-xl p-5">
        <h3 className="text-lg font-semibold text-app-text mb-4">Recent Activity</h3>

        {recentActivity.length === 0 ? (
          <p className="text-sm text-app-muted text-center py-8">No task activity yet.</p>
        ) : (
          <ul>
            {recentActivity.map((task, idx) => (
              <li
                key={task.id}
                className={`
                  flex items-center gap-3 py-3 hover:bg-white/[0.02] px-2 -mx-2 rounded-lg
                  ${idx < recentActivity.length - 1 ? 'border-b border-app-border/50' : ''}
                `}
              >
                {/* Status badge */}
                <StatusBadge status={task.status} size="sm" />

                {/* Task title + metadata */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-app-text truncate">
                    {task.title.length > 45
                      ? task.title.slice(0, 42) + '…'
                      : task.title}
                  </p>
                  <p className="text-xs text-app-muted truncate">
                    {equipmentMap.get(task.equipmentId) ?? 'Unknown machine'}
                    {' · '}
                    {userMap.get(task.assignedToId) ?? 'Unassigned'}
                  </p>
                </div>

                {/* Relative timestamp — right aligned */}
                <span className="text-xs text-app-muted shrink-0 ml-2">
                  {timeAgo(task.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
