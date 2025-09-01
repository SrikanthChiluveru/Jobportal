import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import { useJob } from '../../context/JobContext';
import ApplicationStatusModal from './ApplicationStatusModal';

export default function ApplicationManagement() {
  const { applications, jobs, updateApplicationStatus } = useJob();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCourse, setFilterCourse] = useState<string>('All');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const filteredApplications = applications.filter(app => {
    const job = jobs.find(j => j.id === app.jobId);
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job?.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesCourse = filterCourse === 'All' || app.course === filterCourse;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const statusColors = {
    applied: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
    shortlisted: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Eye },
    interviewed: { bg: 'bg-purple-100', text: 'text-purple-800', icon: User },
    selected: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
  };

  const getJob = (jobId: string) => jobs.find(j => j.id === jobId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Application Management</h2>
        <p className="text-gray-600 mt-2">Review and manage student applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => {
                const job = getJob(application.jobId);
                const statusConfig = statusColors[application.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.studentEmail}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {job?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {job?.company}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {application.course}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {application.appliedDate}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="w-4 h-4 mr-2" />
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                          {application.status}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No applications found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Application Status Modal */}
      {selectedApplication && (
        <ApplicationStatusModal
          application={selectedApplication}
          job={getJob(selectedApplication.jobId)}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}