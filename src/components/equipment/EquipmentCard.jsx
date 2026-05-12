import { Wrench, AlertTriangle, CheckCircle, Clock, MapPin, Tag } from 'lucide-react';
import { formatDate } from '../../utils/dateHelpers';

const STATUS_CONFIG = {
  operational: {
    label: 'Operational',
    icon: CheckCircle,
    color: 'text-emerald-400',
    ring: 'border-app-border',
    bar: 'bg-emerald-500',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    color: 'text-amber-400',
    ring: 'border-amber-500/40',
    bar: 'bg-amber-500',
  },
  critical: {
    label: 'Critical',
    icon: AlertTriangle,
    color: 'text-red-400',
    ring: 'border-red-500/60',
    bar: 'bg-red-500',
  },
  maintenance: {
    label: 'In Maintenance',
    icon: Wrench,
    color: 'text-blue-400',
    ring: 'border-blue-500/40',
    bar: 'bg-blue-500',
  },
};

function HealthBar({ score }) {
  const config =
    score < 40 ? STATUS_CONFIG.critical
    : score < 70 ? STATUS_CONFIG.warning
    : STATUS_CONFIG.operational;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-app-muted">Health score</span>
        <span className={`text-xs font-bold ${config.color}`}>{score}</span>
      </div>
      <div className="h-1.5 bg-app-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${config.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function EquipmentCard({ equipment, onClick }) {
  const { name, category, location, status, healthScore, nextMaintenanceDue, failureCount } =
    equipment;

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.operational;
  const StatusIcon = config.icon;
  const isCritical = status === 'critical';

  return (
    <button
      onClick={() => onClick?.(equipment)}
      className={`
        w-full text-left bg-app-surface border rounded-xl p-4
        hover:border-brand/40 transition-all duration-200
        focus:outline-none focus:ring-1 focus:ring-brand/40
        ${isCritical ? `${config.ring} status-pulse-critical` : config.ring}
      `}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-app-text truncate">{name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Tag className="w-3 h-3 text-app-muted flex-shrink-0" />
            <span className="text-xs text-app-muted truncate">{category}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 flex-shrink-0 ${config.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{config.label}</span>
        </div>
      </div>

      <HealthBar score={healthScore} />

      {/* Footer metadata */}
      <div className="mt-3 pt-3 border-t border-app-border grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3 h-3 text-app-muted flex-shrink-0" />
          <span className="text-xs text-app-muted truncate">{location}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end min-w-0">
          <Clock className="w-3 h-3 text-app-muted flex-shrink-0" />
          <span className="text-xs text-app-muted truncate">
            {nextMaintenanceDue ? formatDate(nextMaintenanceDue) : 'Not scheduled'}
          </span>
        </div>
      </div>

      {failureCount > 0 && (
        <p className="text-xs text-app-muted mt-2">
          {failureCount} recorded failure{failureCount !== 1 ? 's' : ''}
        </p>
      )}
    </button>
  );
}
