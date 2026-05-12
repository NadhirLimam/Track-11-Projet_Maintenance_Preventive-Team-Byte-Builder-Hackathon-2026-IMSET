/**
 * KPICard.jsx
 * Dashboard KPI metric card with an animated count-up number.
 *
 * Props:
 *   title    — label below the number (e.g. "Overdue Tasks")
 *   value    — the target number to count up to
 *   suffix   — optional text after the number (e.g. "%" or "/100")
 *   subtitle — secondary description below the title
 *   icon     — a Lucide React icon component
 *   color    — 'blue' | 'green' | 'red' | 'amber'
 *
 * Features:
 *   - Animated count-up from 0 → value on mount (using useEffect + setInterval)
 *   - Icon rendered in a colored rounded square (bg-color/10 icon-color)
 *   - Framer Motion fade + slide-up entry animation
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// colorMap: maps color names to Tailwind classes for the icon container
const colorMap = {
  blue:  { bg: 'bg-blue-500/10',   text: 'text-blue-400'  },
  green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  red:   { bg: 'bg-red-500/10',    text: 'text-red-400'   },
  amber: { bg: 'bg-amber-500/10',  text: 'text-amber-400' },
};

// COUNT_UP_DURATION: how long the number animation takes (ms)
const COUNT_UP_DURATION = 800;

// COUNT_UP_STEPS: how many incremental updates to make during the animation
const COUNT_UP_STEPS = 40;

export default function KPICard({
  title,
  value,
  suffix = '',
  subtitle,
  icon: Icon,
  color = 'blue',
}) {
  // displayValue: the currently rendered number (animates up to `value`)
  const [displayValue, setDisplayValue] = useState(0);

  const colors = colorMap[color] ?? colorMap.blue;

  // Count-up animation: runs whenever `value` changes.
  // Uses a fixed step interval to smoothly increment from 0 to value.
  // Why setInterval instead of requestAnimationFrame or a library?
  //   Simpler code, good enough for small integers, no extra dependencies.
  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    let current = 0;
    const increment = value / COUNT_UP_STEPS;
    const intervalMs = COUNT_UP_DURATION / COUNT_UP_STEPS;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value); // Snap to exact final value
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, intervalMs);

    // Cleanup: cancel the interval if the component unmounts mid-animation
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-app-surface border border-app-border rounded-xl p-5 hover:-translate-y-0.5 transition-transform duration-150"
    >
      {/* Icon + number row */}
      <div className="flex items-start justify-between mb-3">
        {/* Large animated number */}
        <div>
          <span className="text-4xl font-bold text-app-text tabular-nums">
            {displayValue}
          </span>
          {suffix && (
            <span className="text-lg font-semibold text-app-muted ml-0.5">
              {suffix}
            </span>
          )}
        </div>

        {/* Icon in colored rounded square */}
        <div className={`p-2.5 rounded-xl ${colors.bg}`}>
          {Icon && <Icon className={`w-6 h-6 ${colors.text}`} />}
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-app-text">{title}</p>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="text-xs text-app-muted mt-0.5">{subtitle}</p>
      )}
    </motion.div>
  );
}
