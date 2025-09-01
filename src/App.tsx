import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JobProvider } from './context/JobContext';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user.role === 'admin' 
            ? <Navigate to="/admin" replace /> 
            : <Navigate to="/student" replace />
        } 
      />
      <Route 
        path="/admin/*" 
        element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/student" replace />} 
      />
      <Route 
        path="/student/*" 
        element={user.role === 'student' ? <StudentDashboard /> : <Navigate to="/admin" replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </Router>
      </JobProvider>
    </AuthProvider>
  );
}

export default App;