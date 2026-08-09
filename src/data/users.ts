import type { AuthUser, Role } from '@/types'

export interface DemoAccount {
  role: Role
  email: string
  password: string
  user: AuthUser
}

export const demoAccounts: DemoAccount[] = [
  {
    role: 'admin',
    email: 'admin@medicare.lk',
    password: 'admin123',
    user: {
      id: 'USR-ADM-01',
      name: 'Kumara Wijesekara',
      email: 'admin@medicare.lk',
      role: 'admin',
      avatar: '',
      phone: '+94 77 100 2001',
      department: 'Administration',
      designation: 'Hospital Administrator',
    },
  },
  {
    role: 'doctor',
    email: 'doctor@medicare.lk',
    password: 'doctor123',
    user: {
      id: 'DOC-001',
      name: 'Dr. Nimal Perera',
      email: 'doctor@medicare.lk',
      role: 'doctor',
      avatar: '',
      phone: '+94 77 234 5671',
      department: 'Cardiology',
      designation: 'Senior Consultant Cardiologist',
    },
  },
  {
    role: 'receptionist',
    email: 'reception@medicare.lk',
    password: 'reception123',
    user: {
      id: 'USR-REC-01',
      name: 'Sachini Perera',
      email: 'reception@medicare.lk',
      role: 'receptionist',
      avatar: '',
      phone: '+94 77 100 2003',
      department: 'Front Desk',
      designation: 'Senior Receptionist',
    },
  },
]

export function findDemoAccount(email: string, role: Role): DemoAccount | undefined {
  return demoAccounts.find(
    (a) => a.email.toLowerCase() === email.toLowerCase().trim() && a.role === role,
  )
}
