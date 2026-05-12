/**
 * StatusBadge.jsx
 * Colored pill badge that shows equipment or task status.
 *
 * Props:
 *   status  — any key from STATUS_STYLES (e.g. 'operational', 'overdue')
 *   size    — 'sm' | 'default' (controls text and padding size)
 *
 * Design rules:
 *   - Always uses the STATUS_STYLES color map — never defines colors locally
 *   - Shows a colored dot before the label text
 *   - Critical and overdue dots use animate-pulse for extra attention
 *   - Underscores in status keys are replaced with spaces for display
 */

// STATUS_STYLES is exported so other components can reuse the same color map
// without importing from a separate design system file.
export const STATUS_STYLES = {
  operational: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning:     'bg-amber-500/10   text-amber-400   border border-amber-500/20',
  critical:    'bg-red-500/10     text-red-400     border border-red-500/20',
  maintenance: 'bg-blue-500/10    text-blue-400    border border-blue-500/20',
  inactive:    'bg-gray-500/10    text-gray-400    border border-gray-500/20',
  scheduled:   'bg-blue-500/10    text-blue-400    border border-blue-500/20',
  in_progress: 'bg-purple-500/10  text-purple-400  border border-purple-500/20',
  completed:   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  overdue:     'bg-red-500/10     text-red-400     border border-red-500/20',
};

// DOT_PULSE: status values whose dot should pulse for visual urgency
const DOT_PULSE = new Set(['critical', 'overdue']);

export default function StatusBadge({ status, size = 'default' }) {
  // Look up the Tailwind classes for this status; fall back to inactive style
  const colorClasses = STATUS_STYLES[status] ?? STATUS_STYLES.inactive;

  // Size variants: 'sm' is used inside table rows, 'default' on cards
  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-xs px-2.5 py-1';

  // Convert underscore status keys to readable labels (in_progress → In Progress)
  const label = status
    ? status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Unknown';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${colorClasses} ${sizeClasses}
      `}
    >
      {/* Status dot — pulses for critical / overdue states */}
      <span
        className={`
          w-1.5 h-1.5 rounded-full bg-current
          ${DOT_PULSE.has(status) ? 'animate-pulse' : ''}
        `}
      />
      {label}
    </span>
  );
}
