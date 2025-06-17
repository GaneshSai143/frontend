export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';
  schoolId?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 