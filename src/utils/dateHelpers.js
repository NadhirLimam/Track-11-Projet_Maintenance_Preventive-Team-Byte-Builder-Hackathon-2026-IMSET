// dateHelpers.js
// Reusable date formatting helpers used across all components.
// All functions are pure (no side effects) and use date-fns.
// Every function gracefully handles null/undefined input — returns
// a dash or empty string so components never crash on missing dates.

import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';

/**
 * formatDate(str)
 * Returns a readable date like "May 12, 2026".
 * Used for scheduled dates, due dates, and maintenance dates in tables.
 */
export const formatDate = (str) =>
  str ? format(parseISO(str), 'MMM dd, yyyy') : '—';

/**
 * formatDateTime(str)
 * Returns a full datetime like "May 12, 2026 at 14:30".
 * Used for completedAt timestamps in task history.
 */
export const formatDateTime = (str) =>
  str ? format(parseISO(str), "MMM dd, yyyy 'at' HH:mm") : '—';

/**
 * timeAgo(str)
 * Returns a relative time string like "3 hours ago" or "2 days ago".
 * Used in the activity feed to show how recent a task was created/updated.
 */
export const timeAgo = (str) =>
  str ? formatDistanceToNow(parseISO(str), { addSuffix: true }) : '';

/**
 * isOverdue(str)
 * Returns true if the given ISO date string is in the past.
 * Used to conditionally apply red styles to past-due dates in the UI.
 */
export const isOverdue = (str) => (str ? isPast(parseISO(str)) : false);
