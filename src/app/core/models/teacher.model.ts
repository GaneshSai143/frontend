import { User } from './user.model';

// Based on TeacherDTO from Swagger
export interface TeacherProfile { // Renamed to avoid conflict
  id: number;
  user: User; // Full UserDTO
  subjects?: string[]; // Array of subject names or codes
  createdAt?: string;
  updatedAt?: string;
}

// Based on CreateTeacherByAdminRequestDTO
export interface CreateTeacherByAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // minLength: 6, required by DTO for /api/admin/teachers
  phoneNumber?: string;
  subjects?: string[];
  role: 'TEACHER'; // Fixed role
}

// Based on CreateTeacherRequestDTO (if linking existing user)
export interface CreateTeacherProfileRequest {
    userId: number;
    subjects?: string[];
}

// Based on UpdateTeacherRequestDTO
export interface UpdateTeacherProfileRequest {
    subjects?: string[];
}
