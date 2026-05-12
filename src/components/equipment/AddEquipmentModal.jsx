import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useEquipmentStore } from '../../stores/useEquipmentStore';
import toast from 'react-hot-toast';

const CATEGORIES = ['Mechanical', 'HVAC', 'Hydraulic', 'Electrical', 'Thermal', 'Other'];
const RISK_LEVELS = ['low', 'medium', 'high', 'critical'];
const CURRENT_YEAR = new Date().getFullYear();

const EMPTY = {
  name: '',
  category: 'Mechanical',
  location: '',
  riskLevel: 'low',
  installationYear: '',
  description: '',
};

const inputClass =
  'w-full bg-app-bg border border-app-border rounded-lg px-3 py-2.5 text-sm text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand transition-colors';

export default function AddEquipmentModal({ open, onClose }) {
  const addEquipment = useEquipmentStore((s) => s.addEquipment);
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Reset form whenever modal opens
  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())      e.name = 'Equipment name is required.';
    if (!form.location.trim())  e.location = 'Location is required.';
    if (form.installationYear) {
      const y = Number(form.installationYear);
      if (isNaN(y) || y < 1950 || y > CURRENT_YEAR) {
        e.installationYear = `Enter a year between 1950 and ${CURRENT_YEAR}.`;
      }
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e_ = validate();
    if (Object.keys(e_).length) { setErrors(e_); return; }

    addEquipment({
      name:                  form.name.trim(),
      category:              form.category,
      location:              form.location.trim(),
      riskLevel:             form.riskLevel,
      installationDate:      form.installationYear ? `${form.installationYear}-01-01` : null,
      lastMaintenanceDate:   null,
      nextMaintenanceDue:    null,
      maintenanceFrequencyDays: 90,
      description:           form.description.trim(),
    });

    toast.success(`${form.name.trim()} added to equipment list.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-app-surface border border-app-border rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border">
          <h2 className="text-base font-semibold text-app-text">Add equipment</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Equipment name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Air Compressor AC-02"
              className={inputClass}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Category + Risk level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Category</label>
              <select value={form.category} onChange={set('category')} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-1.5">Risk level</label>
              <select value={form.riskLevel} onChange={set('riskLevel')} className={inputClass}>
                {RISK_LEVELS.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={set('location')}
              placeholder="e.g. Production Hall B"
              className={inputClass}
            />
            {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
          </div>

          {/* Installation year */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Installation year <span className="text-app-muted font-normal">(optional)</span>
            </label>
            <input
              type="number"
              value={form.installationYear}
              onChange={set('installationYear')}
              placeholder={String(CURRENT_YEAR)}
              min="1950"
              max={CURRENT_YEAR}
              className={inputClass}
            />
            {errors.installationYear && (
              <p className="text-xs text-red-400 mt-1">{errors.installationYear}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-app-text mb-1.5">
              Description <span className="text-app-muted font-normal">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={2}
              placeholder="Brief notes about this machine…"
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
              Add equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
