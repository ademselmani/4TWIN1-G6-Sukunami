import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Department } from '../../../models/department.model';
import { University } from '../../../models/university.model';
import { DepartmentService } from '../../../services/department.service';
import { UniversityService } from '../../../services/university.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  universities: University[] = [];
  newDepartment: Department = { nomDepart: '' };
  selectedDepartment: Department | null = null;
  selectedDepartmentId: number | null = null;
  selectedUniversityId: number | null = null;
  isLoading = false;
  isEditing = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private departmentService: DepartmentService,
    private universityService: UniversityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadUniversities();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.error = null;
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load departments: ' + err;
        this.isLoading = false;
      }
    });
  }

  loadUniversities(): void {
    this.isLoading = true;
    this.error = null;
    this.universityService.getAllUniversities().subscribe({
      next: (data) => {
        this.universities = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load universities: ' + err;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.error = null;
    
    if (this.isEditing && this.selectedDepartment) {
      const updatedDepartment: Department = {
        ...this.selectedDepartment,
        nomDepart: this.selectedDepartment.nomDepart
      };
      
      this.departmentService.updateDepartment(updatedDepartment).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Department updated successfully';
          this.resetForm();
          this.loadDepartments();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = 'Failed to update department: ' + err;
          this.isLoading = false;
        }
      });
    } else {
      this.departmentService.addDepartment(this.newDepartment).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Department added successfully';
          this.resetForm();
          this.loadDepartments();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = 'Failed to add department: ' + err;
          this.isLoading = false;
        }
      });
    }
  }

  assignDepartmentToUniversity(): void {
    if (!this.selectedDepartmentId || !this.selectedUniversityId) {
      this.error = 'Please select both a department and a university';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.departmentService.assignDepartmentToUniversity(
      this.selectedDepartmentId, 
      this.selectedUniversityId
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Department assigned to university successfully';
        this.selectedDepartmentId = null;
        this.selectedUniversityId = null;
        this.loadDepartments();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.error = 'Failed to assign department to university: ' + err;
        this.isLoading = false;
      }
    });
  }

  editDepartment(department: Department): void {
    this.isEditing = true;
    this.selectedDepartment = { ...department };
  }

  viewDepartment(id: number): void {
    this.router.navigate(['/departments', id]);
  }

  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.isLoading = true;
      this.error = null;
      
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Department deleted successfully';
          this.loadDepartments();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (err) => {
          this.error = 'Failed to delete department: ' + err;
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.newDepartment = { nomDepart: '' };
    this.selectedDepartment = null;
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  clearError(): void {
    this.error = null;
  }
} 