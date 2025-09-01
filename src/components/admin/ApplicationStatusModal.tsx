import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, Briefcase, BookOpen, FileText } from 'lucide-react';
import { useJob } from '../../context/JobContext';
import { Application, Job } from '../../types';

interface ApplicationStatusModalProps {
  application: Application;
  job?: Job;
  onClose: () => void;
}

export default function ApplicationStatusModal({ application, job, onClose }: ApplicationStatusModalProps) {
  const { updateApplicationStatus } = useJob();
  const [selectedStatus, setSelectedStatus] = useState(application.status);
  const [notes, setNotes] = useState(application.notes || '');
  const [interviewDate, setInterviewDate] = useState(application.interviewDate || '');

  const statusOptions = [
    { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'interviewed', label: 'Interviewed', color: 'bg-purple-100 text-purple-800' },
    { value: 'selected', label: 'Selected', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplicationStatus(application.id, selectedStatus as any, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Application Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Student Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{application.studentName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {application.studentEmail}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <p className="mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium flex items-center inline-flex">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {application.course}
                  </span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {application.appliedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Job Information */}
          {job && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Job Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{job.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <p className="mt-1 text-sm text-gray-900">{job.company}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{job.location}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1 text-sm text-gray-900">{job.type}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Management Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Application Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {statusOptions.map((status) => (
                  <label
                    key={status.value}
                    className={`
                      relative flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all
                      ${selectedStatus === status.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={selectedStatus === status.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="sr-only"
                    />
                    <span className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {(selectedStatus === 'interviewed' || selectedStatus === 'shortlisted') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Date
                </label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes about this application..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                Update Status
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}