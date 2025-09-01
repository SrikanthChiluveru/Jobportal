import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Calendar, MapPin, Briefcase } from 'lucide-react';
import { useJob } from '../../context/JobContext';
import { Job } from '../../types';
import AddJobModal from './AddJobModal';

export default function JobManagement() {
  const { jobs, deleteJob, getJobApplications } = useJob();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'All' || job.course === filterCourse;
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job? This will also delete all related applications.')) {
      deleteJob(jobId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Job Management</h2>
          <p className="text-gray-600 mt-2">Create and manage job postings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Job</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
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
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job) => {
          const applications = getJobApplications(job.id);
          
          return (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.type}</span>
                    {job.salary && (
                      <>
                        <span>•</span>
                        <span>{job.salary}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {job.deadline}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {job.course}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                      {applications.length} Applications
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Posted {job.postedDate}</p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingJob(job);
                        setShowAddModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Job"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No jobs found matching your criteria</p>
        </div>
      )}

      {/* Add/Edit Job Modal */}
      {showAddModal && (
        <AddJobModal
          job={editingJob}
          onClose={() => {
            setShowAddModal(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
}