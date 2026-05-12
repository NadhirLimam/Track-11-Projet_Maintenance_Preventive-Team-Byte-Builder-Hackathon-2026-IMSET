// users.js
// Hardcoded user accounts for demo purposes.
// No real auth — passwords matched as plain strings client-side.
// In production these would be hashed server-side with bcrypt or argon2.
// Three users: 1 admin (full access) + 2 technicians (limited access).

export const seedUsers = [
  {
    id: 'user-1',
    firstName: 'Nedhir',
    lastName: 'Limam',
    email: 'nedhir@maintixpro.com',
    password: 'Admin@2026',
    role: 'admin',      // Admin sees all pages and can manage everything
    isActive: true,
  },
  {
    id: 'user-2',
    firstName: 'Beher',
    lastName: 'Hewech',
    email: 'beher@maintixpro.com',
    password: 'Tech@2026',
    role: 'technician', // Technicians only see their own assigned tasks
    isActive: true,
  },
  {
    id: 'user-3',
    firstName: 'Ranim',
    lastName: 'Selmi',
    email: 'ranim@maintixpro.com',
    password: 'Tech@2026',
    role: 'technician',
    isActive: true,
  },
];
