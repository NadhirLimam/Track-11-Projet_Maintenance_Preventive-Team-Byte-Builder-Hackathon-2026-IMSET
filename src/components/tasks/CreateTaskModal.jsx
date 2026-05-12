import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTaskStore } from '../../stores/useTaskStore';
import { useEquipmentStore } from '../../stores/useEquipmentStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { seedUsers } from '../../data/users';
import toast from 'react-hot-toast';
import { format, addDays } from 'date-fns';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const TYPES = ['preventive', 'corrective', 'inspection', 'calibration'];

const EMPTY = {
  title: '',
  description: '',
  priority: 'medium',
  type: 'preventive',
  equipmentId: '',
  assignedToId: '',
  scheduledDate: format(new Date(), 'yyyy-MM-dd'),
  dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
};

const inputClass =
  'w-full bg-app-bg border border-app-border rounded-lg px-3 py-2.5 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors';

export default function CreateTaskModal({ open, onClose }) {
  const addTask = useTaskStore((s) => s.addTask);
  const equipment = useEquipmentStore((s) => s.equipment);
  const { currentUser, registeredUsers = [] } = useAuthStore();

  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) { setForm(EMPTY); setErrors({}); }
  }, [open]);

  if (!open) return null;

  // All users who can be assigned tasks (technicians from seed + registered users)
  const allUsers = [...seedUsers, ...registeredUsers].filter((u) => u.role === 'technician');

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Task title is required.';
    if (!form.equipmentId)        e.equipmentId  = 'Select a machine.';
    if (!form.assignedToId)       e.assignedToId = 'Assign to a technician.';
    if (!form.scheduledDate)      e.scheduledDate = 'Scheduled date is required.';
    if (!form.dueDate)            e.dueDate      = 'Due date is required.';
    if (form.scheduledDate && form.dueDate && form.dueDate < form.scheduledDate) {
      e.dueDate = 'Due date cannot be before the scheduled date.';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e_ = validate();
    if (Object.keys(e_).length) { setErrors(e_); return; }

    addTask({
      title:          form.title.trim(),
      description:    form.description.trim(),
      status:         'scheduled',
      priority:       form.priority,
      type:           form.type,
      equipmentId:    form.equipmentId,
      assignedToId:   form.assignedToId,
      scheduledDate:  form.scheduledDate,
      dueDate:        form.dueDate,
      completedAt:    null,
      actualHours:    null,
      createdAt:      format(new Date(), 'yyyy-MM-dd'),
    });

    toast.success('Task created.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-app-surface border border-app-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border sticky top-0 bg-app-surface z-10">
          <h2 className="text-base font-semibold text-app-text">Create task</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Task title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Replace hydraulic filter"
              className={inputClass}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          {/* Priority + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Priority</label>
              <select value={form.priority} onChange={set('priority')} className={inputClass}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Type</label>
              <select value={form.type} onChange={set('type')} className={inputClass}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Machine <span className="text-red-400">*</span>
            </label>
            <select value={form.equipmentId} onChange={set('equipmentId')} className={inputClass}>
              <option value="">Select a machine…</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.id}>{eq.name}</option>
              ))}
            </select>
            {errors.equipmentId && <p className="text-xs text-red-400 mt-1">{errors.equipmentId}</p>}
          </div>

          {/* Assigned to */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Assigned to <span className="text-red-400">*</span>
            </label>
            <select value={form.assignedToId} onChange={set('assignedToId')} className={inputClass}>
              <option value="">Select a technician…</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
              ))}
            </select>
            {errors.assignedToId && <p className="text-xs text-red-400 mt-1">{errors.assignedToId}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">
                Scheduled date <span className="text-red-400">*</span>
              </label>
              <input type="date" value={form.scheduledDate} onChange={set('scheduledDate')} className={inputClass} />
              {errors.scheduledDate && <p className="text-xs text-red-400 mt-1">{errors.scheduledDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">
                Due date <span className="text-red-400">*</span>
              </label>
              <input type="date" value={form.dueDate} onChange={set('dueDate')} className={inputClass} />
              {errors.dueDate && <p className="text-xs text-red-400 mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Notes <span className="text-app-muted font-normal">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={2}
              placeholder="Any additional context for the technician…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-app-bg border border-app-border text-app-text text-sm font-medium py-2.5 rounded-lg hover:border-app-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150"
            >
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
