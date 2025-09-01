import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job, Application, DashboardStats } from '../types';

interface JobContextType {
  jobs: Job[];
  applications: Application[];
  addJob: (job: Omit<Job, 'id' | 'postedDate' | 'applicationsCount'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  applyForJob: (jobId: string, studentData: any) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status'], notes?: string) => void;
  getStudentApplications: (studentId: string) => Application[];
  getJobApplications: (jobId: string) => Application[];
  getDashboardStats: (userId?: string) => DashboardStats;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Mock data
const initialJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend React Developer',
    company: 'TechCorp Solutions',
    description: 'We are looking for a skilled React developer to join our team.',
    requirements: ['React.js', 'JavaScript', 'HTML/CSS', 'Node.js'],
    course: 'MERN',
    location: 'Bangalore',
    type: 'Full-time',
    salary: '4-6 LPA',
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    status: 'active',
    applicationsCount: 12
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'Design Studio Inc',
    description: 'Creative UI/UX designer needed for innovative projects.',
    requirements: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
    course: 'UIUX',
    location: 'Mumbai',
    type: 'Full-time',
    salary: '3.5-5 LPA',
    postedDate: '2024-01-20',
    deadline: '2024-02-20',
    status: 'active',
    applicationsCount: 8
  },
  {
    id: '3',
    title: 'Digital Marketing Specialist',
    company: 'MarketPro Agency',
    description: 'Digital marketing expert with AI tools knowledge.',
    requirements: ['SEO/SEM', 'Social Media', 'AI Tools', 'Analytics'],
    course: 'Digital Marketing',
    location: 'Delhi',
    type: 'Full-time',
    salary: '3-4.5 LPA',
    postedDate: '2024-01-25',
    deadline: '2024-02-25',
    status: 'active',
    applicationsCount: 15
  }
];

const initialApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    studentId: '2',
    studentName: 'John Doe',
    studentEmail: 'john@student.com',
    course: 'MERN',
    appliedDate: '2024-01-16',
    status: 'shortlisted',
    interviewDate: '2024-02-01',
    notes: 'Strong technical background'
  },
  {
    id: '2',
    jobId: '2',
    studentId: '3',
    studentName: 'Jane Smith',
    studentEmail: 'jane@student.com',
    course: 'UIUX',
    appliedDate: '2024-01-21',
    status: 'interviewed',
    notes: 'Excellent portfolio'
  }
];

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  const addJob = (jobData: Omit<Job, 'id' | 'postedDate' | 'applicationsCount'>) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedDate: new Date().toISOString().split('T')[0],
      applicationsCount: 0
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateJob = (id: string, jobData: Partial<Job>) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, ...jobData } : job));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
    setApplications(prev => prev.filter(app => app.jobId !== id));
  };

  const applyForJob = (jobId: string, studentData: any) => {
    const newApplication: Application = {
      id: Date.now().toString(),
      jobId,
      studentId: studentData.id,
      studentName: studentData.name,
      studentEmail: studentData.email,
      course: studentData.course,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied'
    };
    
    setApplications(prev => [...prev, newApplication]);
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, applicationsCount: job.applicationsCount + 1 }
        : job
    ));
  };

  const updateApplicationStatus = (applicationId: string, status: Application['status'], notes?: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status, notes: notes || app.notes }
        : app
    ));
  };

  const getStudentApplications = (studentId: string) => {
    return applications.filter(app => app.studentId === studentId);
  };

  const getJobApplications = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const getDashboardStats = (userId?: string): DashboardStats => {
    if (userId) {
      // Student stats
      const studentApps = applications.filter(app => app.studentId === userId);
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth());
      const thisMonthApps = studentApps.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate.getMonth() === thisMonth.getMonth() && 
               appDate.getFullYear() === thisMonth.getFullYear();
      });

      return {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === 'active').length,
        totalApplications: studentApps.length,
        thisMonthApplications: thisMonthApps.length,
        selectedCount: studentApps.filter(app => app.status === 'selected').length,
        interviewCount: studentApps.filter(app => app.status === 'interviewed').length
      };
    } else {
      // Admin stats
      return {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === 'active').length,
        totalApplications: applications.length,
        thisMonthApplications: applications.filter(app => {
          const appDate = new Date(app.appliedDate);
          const thisMonth = new Date();
          return appDate.getMonth() === thisMonth.getMonth() && 
                 appDate.getFullYear() === thisMonth.getFullYear();
        }).length,
        selectedCount: applications.filter(app => app.status === 'selected').length,
        interviewCount: applications.filter(app => app.status === 'interviewed').length
      };
    }
  };

  return (
    <JobContext.Provider value={{
      jobs,
      applications,
      addJob,
      updateJob,
      deleteJob,
      applyForJob,
      updateApplicationStatus,
      getStudentApplications,
      getJobApplications,
      getDashboardStats
    }}>
      {children}
    </JobContext.Provider>
  );
}

export const useJob = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};