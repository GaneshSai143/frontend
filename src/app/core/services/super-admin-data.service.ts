import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Removed BehaviorSubject, of
import { catchError } from 'rxjs/operators'; // Removed map, tap, delay
import { environment } from '../../../environments/environment';

// Interface for the Super Admin Dashboard API response
export interface SuperAdminDashboardStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalPrincipals: number; // Assuming API provides this, or it's total ADMIN users
  activeUsers?: number; // Optional, if API provides it
  // Add any other metrics returned by GET /api/v1/dashboard/super-admin
  // recentActivities?: any[]; // If API returns recent activities
}

// The existing School and User interfaces might still be needed for
// future CRUD operations on "Manage Schools/Principals" tabs,
// but will be fetched via different API endpoints.
// For now, SuperAdminDataService focuses on the dashboard overview.

// Re-defining minimal User and School if needed by other parts or for type safety,
// ideally these would be consolidated from core/models.
export interface School { // Restoring fields based on original schools.json and component usage
  id: string;
  name: string;
  principalId: string;
  address: string;
  email: string;
  phone: string;
  establishedDate: string;
  studentCount?: number; // Made optional as they might not always be present or editable
  teacherCount?: number; // Made optional
}

export interface User {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';
  isActive?: boolean;
  schoolId?: string | null;
  grade?: string;
}


@Injectable({
  providedIn: 'root'
})
export class SuperAdminDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSuperAdminDashboardStats(): Observable<SuperAdminDashboardStats> {
    return this.http.get<SuperAdminDashboardStats>(`${this.apiUrl}/dashboard/super-admin`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Placeholder for fetching data for Manage Schools/Principals/Students tabs
  // These would call different APIs (e.g., /api/v1/schools, /api/v1/users?role=ADMIN, etc.)
  // For now, these tabs will be display-only or use component-level mock data if needed.

  // The BehaviorSubject and CRUD methods for schools and users are removed from this service
  // as they were based on dummy JSON. Live CRUD will require new API endpoints and methods.
  // If any component still relies on schools$ or users$ from this service,
  // those components will need to be updated or this service needs to provide those
  // observables based on new API calls (e.g. for populating dropdowns).
  // For now, let's assume components like SuperAdminDashboard will manage their own lists for CRUD tabs.

  private handleError(error: any): Observable<never> {
    console.error('An API error occurred in SuperAdminDataService:', error);
    return throwError(() => new Error('Failed to load Super Admin dashboard data; please try again later.'));
  }
}
