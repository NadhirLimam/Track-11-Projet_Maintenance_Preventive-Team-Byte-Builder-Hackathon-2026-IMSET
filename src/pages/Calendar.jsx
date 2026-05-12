import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, isToday,
  addMonths, subMonths, parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTaskStore } from '../stores/useTaskStore';
import { useEquipmentStore } from '../stores/useEquipmentStore';
import StatusBadge from '../components/ui/StatusBadge';

const pageVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const PRIORITY_DOT = {
  urgent: 'bg-red-500',
  high:   'bg-amber-500',
  medium: 'bg-blue-500',
  low:    'bg-app-muted',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const tasks     = useTaskStore((s) => s.tasks);
  const equipment = useEquipmentStore((s) => s.equipment);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay,  setSelectedDay]  = useState(null);

  const equipmentMap = useMemo(
    () => new Map(equipment.map((e) => [e.id, e.name])),
    [equipment]
  );

  // Build a map: ISO date string → task array
  const tasksByDate = useMemo(() => {
    const map = new Map();
    tasks.forEach((t) => {
      const dateKey = t.dueDate || t.scheduledDate;
      if (!dateKey) return;
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey).push(t);
    });
    return map;
  }, [tasks]);

  // Calendar grid: weeks from start-of-first-week to end-of-last-week
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end   = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const selectedTasks = useMemo(() => {
    if (!selectedDay) return [];
    const key = format(selectedDay, 'yyyy-MM-dd');
    return tasksByDate.get(key) ?? [];
  }, [selectedDay, tasksByDate]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-app-text">Maintenance Calendar</h1>
          <p className="text-sm text-app-muted mt-0.5">
            {tasks.filter((t) => t.status !== 'completed').length} active tasks this period
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-lg border border-app-border text-app-muted hover:text-app-text hover:border-app-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-app-text min-w-[130px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-lg border border-app-border text-app-muted hover:text-app-text hover:border-app-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Calendar grid */}
        <div className="flex-1 bg-app-surface border border-app-border rounded-xl overflow-hidden">
          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 border-b border-app-border">
            {DAYS.map((d) => (
              <div key={d} className="py-2.5 text-center text-xs font-semibold text-app-muted">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const key      = format(day, 'yyyy-MM-dd');
              const dayTasks = tasksByDate.get(key) ?? [];
              const inMonth  = isSameMonth(day, currentMonth);
              const selected = selectedDay && isSameDay(day, selectedDay);
              const today    = isToday(day);

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDay(isSameDay(day, selectedDay) ? null : day)}
                  className={`
                    min-h-[72px] p-1.5 text-left border-b border-r border-app-border
                    transition-colors hover:bg-app-bg/50
                    ${selected ? 'bg-brand/10 border-brand/30' : ''}
                    ${!inMonth ? 'opacity-30' : ''}
                  `}
                >
                  <span className={`
                    text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full
                    ${today ? 'bg-brand text-white' : 'text-app-muted'}
                    ${selected && !today ? 'text-brand' : ''}
                  `}>
                    {format(day, 'd')}
                  </span>

                  {/* Task dots — max 3 shown */}
                  <div className="mt-1 space-y-0.5">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div key={t.id} className="flex items-center gap-1 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[t.priority] ?? 'bg-app-muted'}`} />
                        <span className="text-[10px] text-app-muted truncate leading-tight">{t.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[10px] text-app-muted">+{dayTasks.length - 3} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail panel */}
        {selectedDay && (
          <div className="w-72 bg-app-surface border border-app-border rounded-xl flex-shrink-0 flex flex-col max-h-[600px]">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-app-border">
              <div>
                <p className="text-sm font-semibold text-app-text">{format(selectedDay, 'EEEE')}</p>
                <p className="text-xs text-app-muted">{format(selectedDay, 'MMMM d, yyyy')}</p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-bg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Task list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {selectedTasks.length === 0 ? (
                <p className="text-sm text-app-muted text-center py-8">No tasks on this day</p>
              ) : (
                selectedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="bg-app-bg border border-app-border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-app-text leading-snug">{t.title}</p>
                      <StatusBadge status={t.status} size="sm" />
                    </div>
                    <p className="text-xs text-app-muted">
                      {equipmentMap.get(t.equipmentId) ?? 'Unknown machine'}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[t.priority] ?? 'bg-app-muted'}`} />
                      <span className="text-xs text-app-muted capitalize">{t.priority} priority</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-xs text-app-muted">Priority:</span>
        {Object.entries(PRIORITY_DOT).map(([p, cls]) => (
          <div key={p} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${cls}`} />
            <span className="text-xs text-app-muted capitalize">{p}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

