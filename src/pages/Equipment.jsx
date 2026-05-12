import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useEquipmentStore } from '../stores/useEquipmentStore';
import EquipmentCard from '../components/equipment/EquipmentCard';
import AddEquipmentModal from '../components/equipment/AddEquipmentModal';

const pageVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const FILTERS = ['all', 'critical', 'warning', 'operational', 'maintenance'];

const FILTER_LABELS = {
  all:         'All',
  critical:    'Critical',
  warning:     'Warning',
  operational: 'Operational',
  maintenance: 'Maintenance',
};

export default function Equipment() {
  const equipment = useEquipmentStore((s) => s.equipment);

  const [search,      setSearch]      = useState('');
  const [activeFilter, setFilter]     = useState('all');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [selected,    setSelected]    = useState(null);

  // Counts per status for filter tabs
  const counts = useMemo(() => {
    const c = { all: equipment.length, critical: 0, warning: 0, operational: 0, maintenance: 0 };
    equipment.forEach((eq) => { if (c[eq.status] !== undefined) c[eq.status]++; });
    return c;
  }, [equipment]);

  // Filtered + searched list
  const displayed = useMemo(() => {
    let list = activeFilter === 'all' ? equipment : equipment.filter((eq) => eq.status === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (eq) =>
          eq.name.toLowerCase().includes(q) ||
          eq.category.toLowerCase().includes(q) ||
          eq.location.toLowerCase().includes(q)
      );
    }
    // Sort: critical first, then warning, then others; alphabetical within group
    const order = { critical: 0, warning: 1, maintenance: 2, operational: 3 };
    return [...list].sort((a, b) => {
      const diff = (order[a.status] ?? 4) - (order[b.status] ?? 4);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
  }, [equipment, activeFilter, search]);

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
          <h1 className="text-xl font-bold text-app-text">Equipment</h1>
          <p className="text-sm text-app-muted mt-0.5">
            {equipment.length} machines tracked across all locations
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-brand hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          Add equipment
        </button>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, location…"
            className="w-full bg-app-surface border border-app-border rounded-lg pl-9 pr-3 py-2 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1 bg-app-surface border border-app-border rounded-lg p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-3 py-1.5 rounded-md text-xs font-medium transition-all
                ${activeFilter === f
                  ? 'bg-brand text-white'
                  : 'text-app-muted hover:text-app-text'}
              `}
            >
              {FILTER_LABELS[f]}
              {counts[f] > 0 && (
                <span className={`ml-1.5 ${activeFilter === f ? 'opacity-80' : 'opacity-60'}`}>
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment grid */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-app-text font-medium">No equipment found</p>
          <p className="text-sm text-app-muted mt-1">
            {search ? 'Try a different search term' : 'Add your first machine to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayed.map((eq) => (
            <EquipmentCard
              key={eq.id}
              equipment={eq}
              onClick={setSelected}
            />
          ))}
        </div>
      )}

      {/* Add equipment modal */}
      <AddEquipmentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.div>
  );
}

