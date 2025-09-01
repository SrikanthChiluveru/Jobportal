import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, Briefcase, FileText, Users, GraduationCap } from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/jobs', icon: Briefcase, label: 'Job Management' },
  { to: '/admin/applications', icon: FileText, label: 'Applications' },
  { to: '/admin/students', icon: Users, label: 'Students' },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-300 ease-in-out
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Student Tribe</span>
          </div>
          
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}