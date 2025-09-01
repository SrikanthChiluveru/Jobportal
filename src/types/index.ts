export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  course?: 'MERN' | 'UIUX' | 'Digital Marketing';
  batch?: string;
  phone?: string;
  profileComplete?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  course: 'MERN' | 'UIUX' | 'Digital Marketing' | 'All';
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship';
  salary?: string;
  postedDate: string;
  deadline: string;
  status: 'active' | 'closed';
  applicationsCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  appliedDate: string;
  status: 'applied' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected';
  notes?: string;
  interviewDate?: string;
  documents?: {
    resume?: string;
    portfolio?: string;
  };
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  thisMonthApplications: number;
  selectedCount: number;
  interviewCount: number;
}