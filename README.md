# MaintixPro

**Predict. Prevent. Perform.**

Frontend web application for industrial preventive maintenance management, built in 24 hours for BTS Hackathon 2026 — Track 11 at IMSET.

---

## Team — Byte Builders

| Name |
|------|
| Beher Hewech |
| Adam Zmerli |
| Nedhir Limam |
| Ranim Selmi |
| Mohamed Amine Bin Hasan |

---

## What It Does

MaintixPro gives maintenance managers and field technicians a single place to:

- Monitor equipment health through a scoring system (0–100) based on age, failure history, and overdue maintenance
- Manage tasks with priority levels, status tracking, and automatic overdue detection
- View live KPIs — completion rate, overdue count, average equipment health
- Work in two roles: Admin (full access) and Technician (own tasks only)

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | nedhir@maintixpro.com | Admin@2026 |
| Technician | beher@maintixpro.com | Tech@2026 |
| Technician | ranim@maintixpro.com | Tech@2026 |

The login page also has Quick Demo buttons if you don't want to type credentials.

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| UI Framework | React | 19.x |
| Build Tool | Vite | 8.x |
| Styling | Tailwind CSS | 4.x |
| Routing | React Router DOM | 7.x |
| State Management | Zustand (with `persist`) | 5.x |
| Animations | Framer Motion | 12.x |
| Charts | Recharts | 3.x |
| Icons | Lucide React | 1.x |
| Date Handling | date-fns | 4.x |
| Notifications | react-hot-toast | 2.x |

There is no backend, database, or API. All data lives in seed files under `src/data/` and is persisted via Zustand + `localStorage`.

---

## Project Structure

```
src/
├── data/           seed data — users, equipment, tasks
├── stores/         Zustand stores — auth, equipment, tasks, UI
├── utils/          helpers — health score formula, date formatting
├── components/
│   ├── layout/     Sidebar, TopBar, Layout shell
│   ├── ui/         KPICard, StatusBadge, HealthRing, Modal
│   ├── dashboard/  Charts, ActivityFeed
│   ├── equipment/  EquipmentCard, EquipmentForm, EquipmentTable
│   ├── tasks/      TaskCard, TaskForm, StatusButton
│   └── calendar/   CalendarGrid, DayCell, EventDot
└── pages/          Login, Dashboard, Equipment, Tasks, Calendar, MyTasks
```

---

## Pages

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/dashboard` | KPIs, charts, activity feed | Admin |
| `/equipment` | Equipment grid with health scores | Admin |
| `/tasks` | Task list and creation | Admin |
| `/calendar` | Monthly maintenance calendar | Admin |
| `/my-tasks` | Technician's assigned tasks | Technician |

---

## Getting Started

Requirements: Node.js 18+, npm 9+

```bash
git clone https://github.com/NadhirLimam/Track-11-Projet_Maintenance_Preventive-Team-Byte-Builder-Hackathon-2026-IMSET.git
cd Track-11-Projet_Maintenance_Preventive-Team-Byte-Builder-Hackathon-2026-IMSET
npm install
npm run dev
```

App runs at http://localhost:5173

```bash
# Production build
npm run build
npm run preview
```

---

## Health Score

Each machine gets a score from 0 to 100 based on four factors:

- Days overdue for maintenance — up to −35 points
- Equipment age in years — up to −15 points
- Historical failure count — up to −25 points
- Risk level classification — up to −12 points

Scores below 40 are critical, below 70 are warnings.

---

## Demo Controls

The dashboard has two buttons for live presentations:

- **Simulate Degradation** — randomly drops two equipment health scores by 15–25 points
- **Reset Data** — restores everything to the original seed state

---

## License

MIT — see [LICENSE](./LICENSE)

© 2026 Team Byte Builders — BTS Hackathon 2026, IMSET
- **Category:** Frontend Web Application
