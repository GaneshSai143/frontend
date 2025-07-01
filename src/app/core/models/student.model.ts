import { User } from './user.model';

// Based on StudentDTO from Swagger
export interface StudentProfile { // Renamed to avoid conflict if 'Student' is used as a class name
  id: number;
  user: User; // Full UserDTO
  classId: number;
  className: string;
  createdAt?: string; // from UserDTO via 'user' if that's how it's structured, or directly if on StudentProfile
  updatedAt?: string;
}

export interface UpdateStudentClassRequest { // Based on UpdateStudentRequestDTO
  classId?: number;
}

// For Student Dashboard - GET /api/dashboard/student/summary
export interface TaskSummary { // Based on TaskSummaryDTO
  id: number;
  title: string;
  dueDate: string; // date-time
  subjectName: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  taskType: 'HOMEWORK' | 'EXAM' | 'QUIZ' | 'PROJECT' | 'OTHER';
}

export interface PerformanceItem { // Based on PerformanceItemDTO
  subjectName: string;
  averagePercentage: number;
  periodDescription: string;
}

export interface StudentDashboardSummary { // Based on StudentDashboardDTO
  pendingTasksCount: number;
  recentPendingTasks: TaskSummary[];
  performanceSummary: PerformanceItem[];
}
