import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Removed BehaviorSubject, of
import { catchError } from 'rxjs/operators'; // Removed map, tap, delay
import { environment } from '../../../environments/environment';

// import { environment } from '../../../environments/environment'; // Removed duplicate
import {
    School,
    CreateSchoolRequest,
    UpdateSchoolRequest
} from '../../core/models/school.model';
import { User } from '../../core/models/user.model';
import { CreatePrincipalRequest } from '../../core/models/principal.model';
import {
    StudentProfile as StudentListDTO, // Alias to clarify it's for listing
    UpdateStudentClassRequest
} from '../../core/models/student.model';
import { TeacherProfile as TeacherListDTO } from '../../core/models/teacher.model';


// Interface for the Super Admin Dashboard API response (if one existed for overview)
// export interface SuperAdminDashboardStats { ... }


@Injectable({
  providedIn: 'root'
})
export class SuperAdminDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- School Management ---
  getSchools(): Observable<School[]> { // Assuming School model matches SchoolDTO
    return this.http.get<School[]>(`${this.apiUrl}/schools`)
      .pipe(catchError(this.handleError));
  }

  createSchool(schoolData: CreateSchoolRequest): Observable<School> {
    return this.http.post<School>(`${this.apiUrl}/schools`, schoolData)
      .pipe(catchError(this.handleError));
  }

  updateSchool(schoolId: number, schoolData: UpdateSchoolRequest): Observable<School> {
    return this.http.put<School>(`${this.apiUrl}/schools/${schoolId}`, schoolData)
      .pipe(catchError(this.handleError));
  }

  deleteSchool(schoolId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/schools/${schoolId}`)
      .pipe(catchError(this.handleError));
  }

  // --- User Management (Principals) ---
  getPrincipals(): Observable<User[]> { // User model should align with UserDTO
    return this.http.get<User[]>(`${this.apiUrl}/admin/principals`) // Endpoint confirmed by user
      .pipe(catchError(this.handleError));
  }

  createPrincipal(principalData: CreatePrincipalRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/principals`, principalData)
      .pipe(catchError(this.handleError));
  }

  // Generic user update - ensure User model fields match updatable fields in UserDTO
  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData)
      .pipe(catchError(this.handleError));
  }

  // Generic user delete
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`)
      .pipe(catchError(this.handleError));
  }

  // --- User Management (Teachers) ---
  getTeachers(): Observable<TeacherListDTO[]> {
    return this.http.get<TeacherListDTO[]>(`${this.apiUrl}/teachers`)
        .pipe(catchError(this.handleError));
  }

  // --- User Management (Students) ---
  getStudents(): Observable<StudentListDTO[]> { // Assuming StudentProfile (aliased) matches StudentDTO for listing
    return this.http.get<StudentListDTO[]>(`${this.apiUrl}/students`) // No classId returns all
      .pipe(catchError(this.handleError));
  }

  updateStudentClass(studentId: number, data: UpdateStudentClassRequest): Observable<StudentListDTO> {
      return this.http.put<StudentListDTO>(`${this.apiUrl}/students/${studentId}`, data)
        .pipe(catchError(this.handleError));
  }


  private handleError(error: any): Observable<never> {
    console.error('An API error occurred in SuperAdminDataService:', error);
    // Customize error handling as needed, e.g., return a user-friendly error message
    return throwError(() => new Error('An error occurred while processing your request. Please try again later.'));
  }
}
