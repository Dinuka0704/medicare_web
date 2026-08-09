import type { ActivityLogEntry } from '@/types'

export const activityLog: ActivityLogEntry[] = [
  { id: 'ACT-1', actor: 'Sachini Perera', action: 'checked in patient Kasun Perera for a 09:00 AM appointment', time: '2026-08-09T08:46:00' },
  { id: 'ACT-2', actor: 'Dr. Nimal Perera', action: 'completed consultation for Sahan Fernando', time: '2026-08-09T08:20:00' },
  { id: 'ACT-3', actor: 'Kumara Wijesekara', action: 'added a new doctor profile for Dr. Chathura Gunasekara', time: '2026-08-09T07:50:00' },
  { id: 'ACT-4', actor: 'Sachini Perera', action: 'registered new patient Hansini Weerasinghe', time: '2026-08-08T14:05:00' },
  { id: 'ACT-5', actor: 'Dr. Amaya Silva', action: 'issued a prescription for Chamodi Jayasinghe', time: '2026-08-08T11:30:00' },
  { id: 'ACT-6', actor: 'System', action: 'generated monthly revenue report for July 2026', time: '2026-08-08T00:05:00' },
  { id: 'ACT-7', actor: 'Sachini Perera', action: 'created invoice INV-3006 for Anjali Ranasinghe', time: '2026-07-30T16:10:00' },
  { id: 'ACT-8', actor: 'Dr. Kavindu Fernando', action: 'updated medical record for Yasodha Ekanayake', time: '2026-07-30T10:15:00' },
]
