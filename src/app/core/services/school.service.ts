import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { School } from '../models/school.model';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private apiUrl = `${environment.apiUrl}/schools`;

  constructor(private http: HttpClient) {}

  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.apiUrl);
  }

  getSchoolById(id: number): Observable<School> {
    return this.http.get<School>(`${this.apiUrl}/${id}`);
  }

  createSchool(school: School): Observable<School> {
    return this.http.post<School>(this.apiUrl, school);
  }

  updateSchool(id: number, school: School): Observable<School> {
    return this.http.put<School>(`${this.apiUrl}/${id}`, school);
  }

  deleteSchool(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 