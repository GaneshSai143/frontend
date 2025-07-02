import { User } from './user.model'; // Assuming UserDTO maps to our User model

// Minimal ClassDTO for SchoolDTO context
export interface MinimalClassInfo { // Renamed from ClassDTO to avoid conflict if full ClassDTO is defined elsewhere
  id: number;
  name: string;
  // Other fields like schoolId, classTeacher may not be needed for simple list display in SchoolDTO
}

export interface School { // Aligns with SchoolDTO from Swagger
  id: number;
  name: string;
  location: string;
  principal?: User; // Nested UserDTO for the principal
  classes?: MinimalClassInfo[];
  createdAt?: string;
  updatedAt?: string;

  // Optional fields that might be used in UI forms but not part of core SchoolDTO response
  // These were part of the older 'School' interface or form requirements.
  // The main SchoolDTO focuses on 'location' for address-like info.
  // 'email' and 'phone' for a school are not in SchoolDTO.
  // 'establishedDate', 'studentCount', 'teacherCount' are not in SchoolDTO.
  email?: string; // Not in SchoolDTO, consider removing if not used
  phone?: string; // Not in SchoolDTO, consider removing if not used
  establishedDate?: string; // Not in SchoolDTO
  // principalId is handled by CreateSchoolRequest/UpdateSchoolRequest, not part of SchoolDTO response directly.
}

export interface CreateSchoolRequest { // Aligns with CreateSchoolRequestDTO
  name: string;
  location: string;
  principalId: number; // ID of the User who is the principal
}

export interface UpdateSchoolRequest { // Aligns with UpdateSchoolRequestDTO
  name?: string;
  location?: string;
  principalId?: number; // ID of the User who is the principal
}