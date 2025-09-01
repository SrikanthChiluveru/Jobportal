import React, { useState } from 'react';
import { Search, Filter, Users, BookOpen, Calendar, Award } from 'lucide-react';
import { useJob } from '../../context/JobContext';

// Mock student data
const mockStudents = [
  {
    id: '2',
    name: 'John Doe',
    email: 'john@student.com',
    course: 'MERN',
    batch: 'Batch-2024-01',
    phone: '+91-9876543210',
    joinDate: '2024-01-01',
    profileComplete: true
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@student.com',
    course: 'UIUX',
    batch: 'Batch-2024-02',
    phone: '+91-9876543211',
    joinDate: '2024-01-15',
    profileComplete: true
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike@student.com',
    course: 'Digital Marketing',
    batch: 'Batch-2024-01',
    phone: '+91-9876543212',
    joinDate: '2024-01-10',
    profileComplete: false
  }
];

export default function StudentManagement() {
  const { applications, getDashboardStats } = useJob();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('All');

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'All' || student.course === filterCourse;
    
    return matchesSearch && matchesCourse;
  });

  const getStudentStats = (studentId: string) => {
    const studentApps = applications.filter(app => app.studentId === studentId);
    return {
      totalApplications: studentApps.length,
      selected: studentApps.filter(app => app.status === 'selected').length,
      interviewed: studentApps.filter(app => app.status === 'interviewed').length,
      pending: studentApps.filter(app => app.status === 'applied' || app.status === 'shortlisted').length
    };
  };

  const courseColors = {
    'MERN': 'bg-blue-100 text-blue-800',
    'UIUX': 'bg-purple-100 text-purple-800',
    'Digital Marketing': 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Student Management</h2>
        <p className="text-gray-600 mt-2">Monitor student progress and applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Courses</option>
            <option value="MERN">MERN Fullstack</option>
            <option value="UIUX">UI/UX Design</option>
            <option value="Digital Marketing">Digital Marketing</option>
          </select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          const stats = getStudentStats(student.id);
          
          return (
            <div key={student.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-gray-600 text-sm">{student.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.profileComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.profileComplete ? 'Complete' : 'Incomplete'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Course:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${courseColors[student.course as keyof typeof courseColors]}`}>
                      {student.course}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Batch:</span>
                    <span className="text-sm text-gray-900">{student.batch}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Joined:</span>
                    <span className="text-sm text-gray-900">{student.joinDate}</span>
                  </div>
                </div>

                {/* Application Stats */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Application Stats
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{stats.totalApplications}</p>
                      <p className="text-xs text-gray-600">Total Applied</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.selected}</p>
                      <p className="text-xs text-gray-600">Selected</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{stats.interviewed}</p>
                      <p className="text-xs text-gray-600">Interviewed</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No students found matching your criteria</p>
        </div>
      )}
    </div>
  );
}