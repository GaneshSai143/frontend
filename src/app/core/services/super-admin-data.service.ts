import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, delay } from 'rxjs/operators';

// Define interfaces for the data structures
// These might already exist in core/models, adjust if so.
export interface School {
  id: string;
  name: string;
  principalId: string; // Assuming User ID
  address: string;
  email: string;
  phone: string;
  establishedDate: string; // Consider Date object if more manipulation is needed
  studentCount: number;
  teacherCount: number;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';
  isActive: boolean;
  schoolId?: string | null; // Optional, as SUPER_ADMIN might not have one
  grade?: string; // Optional, only for students
  // Add other fields as necessary, e.g., passwordHash (though not for frontend display)
}


@Injectable({
  providedIn: 'root'
})
export class SuperAdminDataService {
  private schoolsUrl = 'assets/data/schools.json';
  private usersUrl = 'assets/data/users.json';

  private schoolsSubject = new BehaviorSubject<School[]>([]);
  schools$: Observable<School[]> = this.schoolsSubject.asObservable();

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initial load of data
    this.loadInitialSchools().subscribe();
    this.loadInitialUsers().subscribe();
  }

  // --- Initial Data Loading ---
  private loadInitialSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.schoolsUrl).pipe(
      tap(schools => this.schoolsSubject.next(schools)),
      catchError(this.handleError)
    );
  }

  private loadInitialUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      tap(users => this.usersSubject.next(users)),
      catchError(this.handleError)
    );
  }

  // --- School Management ---
  getSchools(): Observable<School[]> {
    // Return the observable from the subject to get live updates
    return this.schools$;
  }

  addSchool(school: Omit<School, 'id' | 'studentCount' | 'teacherCount'>): Observable<School> {
    const currentSchools = this.schoolsSubject.value;
    const newSchool: School = {
      ...school,
      id: `sch${new Date().getTime()}`, // Simple unique ID generation
      studentCount: 0, // Default
      teacherCount: 0  // Default
    };
    this.schoolsSubject.next([...currentSchools, newSchool]);
    // In a real app, this would be an HTTP POST request
    return of(newSchool).pipe(delay(500)); // Simulate network delay
  }

  updateSchool(updatedSchool: School): Observable<School> {
    const currentSchools = this.schoolsSubject.value;
    const index = currentSchools.findIndex(s => s.id === updatedSchool.id);
    if (index !== -1) {
      const schools = [...currentSchools];
      schools[index] = updatedSchool;
      this.schoolsSubject.next(schools);
      return of(updatedSchool).pipe(delay(500));
    }
    return throwError(() => new Error('School not found'));
  }

  deleteSchool(schoolId: string): Observable<{}> {
    const currentSchools = this.schoolsSubject.value;
    const filteredSchools = currentSchools.filter(s => s.id !== schoolId);
    this.schoolsSubject.next(filteredSchools);
    // Also remove users (principals, teachers, students) associated with this school
    const currentUsers = this.usersSubject.value;
    const updatedUsers = currentUsers.map(user =>
      user.schoolId === schoolId ? { ...user, schoolId: null, isActive: false } : user
    ); // Or filter them out if they should be deleted entirely
    this.usersSubject.next(updatedUsers);
    return of({}).pipe(delay(500));
  }

  // --- User Management (Principals, Teachers, Students) ---
  getUsers(role?: User['role']): Observable<User[]> {
    return this.users$.pipe(
      map(users => role ? users.filter(u => u.role === role) : users)
    );
  }

  getPrincipals(): Observable<User[]> {
    return this.getUsers('ADMIN');
  }

  getTeachers(): Observable<User[]> {
    return this.getUsers('TEACHER');
  }

  getStudents(): Observable<User[]> {
    return this.getUsers('STUDENT');
  }

  getUserById(userId: string): Observable<User | undefined> {
    return this.users$.pipe(
        map(users => users.find(u => u.id === userId))
    );
  }


  addUser(user: Omit<User, 'id'>): Observable<User> {
    const currentUsers = this.usersSubject.value;
    const newUser: User = {
      ...user,
      id: `usr${new Date().getTime()}` // Simple unique ID generation
    };
    this.usersSubject.next([...currentUsers, newUser]);
    return of(newUser).pipe(delay(500));
  }

  updateUser(updatedUser: User): Observable<User> {
    const currentUsers = this.usersSubject.value;
    const index = currentUsers.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      const users = [...currentUsers];
      users[index] = updatedUser;
      this.usersSubject.next(users);
      return of(updatedUser).pipe(delay(500));
    }
    return throwError(() => new Error('User not found'));
  }

  deleteUser(userId: string): Observable<{}> {
    const currentUsers = this.usersSubject.value;
    const filteredUsers = currentUsers.filter(u => u.id !== userId);
    // If deleting a principal, ensure their school's principalId is cleared/updated
    const userToDelete = currentUsers.find(u => u.id === userId);
    if (userToDelete && userToDelete.role === 'ADMIN' && userToDelete.schoolId) {
        const currentSchools = this.schoolsSubject.value;
        const schoolIndex = currentSchools.findIndex(s => s.principalId === userId);
        if (schoolIndex !== -1) {
            const schools = [...currentSchools];
            schools[schoolIndex] = { ...schools[schoolIndex], principalId: '' }; // Or some placeholder
            this.schoolsSubject.next(schools);
        }
    }
    this.usersSubject.next(filteredUsers);
    return of({}).pipe(delay(500));
  }

  // --- Helper for error handling ---
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  // Utility to generate unique IDs (simple version)
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
