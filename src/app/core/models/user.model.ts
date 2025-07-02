export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User { // Primarily aligns with UserDTO from Swagger
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  preferredTheme?: string | null;
  enabled?: boolean;
  phoneNumber?: string;
  createdAt?: string; // Assuming ISO date-time string
  updatedAt?: string; // Assuming ISO date-time string
  username?: string; // Kept as optional for display, though not in UserDTO spec directly

  // Contextual/denormalized fields that might appear in specific responses or UI needs
  // These are NOT part of the core UserDTO from /users/{id} or /users/me generally
  schoolId?: number | null; // e.g. if a UserDTO is part of a TeacherProfile that has schoolId
  schoolName?: string;    // For display convenience
  className?: string;     // e.g. if UserDTO is part of StudentProfile with className
  grade?: string;         // e.g. for students
}