import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthGuard } from './components/layout/AuthGuard.jsx';
import { RoleGuard } from './components/layout/RoleGuard.jsx';
import { MainLayout } from './components/layout/MainLayout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { AdmissionApplicationPage } from './pages/AdmissionApplicationPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { CRMPage } from './pages/CRMPage.jsx';
import { FollowupsPage } from './pages/FollowupsPage.jsx';
import { StudentsPage } from './pages/StudentsPage.jsx';
import { AdmissionsPage } from './pages/AdmissionsPage.jsx';
import { CoursesPage } from './pages/CoursesPage.jsx';
import { BatchesPage } from './pages/BatchesPage.jsx';
import { AttendancePage } from './pages/AttendancePage.jsx';
import { ExamsPage } from './pages/ExamsPage.jsx';
import { AcademicCalendarPage } from './pages/AcademicCalendarPage.jsx';
import { TransportPage } from './pages/TransportPage.jsx';
import { InventoryPage } from './pages/InventoryPage.jsx';
import { LibraryPage } from './pages/LibraryPage.jsx';
import { HomeworkPage } from './pages/HomeworkPage.jsx';
import { ScholarshipPage } from './pages/ScholarshipPage.jsx';
import { PTMPage } from './pages/PTMPage.jsx';
import { NoticePage } from './pages/NoticePage.jsx';
import { ChatPage } from './pages/ChatPage.jsx';
import { LeavePage } from './pages/LeavePage.jsx';
import { FeesPage } from './pages/FeesPage.jsx';
import { ExpensesPage } from './pages/ExpensesPage.jsx';
import { WhatsAppPage } from './pages/WhatsAppPage.jsx';
import { DocumentsPage } from './pages/DocumentsPage.jsx';
import { CertificatesPage } from './pages/CertificatesPage.jsx';
import { StaffPage } from './pages/StaffPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { ReportsPage } from './pages/ReportsPage.jsx';
import { ParentPortalPage } from './pages/ParentPortalPage.jsx';
import { StudentPortalPage } from './pages/StudentPortalPage.jsx';
import { VerifyCertificatePage } from './pages/VerifyCertificatePage.jsx';

export const App = () => {
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
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Counsellor', 'Teacher', 'Accountant', 'Librarian', 'Transport Manager', 'HR']}>
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
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Teacher']}>
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
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Transport Manager', 'Parent']}>
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
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Teacher', 'Student']}>
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
                      <RoleGuard allowedRoles={['Owner', 'Admin', 'Teacher']}>
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
    </BrowserRouter>
  );
};

export default App;
