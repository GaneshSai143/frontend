import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface TeacherDashboardData {
  // Define based on expected response from GET /api/v1/dashboard/teacher
  // Example:
  assignedClasses?: any[];
  tasks?: any[];
  studentProgressSummaries?: any[];
  [key: string]: any; // Allow other properties
}

@Injectable({
  providedIn: 'root'
})
export class TeacherDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTeacherDashboardData(): Observable<TeacherDashboardData> {
    return this.http.get<TeacherDashboardData>(`${this.apiUrl}/dashboard/teacher`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An API error occurred in TeacherDataService:', error);
    return throwError(() => new Error('Failed to load Teacher dashboard data; please try again later.'));
  }
}
