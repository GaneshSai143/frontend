export interface User {
  id: number; // from /users/me
  firstName: string; // from /users/me
  lastName: string; // from /users/me
  email: string; // from /users/me
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT'; // from /users/me
  preferredTheme?: string | null; // from /users/me (can be null if not set)

  // Optional fields that might come from other sources or full user details endpoint
  username?: string;
  isActive?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  schoolId?: string | null; // From previous work, might be relevant
  grade?: string; // From previous work, relevant for students
}