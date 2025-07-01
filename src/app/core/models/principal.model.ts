import { UserRole } from './user.model';

export interface CreatePrincipalRequest {
  username?: string; // Added, assuming backend can handle/derive it or it's part of UserDTO creation
  firstName: string;
  lastName: string;
  email: string;
  password: string; // As per CreatePrincipalRequestDTO
  phoneNumber?: string;
  schoolId: number;
  role: UserRole; // Should be 'ADMIN' when creating a principal
}
