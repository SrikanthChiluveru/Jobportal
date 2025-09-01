import React from 'react';
import { Briefcase, FileText, CheckCircle, Clock, TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJob } from '../../context/JobContext';

export default function StudentOverview() {
  const { user } = useAuth();
  const { getDashboardStats, getStudentApplications, jobs } = useJob();
  const stats = getDashboardStats(user?.id);
  const myApplications = getStudentApplications(user?.id || '');

  const recentApplications = myApplications.slice(0, 3);

  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-yellow-100 text-yellow-800',
    interviewed: 'bg-purple-100 text-purple-800',
    selected: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Unknown Job';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2">Track your job search progress and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Applications Sent</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplications}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600">+{stats.thisMonthApplications} this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeJobs}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">Fresh opportunities</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Interview Calls</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.interviewCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-600">Keep preparing!</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Job Offers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.selectedCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600">Congratulations!</span>
          </div>
        </div>
      </div>

      {/* Recent Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Recent Applications
            </h3>
          </div>
          <div className="p-6">
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{getJobTitle(app.jobId)}</p>
                      <p className="text-sm text-gray-600">Applied on {app.appliedDate}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No applications yet</p>
                <p className="text-sm text-gray-500">Start browsing jobs to apply!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Your Progress
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Application Success Rate */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Success Rate</span>
                  <span className="text-sm text-gray-600">
                    {stats.totalApplications > 0 ? Math.round((stats.selectedCount / stats.totalApplications) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ 
                      width: `${stats.totalApplications > 0 ? (stats.selectedCount / stats.totalApplications) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Interview Rate */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Interview Rate</span>
                  <span className="text-sm text-gray-600">
                    {stats.totalApplications > 0 ? Math.round((stats.interviewCount / stats.totalApplications) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ 
                      width: `${stats.totalApplications > 0 ? (stats.interviewCount / stats.totalApplications) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Course Badge */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Enrolled Course:</p>
                <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                  {user?.course}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready to apply for more jobs?</h3>
            <p className="text-blue-100">Discover new opportunities that match your skills</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}