import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, CheckCircle, XCircle, Eye, User, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJob } from '../../context/JobContext';

export default function MyApplications() {
  const { user } = useAuth();
  const { getStudentApplications, jobs } = useJob();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const myApplications = getStudentApplications(user?.id || '');

  const filteredApplications = myApplications.filter(app => {
    const job = jobs.find(j => j.id === app.jobId);
    const matchesSearch = job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job?.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    applied: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
    shortlisted: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Eye },
    interviewed: { bg: 'bg-purple-100', text: 'text-purple-800', icon: User },
    selected: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
  };

  const getJob = (jobId: string) => jobs.find(j => j.id === jobId);

  const statusCounts = myApplications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">My Applications</h2>
        <p className="text-gray-600 mt-2">Track the status of your job applications</p>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusColors).map(([status, config]) => {
          const count = statusCounts[status] || 0;
          const StatusIcon = config.icon;
          
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center`}>
                  <StatusIcon className={`w-5 h-5 ${config.text}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-600 capitalize">{status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewed">Interviewed</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => {
          const job = getJob(application.jobId);
          const statusConfig = statusColors[application.status];
          const StatusIcon = statusConfig.icon;

          if (!job) return null;

          return (
            <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <div className="flex items-center">
                      <StatusIcon className="w-4 h-4 mr-2" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 font-medium mb-2">{job.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Applied: {application.appliedDate}
                    </div>
                    
                    <span>•</span>
                    
                    <div className="flex items-center">
                      <span>{job.location}</span>
                    </div>
                    
                    <span>•</span>
                    
                    <div className="flex items-center">
                      <span>{job.type}</span>
                    </div>
                  </div>

                  {application.interviewDate && (
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center text-purple-800">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          Interview scheduled for: {application.interviewDate}
                        </span>
                      </div>
                    </div>
                  )}

                  {application.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <FileText className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Notes:</p>
                          <p className="text-sm text-gray-600">{application.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  {job.salary && (
                    <p className="text-sm text-gray-600 mb-2">{job.salary}</p>
                  )}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    job.course === 'MERN' ? 'bg-blue-100 text-blue-800' :
                    job.course === 'UIUX' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {job.course}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {myApplications.length === 0 ? 'No applications yet' : 'No applications found'}
          </p>
          <p className="text-gray-500">
            {myApplications.length === 0 
              ? 'Start browsing jobs to apply!' 
              : 'Try adjusting your search criteria'
            }
          </p>
        </div>
      )}
    </div>
  );
}