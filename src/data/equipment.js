// equipment.js
// 10 industrial machines with realistic data.
// Health scores are intentionally varied — some critical for demo drama:
//   2 critical  (healthScore < 40)  → trigger pulsing red border
//   2 warning   (healthScore 40–69) → amber indicators
//   1 maintenance                   → being serviced
//   5 operational (healthScore ≥ 70)→ green / healthy
// installationDate and lastMaintenanceDate are ISO strings (no date-fns needed here
// since these don't need to stay relative — historical dates are fine as-is).

export const seedEquipment = [
  // --- CRITICAL (2) ---
  {
    id: 'eq-1',
    name: 'Air Compressor AC-01',
    category: 'Mechanical',
    location: 'Production Hall A',
    status: 'critical',
    healthScore: 28,           // Critical — pulsing red border in UI
    riskLevel: 'critical',
    installationDate: '2018-03-15',
    lastMaintenanceDate: '2024-11-10',
    nextMaintenanceDue: '2025-02-10',
    maintenanceFrequencyDays: 90,
    failureCount: 6,
    description: 'Main production air supply compressor. High usage. Urgent inspection required.',
  },
  {
    id: 'eq-2',
    name: 'Industrial Boiler BL-01',
    category: 'Thermal',
    location: 'Boiler Room',
    status: 'critical',
    healthScore: 31,           // Critical — second pulsing card
    riskLevel: 'critical',
    installationDate: '2016-07-20',
    lastMaintenanceDate: '2025-01-05',
    nextMaintenanceDue: '2025-04-05',
    maintenanceFrequencyDays: 90,
    failureCount: 4,
    description: 'Industrial steam boiler. Requires urgent inspection due to pressure anomalies.',
  },

  // --- WARNING (2) ---
  {
    id: 'eq-3',
    name: 'HVAC Unit HV-01',
    category: 'HVAC',
    location: 'Main Assembly Hall',
    status: 'warning',
    healthScore: 61,           // Warning band — amber indicators
    riskLevel: 'high',
    installationDate: '2020-05-12',
    lastMaintenanceDate: '2025-03-01',
    nextMaintenanceDue: '2025-06-01',
    maintenanceFrequencyDays: 90,
    failureCount: 2,
    description: 'Climate control unit for the main assembly hall. Filter replacement overdue.',
  },
  {
    id: 'eq-4',
    name: 'Hydraulic Press HP-01',
    category: 'Hydraulic',
    location: 'Press Shop',
    status: 'warning',
    healthScore: 55,           // Warning — oil seal wear detected
    riskLevel: 'high',
    installationDate: '2019-09-30',
    lastMaintenanceDate: '2025-02-15',
    nextMaintenanceDue: '2025-05-15',
    maintenanceFrequencyDays: 90,
    failureCount: 3,
    description: '200-ton hydraulic press for metal stamping. Oil seal shows wear.',
  },

  // --- MAINTENANCE (1) ---
  {
    id: 'eq-5',
    name: 'Electrical Panel EP-01',
    category: 'Electrical',
    location: 'Electrical Room',
    status: 'maintenance',
    healthScore: 45,           // Under maintenance — temporarily offline
    riskLevel: 'medium',
    installationDate: '2021-01-10',
    lastMaintenanceDate: '2026-05-10',
    nextMaintenanceDue: '2026-08-10',
    maintenanceFrequencyDays: 90,
    failureCount: 1,
    description: 'Main distribution electrical panel 400V. Currently undergoing scheduled overhaul.',
  },

  // --- OPERATIONAL (5) ---
  {
    id: 'eq-6',
    name: 'CNC Machining Center CNC-01',
    category: 'Mechanical',
    location: 'Machining Area',
    status: 'operational',
    healthScore: 88,
    riskLevel: 'low',
    installationDate: '2022-04-18',
    lastMaintenanceDate: '2026-04-01',
    nextMaintenanceDue: '2026-07-01',
    maintenanceFrequencyDays: 90,
    failureCount: 0,
    description: '5-axis CNC machining center. Recently serviced, running at full capacity.',
  },
  {
    id: 'eq-7',
    name: 'Cooling Pump CP-01',
    category: 'Mechanical',
    location: 'Production Floor',
    status: 'operational',
    healthScore: 94,
    riskLevel: 'low',
    installationDate: '2023-02-05',
    lastMaintenanceDate: '2026-03-20',
    nextMaintenanceDue: '2026-06-20',
    maintenanceFrequencyDays: 90,
    failureCount: 0,
    description: 'Cooling water circulation pump for production floor. Excellent condition.',
  },
  {
    id: 'eq-8',
    name: 'Conveyor Belt CB-01',
    category: 'Mechanical',
    location: 'Assembly Line',
    status: 'operational',
    healthScore: 79,
    riskLevel: 'medium',
    installationDate: '2021-08-14',
    lastMaintenanceDate: '2026-02-10',
    nextMaintenanceDue: '2026-05-10',
    maintenanceFrequencyDays: 90,
    failureCount: 1,
    description: 'Main assembly line conveyor, 30m length. Belt tension recently adjusted.',
  },
  {
    id: 'eq-9',
    name: 'Backup Generator BG-01',
    category: 'Electrical',
    location: 'Generator Room',
    status: 'operational',
    healthScore: 72,
    riskLevel: 'medium',
    installationDate: '2020-11-22',
    lastMaintenanceDate: '2026-01-15',
    nextMaintenanceDue: '2026-04-15',
    maintenanceFrequencyDays: 90,
    failureCount: 2,
    description: 'Backup diesel generator 500kVA. Fuel level optimal, awaiting routine check.',
  },
  {
    id: 'eq-10',
    name: 'Electric Forklift EF-01',
    category: 'Mechanical',
    location: 'Warehouse',
    status: 'operational',
    healthScore: 83,
    riskLevel: 'low',
    installationDate: '2023-06-01',
    lastMaintenanceDate: '2026-04-28',
    nextMaintenanceDue: '2026-07-28',
    maintenanceFrequencyDays: 90,
    failureCount: 0,
    description: 'Electric forklift 3-ton capacity. Battery recently replaced.',
  },
];
