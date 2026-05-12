// useUIStore.js
// UI-only state: sidebar collapse, modals, and dark mode.
// NOT persisted — resets to defaults on every page load by design.
// This avoids stale modal state across sessions.

import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // sidebarOpen: controls whether sidebar shows full labels or icon-only collapsed mode
  sidebarOpen: true,

  // activeModal: string name of the currently open modal (null = no modal open)
  activeModal: null,

  // modalData: any extra data to pass to the active modal (e.g. equipment object to edit)
  modalData: null,

  // darkMode: persisted so the user's preference survives page reload
  darkMode: localStorage.getItem('maintixpro-darkmode') !== 'false',

  // toggleSidebar()
  // Flips the sidebar between expanded (w-60) and collapsed (w-16) modes.
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // openModal(name, data)
  // Sets the active modal by name. Pass optional data for context
  // (e.g. the equipment object when opening the "Edit Equipment" modal).
  openModal: (name, data = null) => set({ activeModal: name, modalData: data }),

  // closeModal()
  // Clears the active modal and its associated data.
  closeModal: () => set({ activeModal: null, modalData: null }),

  // toggleDarkMode()
  // Flips the dark/light mode preference. Persisting dark mode is intentionally
  // skipped — the app always starts in dark mode as per the design system.
  toggleDarkMode: () => set((s) => {
    const next = !s.darkMode;
    localStorage.setItem('maintixpro-darkmode', String(next));
    return { darkMode: next };
  }),
}));
