import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { useTaskStore } from '../stores/useTaskStore';
import { useEquipmentStore } from '../stores/useEquipmentStore';
import { seedUsers } from '../data/users';
import { useAuthStore } from '../stores/useAuthStore';
import StatusBadge from '../components/ui/StatusBadge';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { formatDate } from '../utils/dateHelpers';

const pageVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const STATUS_FILTERS = ['all', 'overdue', 'in_progress', 'scheduled', 'completed'];
const STATUS_LABELS  = { all: 'All', overdue: 'Overdue', in_progress: 'In Progress', scheduled: 'Scheduled', completed: 'Completed' };

const PRIORITY_COLOR = {
  urgent: 'text-red-400',
  high:   'text-amber-400',
  medium: 'text-blue-400',
  low:    'text-app-muted',
};

export default function Tasks() {
  const tasks     = useTaskStore((s) => s.tasks);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const equipment = useEquipmentStore((s) => s.equipment);
  const { registeredUsers = [] } = useAuthStore();

  const [search,       setSearch]      = useState('');
  const [statusFilter, setStatusFilter]= useState('all');
  const [modalOpen,    setModalOpen]   = useState(false);
  const [sortField,    setSortField]   = useState('dueDate');
  const [sortDir,      setSortDir]     = useState('asc');

  // Build lookup maps once
  const equipmentMap = useMemo(
    () => new Map(equipment.map((e) => [e.id, e.name])),
    [equipment]
  );
  const allUsers = useMemo(
    () => [...seedUsers, ...registeredUsers],
    [registeredUsers]
  );
  const userMap = useMemo(
    () => new Map(allUsers.map((u) => [u.id, `${u.firstName} ${u.lastName}`])),
    [allUsers]
  );

  // Status counts for filter tabs
  const counts = useMemo(() => {
    const c = { all: tasks.length, overdue: 0, in_progress: 0, scheduled: 0, completed: 0 };
    tasks.forEach((t) => { if (c[t.status] !== undefined) c[t.status]++; });
    return c;
  }, [tasks]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const displayed = useMemo(() => {
    let list = statusFilter === 'all' ? tasks : tasks.filter((t) => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (equipmentMap.get(t.equipmentId) ?? '').toLowerCase().includes(q) ||
          (userMap.get(t.assignedToId) ?? '').toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      let av = a[sortField] ?? '';
      let bv = b[sortField] ?? '';
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [tasks, statusFilter, search, sortField, sortDir, equipmentMap, userMap]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 inline ml-0.5" />
      : <ChevronDown className="w-3 h-3 inline ml-0.5" />;
  };

  const thClass = 'px-4 py-3 text-left text-xs font-semibold text-app-muted uppercase tracking-wide cursor-pointer select-none hover:text-app-text transition-colors';

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-app-text">Maintenance Tasks</h1>
          <p className="text-sm text-app-muted mt-0.5">{tasks.length} tasks total</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-brand hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          Create task
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, machines, technicians…"
            className="w-full bg-app-surface border border-app-border rounded-lg pl-9 pr-3 py-2 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <div className="flex gap-1 bg-app-surface border border-app-border rounded-lg p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === f ? 'bg-brand text-white' : 'text-app-muted hover:text-app-text'}`}
            >
              {STATUS_LABELS[f]}
              {counts[f] > 0 && (
                <span className={`ml-1.5 ${statusFilter === f ? 'opacity-80' : 'opacity-50'}`}>{counts[f]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-app-text font-medium">No tasks found</p>
          <p className="text-sm text-app-muted mt-1">
            {search ? 'Try a different search term' : 'Create your first task to get started'}
          </p>
        </div>
      ) : (
        <div className="bg-app-surface border border-app-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-app-border bg-app-bg/40">
                <tr>
                  <th className={thClass} onClick={() => toggleSort('title')}>
                    Task <SortIcon field="title" />
                  </th>
                  <th className={thClass}>Status</th>
                  <th className={`${thClass} hidden md:table-cell`} onClick={() => toggleSort('priority')}>
                    Priority <SortIcon field="priority" />
                  </th>
                  <th className={`${thClass} hidden lg:table-cell`}>Machine</th>
                  <th className={`${thClass} hidden lg:table-cell`}>Assigned to</th>
                  <th className={thClass} onClick={() => toggleSort('dueDate')}>
                    Due <SortIcon field="dueDate" />
                  </th>
                  <th className={`${thClass} hidden sm:table-cell`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {displayed.map((task) => (
                  <tr key={task.id} className="hover:bg-app-bg/30 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-app-text truncate">{task.title}</p>
                      <p className="text-xs text-app-muted mt-0.5 truncate">
                        {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={task.status} size="sm" />
                    </td>
                    <td className={`px-4 py-3 hidden md:table-cell font-medium ${PRIORITY_COLOR[task.priority] ?? 'text-app-muted'}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-app-muted">
                      {equipmentMap.get(task.equipmentId) ?? '—'}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-app-muted">
                      {userMap.get(task.assignedToId) ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-app-muted whitespace-nowrap">
                      {task.dueDate ? formatDate(task.dueDate) : '—'}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {task.status !== 'completed' && (
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="bg-app-bg border border-app-border rounded-md px-2 py-1 text-xs text-app-text focus:outline-none focus:border-brand transition-colors"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      )}
                      {task.status === 'completed' && (
                        <span className="text-xs text-app-muted">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.div>
  );
}

