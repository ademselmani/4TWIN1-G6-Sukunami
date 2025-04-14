import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { University } from '../models/university.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private apiUrl = `${environment.apiUrl}/universite`;

  constructor(private http: HttpClient) { }

  getAllUniversities(): Observable<University[]> {
    return this.http.get<University[]>(`${this.apiUrl}/retrieve-all-universites`);
  }

  getUniversityById(id: number): Observable<University> {
    return this.http.get<University>(`${this.apiUrl}/retrieve-universite/${id}`);
  }

  addUniversity(university: University): Observable<University> {
    return this.http.post<University>(`${this.apiUrl}/add-universite`, university);
  }

  updateUniversity(university: University): Observable<University> {
    return this.http.put<University>(`${this.apiUrl}/update-universite`, university);
  }

  deleteUniversity(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-universite/${id}`);
  }

  assignUniversityToDepartment(universityId: number, departmentId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/assignUniversiteToDepartement/${universityId}/${departmentId}`, {});
  }
} 