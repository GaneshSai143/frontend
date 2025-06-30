import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AdminDashboardData {
  // Define based on expected response from GET /api/v1/dashboard/admin
  // Example:
  classReports?: any[];
  attendanceSummaries?: any[];
  teacherActivities?: any[];
  // Add more specific types as API details become clear
  [key: string]: any; // Allow other properties
}

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAdminDashboardData(): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>(`${this.apiUrl}/dashboard/admin`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An API error occurred in AdminDataService:', error);
    return throwError(() => new Error('Failed to load Admin dashboard data; please try again later.'));
  }
}
