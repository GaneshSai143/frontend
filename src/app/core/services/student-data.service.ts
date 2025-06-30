import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface StudentDashboardData {
  // Define based on expected response from GET /api/v1/dashboard/student
  // Example:
  assignedTasks?: any[];
  notifications?: any[];
  attendance?: any; // Or a more specific type
  [key: string]: any; // Allow other properties
}

@Injectable({
  providedIn: 'root'
})
export class StudentDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // getStudentDashboardData(): Observable<StudentDashboardData> {
  //   return this.http.get<StudentDashboardData>(`${this.apiUrl}/dashboard/student`)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  private handleError(error: any): Observable<never> {
    console.error('An API error occurred in StudentDataService:', error);
    return throwError(() => new Error('Failed to load Student dashboard data; please try again later.'));
  }
}
