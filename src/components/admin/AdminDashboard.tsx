import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminOverview from './AdminOverview';
import JobManagement from './JobManagement';
import ApplicationManagement from './ApplicationManagement';
import StudentManagement from './StudentManagement';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/jobs" element={<JobManagement />} />
            <Route path="/applications" element={<ApplicationManagement />} />
            <Route path="/students" element={<StudentManagement />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}