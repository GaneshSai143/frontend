import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private authenticationChangedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authenticationChanged = this.authenticationChangedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('jwt_token', response.token);
          }
        }),
        switchMap(() => this.getUserProfile()),
        tap(user => {
          localStorage.setItem('current_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.authenticationChangedSubject.next(true); // Emit true on successful login
        })
      );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.authenticationChangedSubject.next(false); // Emit false on logout
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateCurrentUserProfile(userData: Partial<User>): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.currentUserSubject.next(updatedUser);
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      // Simulate backend update success by immediately updating local state
      // In a real app, this would involve an HTTP PUT/PATCH request
      // and then updating the subject upon successful response.

      // If SuperAdminDataService is the source of truth for users in this demo:
      // this.superAdminDataService.updateUser(updatedUser).subscribe();
      // This would require injecting SuperAdminDataService which might create a circular dependency
      // or require a more centralized state management. For now, local update is sufficient for demo.
      console.log('Simulated user profile update:', updatedUser);
    }
  }

  private parseJwt(token: string): User {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${environment.apiUrl}/profile`, { headers });
  }

  getUserProfile(): Observable<User> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User>(`${environment.apiUrl}/users/me`, { headers });
  }
} 