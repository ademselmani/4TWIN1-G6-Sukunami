import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Department } from '../models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8089/kaddem/departement';
  private apiUrlUniv = 'http://localhost:8089/kaddem/universite';

  constructor(private http: HttpClient) { }

  // Get all departments
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/retrieve-all-departements`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get department by ID
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/retrieve-departement/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add new department
  addDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/add-departement`, department)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update department
  updateDepartment(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/update-departement`, department)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete department
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-departement/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Assign department to university
  assignDepartmentToUniversity(idDepartement: number, idUniversite: number): Observable<Department> {
    return this.http.put<Department>(
      `${this.apiUrlUniv}/assignDepartementToUniversite/${idDepartement}/${idUniversite}`, 
      {}
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get departments by university
  getDepartmentsByUniversity(idUniversite: number): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrlUniv}/retrieveDepartementsByUniversite/${idUniversite}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error.message || 'Server error');
  }
} 