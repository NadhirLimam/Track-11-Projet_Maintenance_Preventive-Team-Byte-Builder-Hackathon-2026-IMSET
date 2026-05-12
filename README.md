# MaintixPro — Preventive Maintenance Management Platform

> **Predict. Prevent. Perform.**

A smart, frontend-only web application for industrial preventive maintenance management.
Built in 24 hours for **BTS Hackathon 2026 — Track 11** at IMSET.

🔗 **Live Demo:** _[coming soon — deployed on Vercel]_

---

## 👥 Team — Byte Builders

| Name | Role |
|------|------|
| Beher Hawech | — |
| Adam Zmerli | — |
| Nedhir Limam | Lead Developer / Data & State |
| Ranim Selmi | — |
| Mohamed Amine Bin Hasan | — |

---

## 🚀 What It Does

MaintixPro helps industrial maintenance managers and field technicians:

- **Track equipment health** with AI-style health scoring (0–100)
- **Manage maintenance tasks** with priority levels and overdue detection
- **Visualize KPIs** on a live dashboard (completion rate, overdue count, avg health)
- **Switch roles** between Admin (full access) and Technician (own tasks only)
- **Demo mode** — one-click data degradation simulation for live presentations

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@maintixpro.com | Admin@2026 |
| Technician | sara@maintixpro.com | Tech@2026 |
| Technician | karim@maintixpro.com | Tech@2026 |

> Or use the **Quick Demo** buttons on the login page — no typing needed.

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| UI Framework | **React** | 19.x |
| Build Tool | **Vite** | 8.x |
| Styling | **Tailwind CSS** | 4.x |
| Routing | **React Router DOM** | 7.x |
| State Management | **Zustand** (with `persist` middleware) | 5.x |
| Animations | **Framer Motion** | 12.x |
| Charts | **Recharts** | 3.x |
| Icons | **Lucide React** | 1.x |
| Date Handling | **date-fns** | 4.x |
| Notifications | **react-hot-toast** | 2.x |
| Utilities | **clsx** + **tailwind-merge** | — |

> **No backend. No database. No API calls.**
> All data lives in hardcoded seed files (`src/data/`) and persists via Zustand + `localStorage`.

---

## 🏗️ Architecture

```
src/
├── data/           ← Seed data (the "database") — users, equipment, tasks
├── stores/         ← Zustand global state — auth, equipment, tasks, UI
├── utils/          ← Pure helpers — health score formula, date formatting
├── components/
│   ├── layout/     ← Sidebar, TopBar, Layout shell
│   ├── ui/         ← Reusable: KPICard, StatusBadge, HealthRing, Modal
│   ├── dashboard/  ← Charts, ActivityFeed
│   ├── equipment/  ← EquipmentCard, EquipmentForm, EquipmentTable
│   ├── tasks/      ← TaskCard, TaskForm, StatusButton
│   └── calendar/   ← CalendarGrid, DayCell, EventDot
└── pages/          ← Login, Dashboard, Equipment, Tasks, Calendar, MyTasks
```

### Data Flow

```
Seed files → Zustand stores → Components → User interactions → Store actions → localStorage
```

---

## 📱 Pages & Access

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/dashboard` | KPIs + Charts + Activity Feed | Admin only |
| `/equipment` | Equipment grid + health scores | Admin only |
| `/tasks` | Maintenance task list + create | Admin only |
| `/calendar` | Monthly maintenance calendar | Admin only |
| `/my-tasks` | Technician's own tasks | Technician only |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/NadhirLimam/Track-11-Projet_Maintenance_Preventive-Team-Byte-Builder-Hackathon-2026-IMSET.git
cd Track-11-Projet_Maintenance_Preventive-Team-Byte-Builder-Hackathon-2026-IMSET

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🗂️ Key Features

### Health Score Formula
Each machine gets a score from 0–100 calculated from:
- Days overdue for maintenance (penalty up to −35 pts)
- Equipment age in years (penalty up to −15 pts)
- Historical failure count (penalty up to −25 pts)
- Risk level classification (penalty 0 to −12 pts)

### Role-Based Access
- **Admin** — full access to all pages, can create/manage equipment and tasks
- **Technician** — restricted to their own assigned tasks via `/my-tasks`

### Live Demo Features
- **Simulate Degradation** button — drops 2 random equipment health scores by 15–25 points
- **Reset Data** button — restores all seed data instantly
- **syncOverdue()** — automatically marks past-due tasks as overdue on every app load

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for full details.

© 2026 Team Byte Builders — BTS Hackathon 2026, IMSET

---

## 🏆 Hackathon Info

- **Event:** BTS Hackathon 2026
- **Track:** Track 11 — Preventive Maintenance
- **Institution:** IMSET
- **Duration:** 24 hours
- **Category:** Frontend Web Application
