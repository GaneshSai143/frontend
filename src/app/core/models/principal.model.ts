import { UserRole } from './user.model';

export interface CreatePrincipalRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // As per CreatePrincipalRequestDTO
  phoneNumber?: string;
  schoolId: number;
  role: UserRole; // Should be 'ADMIN' when creating a principal
}
