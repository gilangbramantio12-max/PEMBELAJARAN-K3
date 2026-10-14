import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { CourseDetail } from './pages/CourseDetail';
import { Classroom } from './pages/Classroom';
import { QuizArena } from './pages/QuizArena';
import { QuizResult } from './pages/QuizResult';
import { Dashboard } from './pages/Dashboard';
import { CertificateDetail } from './pages/CertificateDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Catalog />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/certificate/:certificateId" element={<CertificateDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Participant Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseId/lesson/:lessonId"
                  element={
                    <ProtectedRoute>
                      <Classroom />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseId/quiz/:quizId"
                  element={
                    <ProtectedRoute>
                      <QuizArena />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseId/quiz/:quizId/result/:attemptId"
                  element={
                    <ProtectedRoute>
                      <QuizResult />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
