import React from 'react';
import { Briefcase, Users, CheckCircle, Clock, TrendingUp, Calendar } from 'lucide-react';
import { useJob } from '../../context/JobContext';

export default function AdminOverview() {
  const { getDashboardStats, applications, jobs } = useJob();
  const stats = getDashboardStats();

  const recentApplications = applications.slice(0, 5);

  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-yellow-100 text-yellow-800',
    interviewed: 'bg-purple-100 text-purple-800',
    selected: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2">Monitor your placement activities and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJobs}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">{stats.activeJobs} active jobs</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplications}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+{stats.thisMonthApplications} this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selected</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.selectedCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Success rate: {stats.totalApplications > 0 ? Math.round((stats.selectedCount / stats.totalApplications) * 100) : 0}%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Interviews</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.interviewCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">In progress</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{app.studentName}</p>
                    <p className="text-sm text-gray-600">{jobs.find(j => j.id === app.jobId)?.title}</p>
                    <p className="text-xs text-gray-500">{app.appliedDate}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">{app.course}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Course Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['MERN', 'UIUX', 'Digital Marketing'].map((course) => {
                const courseApps = applications.filter(app => app.course === course);
                const percentage = stats.totalApplications > 0 ? (courseApps.length / stats.totalApplications) * 100 : 0;
                
                return (
                  <div key={course}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{course}</span>
                      <span className="text-sm text-gray-600">{courseApps.length} applications</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}