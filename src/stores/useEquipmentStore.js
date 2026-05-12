// useEquipmentStore.js
// Manages the full equipment list. All changes persist to localStorage.
//
// Key demo feature: simulateDegradation() drops random equipment health scores
// to make the dashboard dramatically update during a live presentation.
// resetToSeed() restores everything to the original state instantly.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seedEquipment } from '../data/equipment';

// deriveStatus(score)
// Maps a numeric health score to the correct equipment status string.
// Keeps status visually consistent with the health ring colors in the UI.
const deriveStatus = (score) => {
  if (score < 40) return 'critical';
  if (score < 70) return 'warning';
  return 'operational';
};

export const useEquipmentStore = create(
  persist(
    (set, get) => ({
      // equipment: array of all machines, initialized from seed data
      equipment: seedEquipment,

      // addEquipment(data)
      // Creates a new equipment entry with a unique ID and default health of 100.
      // The new item is appended to the existing list.
      addEquipment: (data) => {
        const newItem = {
          ...data,
          id: `eq-${Date.now()}`,  // Timestamp-based ID — unique for demo
          healthScore: 100,
          status: 'operational',
          failureCount: 0,
        };
        set((state) => ({ equipment: [...state.equipment, newItem] }));
      },

      // updateEquipmentStatus(id, status)
      // Directly sets a machine's status string (e.g. 'maintenance').
      // Used when a technician starts a maintenance task on a machine.
      updateEquipmentStatus: (id, status) => {
        set((state) => ({
          equipment: state.equipment.map((eq) =>
            eq.id === id ? { ...eq, status } : eq
          ),
        }));
      },

      // updateHealthScore(id, score)
      // Updates the health score and auto-derives the new status from the score.
      // Called after calculateHealthScore() re-evaluates a machine.
      updateHealthScore: (id, score) => {
        set((state) => ({
          equipment: state.equipment.map((eq) =>
            eq.id === id
              ? { ...eq, healthScore: score, status: deriveStatus(score) }
              : eq
          ),
        }));
      },

      // simulateDegradation()
      // Demo feature: picks 2 random operational machines and drops their
      // healthScore by a random 15–25 points, then updates their status.
      // Returns an array of the affected machine names so the caller can
      // show a descriptive toast notification.
      simulateDegradation: () => {
        const { equipment } = get();

        // Only degrade machines that are currently operational
        const operational = equipment.filter((eq) => eq.status === 'operational');
        if (operational.length < 2) return [];

        // Shuffle and pick the first 2
        const shuffled = [...operational].sort(() => Math.random() - 0.5);
        const targets = shuffled.slice(0, 2);
        const targetIds = new Set(targets.map((eq) => eq.id));
        const degradedNames = [];

        set((state) => ({
          equipment: state.equipment.map((eq) => {
            if (!targetIds.has(eq.id)) return eq;

            // Random drop between 15 and 25 points
            const drop = Math.floor(Math.random() * 11) + 15;
            const newScore = Math.max(0, eq.healthScore - drop);
            degradedNames.push(eq.name);

            return {
              ...eq,
              healthScore: newScore,
              status: deriveStatus(newScore),
              failureCount: eq.failureCount + 1,
            };
          }),
        }));

        return degradedNames; // Used by Dashboard to build the toast message
      },

      // resetToSeed()
      // Restores the entire equipment array to the original seed data.
      // Called by the "Reset Data" button on the Dashboard.
      resetToSeed: () => set({ equipment: seedEquipment }),
    }),
    {
      name: 'maintixpro-equipment', // localStorage key
    }
  )
);
