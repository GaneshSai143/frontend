export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User {
  id: number; // from /users/me & UserDTO
  firstName: string; // from /users/me & UserDTO
  lastName: string; // from /users/me & UserDTO
  email: string; // from /users/me & UserDTO
  role: UserRole; // from /users/me & UserDTO
  preferredTheme?: string | null; // from /users/me & UserDTO

  username?: string; // Was in old model, not in UserDTO from Swagger but useful for display
  enabled?: boolean; // from UserDTO (maps to isActive conceptually)
  phoneNumber?: string; // from UserDTO

  // Fields from UserDTO that might not be in /users/me but in other user contexts
  createdAt?: string; // date-time string from UserDTO
  updatedAt?: string; // date-time string from UserDTO

  // Contextual fields, not directly from UserDTO but used in frontend logic
  schoolId?: number | string | null; // schoolId in CreatePrincipalRequestDTO is number, in old dummy data it was string. API for school uses number.
  schoolName?: string; // For display convenience
  className?: string; // For StudentDTO context
  grade?: string; // For students
}