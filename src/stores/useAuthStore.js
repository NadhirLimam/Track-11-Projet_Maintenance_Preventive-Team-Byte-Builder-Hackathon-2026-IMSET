// useAuthStore.js
// Handles authentication: login, register, logout.
// Persisted to localStorage (key: 'maintixpro-auth') so the session
// survives page refresh without a real backend.
// No real JWT — matches email+password against seed data + registered users client-side.
// Passwords are NEVER stored in state — only the sanitized user object.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seedUsers } from '../data/users';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,

      // registeredUsers: users created via the sign-up form.
      // Persisted alongside currentUser so they survive page refresh.
      // Passwords ARE stored here (hashed in a real app; plain strings for demo only).
      registeredUsers: [],

      // login(email, password)
      // Checks both seedUsers and registeredUsers.
      // Returns 'ok' on success, 'invalid' if credentials don't match.
      login: (email, password) => {
        const allUsers = [...seedUsers, ...get().registeredUsers];
        const match = allUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!match) return 'invalid';

        const { password: _pwd, ...safeUser } = match;
        set({ currentUser: safeUser });
        return 'ok';
      },

      // register({ firstName, lastName, email, password })
      // Returns 'ok' on success, 'exists' if the email is already taken.

      register: ({ firstName, lastName, email, password }) => {
        const allUsers = [...seedUsers, ...get().registeredUsers];
        const exists = allUsers.some(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) return 'exists';

        const newUser = {
          id: `user-${Date.now()}`,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password, // stored only in registeredUsers (not in state as currentUser)
          role: 'admin',
          isActive: true,
        };

        set((state) => ({ registeredUsers: [...state.registeredUsers, newUser] }));

        // Auto-login after registration
        const { password: _pwd, ...safeUser } = newUser;
        set({ currentUser: safeUser });
        return 'ok';
      },

      // logout()
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'maintixpro-auth',
    }
  )
);
