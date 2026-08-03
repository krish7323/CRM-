import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthGuard } from './components/layout/AuthGuard';
import { RoleGuard } from './components/layout/RoleGuard';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { AdmissionApplicationPage } from './pages/AdmissionApplicationPage';
import { DashboardPage } from './pages/DashboardPage';
import { CRMPage } from './pages/CRMPage';
import { FollowupsPage } from './pages/FollowupsPage';
import { StudentsPage } from './pages/StudentsPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { CoursesPage } from './pages/CoursesPage';
import { BatchesPage } from './pages/BatchesPage';
import { AttendancePage } from './pages/AttendancePage';
import { FeesPage } from './pages/FeesPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { WhatsAppPage } from './pages/WhatsAppPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { StaffPage } from './pages/StaffPage';
import { SettingsPage } from './pages/SettingsPage';
import { ReportsPage } from './pages/ReportsPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public Parent Admission Application Route */}
        <Route path="/apply" element={<AdmissionApplicationPage />} />

        {/* Public Certificate Verification Route */}
        <Route path="/verify/:certNumber" element={<VerifyCertificatePage />} />

        {/* Protected Dashboard & CRM Layout Routes */}
        <Route
          path="/*"
          element={
            <AuthGuard>
              <MainLayout>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <RoleGuard allowedRoles={['Admin', 'Counsellor', 'Teacher']}>
                        <DashboardPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/crm"
                    element={
                      <RoleGuard allowedRoles={['Admin', 'Counsellor']}>
                        <CRMPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/followups"
                    element={
                      <RoleGuard allowedRoles={['Admin', 'Counsellor']}>
                        <FollowupsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/students"
                    element={
                      <RoleGuard allowedRoles={['Admin', 'Counsellor', 'Teacher']}>
                        <StudentsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/admissions"
                    element={
                      <RoleGuard allowedRoles={['Admin', 'Counsellor']}>
                        <AdmissionsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/courses"
                    element={
                      <RoleGuard allowedRoles={['Admin', 'Counsellor', 'Teacher']}>
                        <CoursesPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/batches"
                    element={
                      <RoleGuard allowedRoles={['Admin', 'Teacher']}>
                        <BatchesPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/attendance"
                    element={
                      <RoleGuard allowedRoles={['Admin', 'Teacher']}>
                        <AttendancePage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/fees"
                    element={
                      <RoleGuard allowedRoles={['Admin']}>
                        <FeesPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/expenses"
                    element={
                      <RoleGuard allowedRoles={['Admin']}>
                        <ExpensesPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/whatsapp"
                    element={
                      <RoleGuard allowedRoles={['Admin', 'Counsellor']}>
                        <WhatsAppPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/documents"
                    element={
                      <RoleGuard allowedRoles={['Admin']}>
                        <DocumentsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/certificates"
                    element={
                      <RoleGuard allowedRoles={['Admin', 'Teacher']}>
                        <CertificatesPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/staff"
                    element={
                      <RoleGuard allowedRoles={['Admin']}>
                        <StaffPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <RoleGuard allowedRoles={['Admin']}>
                        <SettingsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <RoleGuard allowedRoles={['Admin']}>
                        <ReportsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/student-portal"
                    element={
                      <RoleGuard allowedRoles={['Student', 'Admin']}>
                        <StudentPortalPage />
                      </RoleGuard>
                    }
                  />
                </Routes>
              </MainLayout>
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
