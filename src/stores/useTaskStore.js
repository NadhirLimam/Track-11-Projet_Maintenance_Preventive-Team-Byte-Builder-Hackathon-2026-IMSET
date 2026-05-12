// useTaskStore.js
// Manages the maintenance task list. Persisted to localStorage.
//
// On every init: syncOverdue() runs automatically — any task whose dueDate
// has passed and whose status is still 'scheduled' or 'in_progress' gets
// marked 'overdue'. This makes the dashboard feel live: open the app on
// any day and the overdue count is always accurate.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seedTasks } from '../data/tasks';
import { isPast, parseISO } from 'date-fns';

// syncOverdue(tasks)
// Pure function: scans the task array and flips any past-due non-completed
// task to 'overdue'. Returns a new array — does not mutate the input.
const syncOverdue = (tasks) =>
  tasks.map((t) => {
    const shouldBeOverdue =
      (t.status === 'scheduled' || t.status === 'in_progress') &&
      t.dueDate &&
      isPast(parseISO(t.dueDate));
    return shouldBeOverdue ? { ...t, status: 'overdue' } : t;
  });

export const useTaskStore = create(
  persist(
    (set, get) => ({
      // tasks: array of all maintenance tasks, with overdue status applied on init
      tasks: syncOverdue(seedTasks),

      // addTask(data)
      // Creates a new task with a unique ID and defaults status to 'scheduled'.
      // After adding, re-runs syncOverdue so the new task is immediately flagged
      // if its dueDate is already in the past (edge case but important for demo).
      addTask: (data) => {
        const newTask = {
          ...data,
          id: `task-${Date.now()}`,
          status: 'scheduled',
          completedAt: null,
          actualHours: null,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          tasks: syncOverdue([...state.tasks, newTask]),
        }));
      },

      // updateTaskStatus(id, status)
      // Changes a task's status. Special logic:
      //   - 'completed' → sets completedAt to today
      //   - Any other status → clears completedAt
      // After the update, syncOverdue runs again to catch any newly overdue tasks.
      updateTaskStatus: (id, status) => {
        set((state) => {
          const updated = state.tasks.map((t) => {
            if (t.id !== id) return t;
            return {
              ...t,
              status,
              completedAt:
                status === 'completed'
                  ? new Date().toISOString().split('T')[0]
                  : null,
            };
          });
          return { tasks: syncOverdue(updated) };
        });
      },

      // deleteTask(id)
      // Removes a task by ID. Used when an admin deletes a task.
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      // getByEquipment(equipmentId)
      // Returns all tasks linked to a specific machine.
      // Used on the Equipment detail view to show the task history.
      getByEquipment: (equipmentId) => {
        return get().tasks.filter((t) => t.equipmentId === equipmentId);
      },

      // getByTechnician(userId)
      // Returns all tasks assigned to a specific technician.
      // Used to populate the MyTasks page.
      getByTechnician: (userId) => {
        return get().tasks.filter((t) => t.assignedToId === userId);
      },

      // resetToSeed()
      // Restores the task list to the original seed data with a fresh overdue sync.
      // Called by the "Reset Data" button on the Dashboard.
      resetToSeed: () => set({ tasks: syncOverdue(seedTasks) }),
    }),
    {
      name: 'maintixpro-tasks', // localStorage key
    }
  )
);
