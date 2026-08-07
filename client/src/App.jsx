import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthGuard } from './components/layout/AuthGuard.jsx';
import { RoleGuard } from './components/layout/RoleGuard.jsx';
import { MainLayout } from './components/layout/MainLayout.jsx';

const LoginPage = lazy(() => import('./pages/LoginPage.jsx').then((m) => ({ default: m.LoginPage })));
const AdmissionApplicationPage = lazy(() => import('./pages/AdmissionApplicationPage.jsx').then((m) => ({ default: m.AdmissionApplicationPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx').then((m) => ({ default: m.DashboardPage })));
const CRMPage = lazy(() => import('./pages/CRMPage.jsx').then((m) => ({ default: m.CRMPage })));
const FollowupsPage = lazy(() => import('./pages/FollowupsPage.jsx').then((m) => ({ default: m.FollowupsPage })));
const StudentsPage = lazy(() => import('./pages/StudentsPage.jsx').then((m) => ({ default: m.StudentsPage })));
const AdmissionsPage = lazy(() => import('./pages/AdmissionsPage.jsx').then((m) => ({ default: m.AdmissionsPage })));
const CoursesPage = lazy(() => import('./pages/CoursesPage.jsx').then((m) => ({ default: m.CoursesPage })));
const BatchesPage = lazy(() => import('./pages/BatchesPage.jsx').then((m) => ({ default: m.BatchesPage })));
const AttendancePage = lazy(() => import('./pages/AttendancePage.jsx').then((m) => ({ default: m.AttendancePage })));
const ExamsPage = lazy(() => import('./pages/ExamsPage.jsx').then((m) => ({ default: m.ExamsPage })));
const AcademicCalendarPage = lazy(() => import('./pages/AcademicCalendarPage.jsx').then((m) => ({ default: m.AcademicCalendarPage })));
const TransportPage = lazy(() => import('./pages/TransportPage.jsx').then((m) => ({ default: m.TransportPage })));
const InventoryPage = lazy(() => import('./pages/InventoryPage.jsx').then((m) => ({ default: m.InventoryPage })));
const LibraryPage = lazy(() => import('./pages/LibraryPage.jsx').then((m) => ({ default: m.LibraryPage })));
const HomeworkPage = lazy(() => import('./pages/HomeworkPage.jsx').then((m) => ({ default: m.HomeworkPage })));
const ScholarshipPage = lazy(() => import('./pages/ScholarshipPage.jsx').then((m) => ({ default: m.ScholarshipPage })));
const PTMPage = lazy(() => import('./pages/PTMPage.jsx').then((m) => ({ default: m.PTMPage })));
const NoticePage = lazy(() => import('./pages/NoticePage.jsx').then((m) => ({ default: m.NoticePage })));
const ChatPage = lazy(() => import('./pages/ChatPage.jsx').then((m) => ({ default: m.ChatPage })));
const LeavePage = lazy(() => import('./pages/LeavePage.jsx').then((m) => ({ default: m.LeavePage })));
const FeesPage = lazy(() => import('./pages/FeesPage.jsx').then((m) => ({ default: m.FeesPage })));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage.jsx').then((m) => ({ default: m.ExpensesPage })));
const WhatsAppPage = lazy(() => import('./pages/WhatsAppPage.jsx').then((m) => ({ default: m.WhatsAppPage })));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage.jsx').then((m) => ({ default: m.DocumentsPage })));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage.jsx').then((m) => ({ default: m.CertificatesPage })));
const StaffPage = lazy(() => import('./pages/StaffPage.jsx').then((m) => ({ default: m.StaffPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx').then((m) => ({ default: m.SettingsPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage.jsx').then((m) => ({ default: m.ReportsPage })));
const ParentPortalPage = lazy(() => import('./pages/ParentPortalPage.jsx').then((m) => ({ default: m.ParentPortalPage })));
const StudentPortalPage = lazy(() => import('./pages/StudentPortalPage.jsx').then((m) => ({ default: m.StudentPortalPage })));
const VerifyCertificatePage = lazy(() => import('./pages/VerifyCertificatePage.jsx').then((m) => ({ default: m.VerifyCertificatePage })));

const PageLoader = () => (
  <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3 p-8">
    <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
    <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading ELH Module...</p>
  </div>
);

export const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR', 'Parent', 'Student']}>
                        <DashboardPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/crm"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor']}>
                        <CRMPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/followups"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor']}>
                        <FollowupsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/students"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor', 'Teacher']}>
                        <StudentsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/admissions"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor']}>
                        <AdmissionsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/courses"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor', 'Teacher']}>
                        <CoursesPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/batches"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Teacher', 'Counsellor']}>
                        <BatchesPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/attendance"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Teacher']}>
                        <AttendancePage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/exams"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Teacher', 'Student', 'Parent']}>
                        <ExamsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/academic-calendar"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR', 'Parent', 'Student']}>
                        <AcademicCalendarPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/transport"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Transport Manager', 'Parent', 'Student']}>
                        <TransportPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/inventory"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Librarian']}>
                        <InventoryPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/library"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Librarian', 'Teacher', 'Student']}>
                        <LibraryPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/homework"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Teacher', 'Student', 'Parent']}>
                        <HomeworkPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/scholarships"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Accountant']}>
                        <ScholarshipPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/ptm"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Teacher', 'Parent']}>
                        <PTMPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/notices"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR', 'Parent', 'Student']}>
                        <NoticePage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR', 'Parent', 'Student']}>
                        <ChatPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/leaves"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'HR', 'Teacher']}>
                        <LeavePage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/fees"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Accountant']}>
                        <FeesPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/expenses"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Accountant']}>
                        <ExpensesPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/whatsapp"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor']}>
                        <WhatsAppPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/documents"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin']}>
                        <DocumentsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/certificates"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Teacher', 'Student', 'Parent']}>
                        <CertificatesPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/staff"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'HR']}>
                        <StaffPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin']}>
                        <SettingsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Accountant', 'Librarian', 'Transport Manager', 'HR']}>
                        <ReportsPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/parent-portal"
                    element={
                      <RoleGuard allowedRoles={['Parent', 'Owner', 'Admin']}>
                        <ParentPortalPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="/student-portal"
                    element={
                      <RoleGuard allowedRoles={['Student', 'Owner', 'Admin']}>
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
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
