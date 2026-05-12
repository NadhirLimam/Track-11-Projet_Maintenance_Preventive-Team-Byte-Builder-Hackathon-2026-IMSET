// useAuthStore.js
// Handles authentication: login, logout, and quick demo login.
// Persisted to localStorage (key: 'maintixpro-auth') so the session
// survives page refresh without a real backend.
// No real JWT — matches email+password against seed data client-side.
// The password is STRIPPED from the stored user object for safety.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seedUsers } from '../data/users';

export const useAuthStore = create(
  persist(
    (set) => ({
      // currentUser: the logged-in user (without password), or null if logged out
      currentUser: null,

      // login(email, password)
      // Finds a matching user in seedUsers, strips the password,
      // then stores the sanitized user object in state.
      // Returns true on success, false if credentials are wrong.
      login: (email, password) => {
        const match = seedUsers.find(
          (u) => u.email === email && u.password === password
        );
        if (!match) return false;

        // Strip password before storing — never keep credentials in state
        const { password: _pwd, ...safeUser } = match;
        set({ currentUser: safeUser });
        return true;
      },

      // loginAs(role)
      // Bypasses the form — finds the first user with the matching role
      // and logs them in instantly. Used by Quick Demo buttons on the login page.
      loginAs: (role) => {
        const match = seedUsers.find((u) => u.role === role);
        if (!match) return;

        const { password: _pwd, ...safeUser } = match;
        set({ currentUser: safeUser });
      },

      // logout()
      // Clears the currentUser from state. The persist middleware will also
      // clear it from localStorage so the session is fully destroyed.
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'maintixpro-auth', // localStorage key
    }
  )
);
