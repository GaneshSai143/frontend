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
import { User, UserRole } from '../../core/models/user.model'; // Added UserRole
import { CreatePrincipalRequest } from '../../core/models/principal.model';
import {
    StudentProfile as StudentListDTO, // Alias to clarify it's for listing
    UpdateStudentClassRequest,
    CreateStudentRequest as CreateStudentProfileRequest // Alias to match naming
} from '../../core/models/student.model';
import {
    TeacherProfile as TeacherListDTO,
    CreateTeacherProfileRequest,
    UpdateTeacherProfileRequest
} from '../../core/models/teacher.model';


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

  // --- User Management (Shared & Principals) ---
  getUsersByRole(role: UserRole): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/by-role`, { params: { role: role } })
      .pipe(catchError(this.handleError));
  }

  getPrincipals(): Observable<User[]> {
    return this.getUsersByRole('ADMIN');
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
  getTeachers(): Observable<User[]> { // Now returns User[]
    return this.getUsersByRole('TEACHER');
  }

  // createTeacher, updateTeacherProfile, deleteTeacherProfile remain for managing Teacher *Profile* specific details
  // if different from generic User creation/update.
  // For now, SuperAdmin dashboard will primarily manage teachers as Users.
  // These methods might be used if a separate "Teacher Profile" edit screen is made.
  createTeacherProfile(data: CreateTeacherProfileRequest): Observable<TeacherListDTO> { // Renamed for clarity
    return this.http.post<TeacherListDTO>(`${this.apiUrl}/teachers`, data)
      .pipe(catchError(this.handleError));
  }

  updateTeacherProfileDetails(teacherProfileId: number, data: UpdateTeacherProfileRequest): Observable<TeacherListDTO> { // Renamed
    return this.http.put<TeacherListDTO>(`${this.apiUrl}/teachers/${teacherProfileId}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteTeacherProfileOnly(teacherProfileId: number): Observable<void> { // Renamed
    return this.http.delete<void>(`${this.apiUrl}/teachers/${teacherProfileId}`)
      .pipe(catchError(this.handleError));
  }

  // --- User Management (Students) ---
  getStudents(): Observable<User[]> { // Now returns User[]
    return this.getUsersByRole('STUDENT');
  }

  // updateStudentClass is specific to Student Profile management
  updateStudentClass(studentProfileId: number, data: UpdateStudentClassRequest): Observable<StudentListDTO> { // studentProfileId is likely User ID if API is /api/students/{id}
      return this.http.put<StudentListDTO>(`${this.apiUrl}/students/${studentProfileId}`, data)
        .pipe(catchError(this.handleError));
  }

  // createStudent links an existing user to a student profile and class.
  createStudentProfile(data: CreateStudentProfileRequest): Observable<StudentListDTO> { // Renamed
    return this.http.post<StudentListDTO>(`${this.apiUrl}/students`, data)
      .pipe(catchError(this.handleError));
  }

  // --- Shared User Actions ---
  setUserStatus(userId: number, enable: boolean): Observable<User> {
    const endpoint = enable ? `${this.apiUrl}/users/${userId}/enable` : `${this.apiUrl}/users/${userId}/disable`;
    return this.http.put<User>(endpoint, {}) // PUT request typically with empty body for enable/disable
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An API error occurred in SuperAdminDataService:', error);
    // Customize error handling as needed, e.g., return a user-friendly error message
    return throwError(() => new Error('An error occurred while processing your request. Please try again later.'));
  }
}
