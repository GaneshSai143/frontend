import { User } from './user.model'; // Assuming UserDTO maps to our User model

// Minimal ClassDTO for SchoolDTO context
export interface MinimalClassInfo { // Renamed from ClassDTO to avoid conflict if full ClassDTO is defined elsewhere
  id: number;
  name: string;
  // Other fields like schoolId, classTeacher, students might not be needed in SchoolDTO's 'classes' array display
}

export interface School { // Based on SchoolDTO from Swagger
  id: number;
  name: string;
  location: string; // Maps to 'address' in some contexts, 'location' in SchoolDTO
  principal?: User; // UserDTO for principal details
  classes?: MinimalClassInfo[]; // Array of ClassDTO (simplified here)
  createdAt?: string; // Typically string in ISO format from backend
  updatedAt?: string; // Typically string in ISO format from backend

  // Fields from older model/dummy data that might still be used in UI or forms, make optional
  // These were used by SuperAdminDashboard forms/tables
  address?: string; // Covered by location, but keeping if UI uses 'address' specifically
  email?: string;
  phone?: string;
  principalId?: number | null; // Used in forms, API takes principalId for create/update
  establishedDate?: string;
  studentCount?: number;
  teacherCount?: number;
  website?: string; // from old model
  logo?: string; // from old model
}

export interface CreateSchoolRequest { // Based on CreateSchoolRequestDTO
  name: string;
  location: string;
  principalId: number;
}

export interface UpdateSchoolRequest { // Based on UpdateSchoolRequestDTO
  name?: string;
  location?: string;
  principalId?: number;
}