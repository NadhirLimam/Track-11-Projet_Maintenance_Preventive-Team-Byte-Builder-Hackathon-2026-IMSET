import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react';
import { useTaskStore } from '../stores/useTaskStore';
import { useEquipmentStore } from '../stores/useEquipmentStore';
import { useAuthStore } from '../stores/useAuthStore';
import StatusBadge from '../components/ui/StatusBadge';
import { formatDate } from '../utils/dateHelpers';

const pageVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const TABS = [
  { key: 'all',         label: 'All tasks' },
  { key: 'overdue',     label: 'Overdue' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'scheduled',   label: 'Upcoming' },
  { key: 'completed',   label: 'Completed' },
];

const PRIORITY_COLOR = {
  urgent: 'text-red-400 bg-red-500/10 border-red-500/20',
  high:   'text-amber-400 bg-amber-500/10 border-amber-500/20',
  medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  low:    'text-app-muted bg-app-border/40 border-app-border',
};

const TYPE_ICON = {
  preventive:  <Circle className="w-3.5 h-3.5" />,
  corrective:  <AlertTriangle className="w-3.5 h-3.5" />,
  inspection:  <Clock className="w-3.5 h-3.5" />,
  calibration: <CheckCircle2 className="w-3.5 h-3.5" />,
};

export default function MyTasks() {
  const tasks          = useTaskStore((s) => s.tasks);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const equipment      = useEquipmentStore((s) => s.equipment);
  const { currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState('all');

  const equipmentMap = useMemo(
    () => new Map(equipment.map((e) => [e.id, e])),
    [equipment]
  );

  // Tasks assigned to the current user
  const myTasks = useMemo(
    () => tasks.filter((t) => t.assignedToId === currentUser?.id),
    [tasks, currentUser]
  );

  const counts = useMemo(() => {
    const c = { all: myTasks.length, overdue: 0, in_progress: 0, scheduled: 0, completed: 0 };
    myTasks.forEach((t) => { if (c[t.status] !== undefined) c[t.status]++; });
    return c;
  }, [myTasks]);

  const displayed = useMemo(() => {
    const list = activeTab === 'all' ? myTasks : myTasks.filter((t) => t.status === activeTab);
    const order = { overdue: 0, in_progress: 1, scheduled: 2, completed: 3 };
    return [...list].sort((a, b) => {
      const diff = (order[a.status] ?? 4) - (order[b.status] ?? 4);
      return diff !== 0 ? diff : (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
    });
  }, [myTasks, activeTab]);

  const statusActions = {
    scheduled:   [{ label: 'Start task',    value: 'in_progress' }],
    in_progress: [{ label: 'Mark complete', value: 'completed'   }],
    overdue:     [{ label: 'Start task',    value: 'in_progress' }, { label: 'Mark complete', value: 'completed' }],
    completed:   [],
  };

  if (myTasks.length === 0) {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible"
        className="flex flex-col items-center justify-center h-64 text-center"
      >
        <CheckCircle2 className="w-10 h-10 text-app-border mb-3" />
        <p className="text-app-text font-medium">No tasks assigned to you yet</p>
        <p className="text-sm text-app-muted mt-1">Tasks assigned to your account will appear here</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-app-text">My Tasks</h1>
        <p className="text-sm text-app-muted mt-0.5">
          {counts.overdue > 0
            ? `${counts.overdue} overdue — ${counts.in_progress} in progress`
            : `${myTasks.length} total tasks assigned to you`}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Overdue',     count: counts.overdue,     color: 'text-red-400',     bg: 'bg-red-500/10' },
          { label: 'In Progress', count: counts.in_progress, color: 'text-purple-400',  bg: 'bg-purple-500/10' },
          { label: 'Upcoming',    count: counts.scheduled,   color: 'text-blue-400',    bg: 'bg-blue-500/10' },
          { label: 'Completed',   count: counts.completed,   color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`${bg} border border-app-border rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-app-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-app-surface border border-app-border rounded-lg p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === key ? 'bg-brand text-white' : 'text-app-muted hover:text-app-text'}`}
          >
            {label}
            {counts[key] > 0 && (
              <span className={`ml-1.5 ${activeTab === key ? 'opacity-80' : 'opacity-50'}`}>{counts[key]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Task cards */}
      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-app-muted text-sm">No tasks in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((task) => {
            const eq      = equipmentMap.get(task.equipmentId);
            const actions = statusActions[task.status] ?? [];

            return (
              <div
                key={task.id}
                className={`bg-app-surface border rounded-xl p-4 transition-colors ${task.status === 'overdue' ? 'border-red-500/30' : 'border-app-border'}`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  {/* Left: task info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-app-muted ${TYPE_ICON[task.type] ? '' : ''}`}>
                        {TYPE_ICON[task.type]}
                      </span>
                      <p className="text-sm font-semibold text-app-text">{task.title}</p>
                      <StatusBadge status={task.status} size="sm" />
                    </div>

                    {task.description && (
                      <p className="text-xs text-app-muted mt-1 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {eq && (
                        <span className="text-xs text-app-muted">{eq.name}</span>
                      )}
                      {eq?.location && (
                        <span className="text-xs text-app-muted">{eq.location}</span>
                      )}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[task.priority] ?? PRIORITY_COLOR.low}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-app-muted capitalize">{task.type}</span>
                    </div>
                  </div>

                  {/* Right: dates + actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-app-muted">Due</p>
                      <p className={`text-xs font-medium ${task.status === 'overdue' ? 'text-red-400' : 'text-app-text'}`}>
                        {task.dueDate ? formatDate(task.dueDate) : '—'}
                      </p>
                    </div>

                    {actions.length > 0 && (
                      <div className="flex gap-2">
                        {actions.map(({ label, value }) => (
                          <button
                            key={value}
                            onClick={() => updateTaskStatus(task.id, value)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all active:scale-95
                              ${value === 'completed'
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-brand/10 border border-brand/30 text-brand hover:bg-brand/20'
                              }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}

                    {task.status === 'completed' && task.completedAt && (
                      <p className="text-xs text-app-muted">Done {formatDate(task.completedAt)}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

