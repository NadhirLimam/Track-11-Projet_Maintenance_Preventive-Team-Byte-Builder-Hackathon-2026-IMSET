// healthScore.js
// Calculates equipment health score (0–100) from machine data.
// Presented as "AI-based health scoring" during the demo.
//
// Formula: start at 100, subtract penalties for 4 risk factors:
//   1. Days overdue for maintenance     → up to -35 points
//   2. Equipment age in years           → up to -15 points
//   3. Historical failure count         → up to -25 points
//   4. Risk level classification        → 0 to -12 points
//
// The result is clamped between 0 and 100 and rounded to an integer.

import { differenceInDays, differenceInYears, parseISO } from 'date-fns';

// HEALTH_THRESHOLDS — shared constant used by both this file and the design system.
// Below CRITICAL → red. Between CRITICAL and WARNING → amber. Above WARNING → green.
export const HEALTH_THRESHOLDS = {
  CRITICAL: 40, // score < 40  → Critical status
  WARNING: 70,  // score < 70  → Warning status (score >= 70 → Good)
};

// riskPenaltyMap
// Static lookup for riskLevel → penalty points.
// Higher risk classifications carry a baseline score penalty.
const riskPenaltyMap = {
  low: 0,
  medium: 3,
  high: 7,
  critical: 12,
};

/**
 * calculateHealthScore(equipment)
 *
 * Pure function — no side effects, no store access.
 * Accepts one equipment object and returns a health score from 0 to 100.
 *
 * Why use this instead of the stored healthScore?
 * The stored value is set at seed time for demo purposes.
 * This function can recalculate a live score after any data change.
 */
export const calculateHealthScore = (equipment) => {
  let score = 100;

  // ── Penalty 1: Maintenance overdue days (capped at 35 points) ──────────────
  // The further past the nextMaintenanceDue date, the heavier the penalty.
  // Normalized against maintenanceFrequencyDays so that short-cycle machines
  // are penalized proportionally (a 7-day cycle overdue by 7 days is as bad
  // as a 90-day cycle overdue by 90 days).
  if (equipment.nextMaintenanceDue) {
    const overdueDays = differenceInDays(
      new Date(),
      parseISO(equipment.nextMaintenanceDue)
    );
    if (overdueDays > 0) {
      const frequency = equipment.maintenanceFrequencyDays || 90;
      const overduePenalty = Math.min(
        35,
        Math.round((overdueDays / frequency) * 25)
      );
      score -= overduePenalty;
    }
  }

  // ── Penalty 2: Equipment age in years (capped at 15 points) ────────────────
  // Older machines are statistically more prone to failure.
  // 2 points per year of age keeps the penalty moderate.
  if (equipment.installationDate) {
    const ageYears = differenceInYears(
      new Date(),
      parseISO(equipment.installationDate)
    );
    const agePenalty = Math.min(15, ageYears * 2);
    score -= agePenalty;
  }

  // ── Penalty 3: Historical failure count (capped at 25 points) ──────────────
  // Each recorded failure signals reliability issues.
  // 5 points per failure; more than 5 failures maxes out this penalty.
  const failurePenalty = Math.min(25, (equipment.failureCount || 0) * 5);
  score -= failurePenalty;

  // ── Penalty 4: Risk level classification (0–12 points) ─────────────────────
  // Some machines are intrinsically higher risk (boilers, electrical panels).
  // This baseline penalty ensures critical machines never show 100% health.
  const riskPenalty = riskPenaltyMap[equipment.riskLevel] ?? 0;
  score -= riskPenalty;

  // Clamp to [0, 100] and round to integer for clean display
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * getHealthLabel(score)
 * Returns a human-readable label for display in tooltips and table cells.
 */
export const getHealthLabel = (score) => {
  if (score >= HEALTH_THRESHOLDS.WARNING) return 'Good';
  if (score >= HEALTH_THRESHOLDS.CRITICAL) return 'Warning';
  return 'Critical';
};

/**
 * getHealthColor(score)
 * Returns Tailwind color utility classes for the score value.
 * Used by HealthRing and table cells to color the score consistently.
 */
export const getHealthColor = (score) => {
  if (score >= HEALTH_THRESHOLDS.WARNING) return 'text-emerald-400 stroke-emerald-400';
  if (score >= HEALTH_THRESHOLDS.CRITICAL) return 'text-amber-400 stroke-amber-400';
  return 'text-red-400 stroke-red-400';
};
