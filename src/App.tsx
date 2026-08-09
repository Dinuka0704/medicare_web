import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { ConfirmProvider } from '@/context/ConfirmContext'
import { DataProvider } from '@/context/DataContext'
import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { RoleProtectedRoute } from '@/routes/RoleProtectedRoute'
import { getDashboardPath } from '@/components/layout/navConfig'

import Login from '@/pages/auth/Login'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import NotFound from '@/pages/errors/NotFound'
import Unauthorized from '@/pages/errors/Unauthorized'
import AdminDashboard from '@/pages/admin/Dashboard'
import PatientList from '@/pages/patients/PatientList'
import PatientNew from '@/pages/patients/PatientNew'
import PatientProfile from '@/pages/patients/PatientProfile'
import PatientEdit from '@/pages/patients/PatientEdit'
import AppointmentList from '@/pages/appointments/AppointmentList'
import AppointmentNew from '@/pages/appointments/AppointmentNew'
import AppointmentDetail from '@/pages/appointments/AppointmentDetail'
import DoctorList from '@/pages/doctors/DoctorList'
import DoctorProfile from '@/pages/doctors/DoctorProfile'
import DoctorDashboard from '@/pages/doctor/Dashboard'
import Consultation from '@/pages/doctor/Consultation'
import MedicalRecords from '@/pages/medical-records/MedicalRecords'
import NewPrescription from '@/pages/prescriptions/NewPrescription'
import BillingList from '@/pages/billing/BillingList'
import NewInvoice from '@/pages/billing/NewInvoice'
import InvoiceDetail from '@/pages/billing/InvoiceDetail'
import ReceptionDashboard from '@/pages/reception/Dashboard'
import Queue from '@/pages/queue/Queue'
import Reports from '@/pages/reports/Reports'
import Notifications from '@/pages/notifications/Notifications'
import Settings from '@/pages/settings/Settings'
import Profile from '@/pages/profile/Profile'

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={getDashboardPath(user.role)} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']} />}>
        <Route element={<MainLayout />}>
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/new" element={<PatientNew />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
          <Route path="/patients/:id/edit" element={<PatientEdit />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/appointments/new" element={<AppointmentNew />} />
          <Route path="/appointments/:id" element={<AppointmentDetail />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={['admin', 'receptionist']} />}>
        <Route element={<MainLayout />}>
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
          <Route path="/billing" element={<BillingList />} />
          <Route path="/billing/new" element={<NewInvoice />} />
          <Route path="/billing/:id" element={<InvoiceDetail />} />
        </Route>
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={['admin', 'doctor']} />}>
        <Route element={<MainLayout />}>
          <Route path="/medical-records" element={<MedicalRecords />} />
        </Route>
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={['doctor']} />}>
        <Route element={<MainLayout />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/consultation/:appointmentId" element={<Consultation />} />
          <Route path="/prescriptions/new" element={<NewPrescription />} />
        </Route>
      </Route>

      <Route element={<RoleProtectedRoute allowedRoles={['receptionist']} />}>
        <Route element={<MainLayout />}>
          <Route path="/reception/dashboard" element={<ReceptionDashboard />} />
          <Route path="/queue" element={<Queue />} />
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <DataProvider>
              <AppRoutes />
            </DataProvider>
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
