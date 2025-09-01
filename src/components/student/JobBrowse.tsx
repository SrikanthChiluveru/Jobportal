import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Briefcase, Building2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJob } from '../../context/JobContext';
import { Job } from '../../types';

export default function JobBrowse() {
  const { user } = useAuth();
  const { jobs, applyForJob, getStudentApplications } = useJob();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');

  const myApplications = getStudentApplications(user?.id || '');
  const appliedJobIds = myApplications.map(app => app.jobId);

  const filteredJobs = jobs.filter(job => {
    if (job.status !== 'active') return false;
    
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filterCourse === 'All' || 
                         job.course === filterCourse || 
                         job.course === 'All' || 
                         (user?.course && (job.course === user.course || job.course === 'All'));
    
    const matchesType = filterType === 'All' || job.type === filterType;
    
    return matchesSearch && matchesCourse && matchesType;
  });

  const handleApply = (job: Job) => {
    if (user) {
      applyForJob(job.id, user);
    }
  };

  const isJobApplied = (jobId: string) => appliedJobIds.includes(jobId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Browse Jobs</h2>
        <p className="text-gray-600 mt-2">Discover opportunities that match your skills</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies..."
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {filteredJobs.map((job) => {
          const isApplied = isJobApplied(job.id);
          const daysLeft = Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600 font-medium mb-2">{job.company}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </div>
                          
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {job.type}
                          </div>
                          
                          {job.salary && (
                            <div className="flex items-center">
                              <span>💰 {job.salary}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      job.course === 'All' ? 'bg-gray-100 text-gray-800' : 
                      job.course === 'MERN' ? 'bg-blue-100 text-blue-800' :
                      job.course === 'UIUX' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {job.course}
                    </span>
                    
                    {daysLeft <= 3 && daysLeft > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Urgent
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                {job.requirements.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 6).map((req, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 6 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{job.requirements.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Posted {job.postedDate}</span>
                    <span>•</span>
                    <span>{job.applicationsCount} applicants</span>
                  </div>
                  
                  <button
                    onClick={() => handleApply(job)}
                    disabled={isApplied || daysLeft <= 0}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isApplied 
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : daysLeft <= 0
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isApplied ? 'Applied ✓' : daysLeft <= 0 ? 'Deadline Passed' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No jobs found</p>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}