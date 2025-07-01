import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TaskSummary, PerformanceItem } from '../models/student.model'; // Import from central models

// Aligned with StudentDashboardDTO from Swagger
export interface StudentDashboardData {
  pendingTasksCount: number;
  recentPendingTasks: TaskSummary[];
  performanceSummary: PerformanceItem[];
  // Allow other properties if any, though Swagger DTO is specific
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class StudentDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getStudentDashboardData(): Observable<StudentDashboardData> {
    // Endpoint from Swagger: /api/dashboard/student/summary
    // Assuming this.apiUrl is http://localhost:8080/api/v1
    // So, the path should be dashboard/student/summary relative to apiUrl
    // Or if apiUrl already includes /api/v1, then just 'dashboard/student/summary'
    // The problem description used GET /api/v1/dashboard/student, but Swagger has /api/dashboard/student/summary
    // I will use the one from Swagger JSON: /api/dashboard/student/summary
    // If environment.apiUrl = "http://localhost:8080/api/v1", then path is "dashboard/student/summary"
    // If environment.apiUrl = "http://localhost:8080", then path is "api/v1/dashboard/student/summary"
    // Given previous usage like `${this.apiUrl}/schools`, I assume apiUrl = "http://localhost:8080/api/v1"
    return this.http.get<StudentDashboardData>(`${this.apiUrl}/dashboard/student/summary`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An API error occurred in StudentDataService:', error);
    return throwError(() => new Error('Failed to load Student dashboard data; please try again later.'));
  }
}
