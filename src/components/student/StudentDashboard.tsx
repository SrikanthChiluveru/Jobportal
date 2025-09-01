import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';
import StudentOverview from './StudentOverview';
import JobBrowse from './JobBrowse';
import MyApplications from './MyApplications';

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<StudentOverview />} />
            <Route path="/browse" element={<JobBrowse />} />
            <Route path="/applications" element={<MyApplications />} />
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}