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
  selectedDepartmentId: number | undefined;
  selectedUniversityId: number | undefined;
  isLoading = false;
  error = '';
  editingDepartment: Department | null = null;

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
    this.error = '';
    
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load departments: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  loadUniversities(): void {
    this.universityService.getAllUniversities().subscribe({
      next: (universities: University[]) => {
        this.universities = universities;
      },
      error: (err: any) => {
        this.error = 'Failed to load universities: ' + err.message;
      }
    });
  }

  addDepartment(): void {
    if (!this.newDepartment.nomDepart.trim()) {
      this.error = 'Department name is required';
      return;
    }

    this.isLoading = true;
    this.error = '';
    
    this.departmentService.createDepartment(this.newDepartment).subscribe({
      next: (department) => {
        this.departments.push(department);
        this.newDepartment = { nomDepart: '' };
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to add department: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  startEdit(department: Department): void {
    this.editingDepartment = { ...department };
  }

  cancelEdit(): void {
    this.editingDepartment = null;
  }

  saveDepartment(): void {
    if (!this.editingDepartment || !this.editingDepartment.idDepart) return;
    
    this.isLoading = true;
    this.error = '';
    
    this.departmentService.updateDepartment(
      this.editingDepartment.idDepart, 
      this.editingDepartment
    ).subscribe({
      next: (updatedDepartment) => {
        const index = this.departments.findIndex(d => d.idDepart === updatedDepartment.idDepart);
        if (index !== -1) {
          this.departments[index] = updatedDepartment;
        }
        this.editingDepartment = null;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to update department: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.isLoading = true;
      this.error = '';
      
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.departments = this.departments.filter(d => d.idDepart !== id);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to delete department: ' + err.message;
          this.isLoading = false;
        }
      });
    }
  }

  assignToUniversity(): void {
    if (!this.selectedDepartmentId || !this.selectedUniversityId) {
      this.error = 'Please select both department and university';
      return;
    }

    this.isLoading = true;
    this.error = '';
    
    this.departmentService.assignDepartmentToUniversity(
      this.selectedDepartmentId, 
      this.selectedUniversityId
    ).subscribe({
      next: (updatedDepartment) => {
        // Update the department in the list
        const index = this.departments.findIndex(d => d.idDepart === updatedDepartment.idDepart);
        if (index !== -1) {
          this.departments[index] = updatedDepartment;
        }
        // Reset selections
        this.selectedDepartmentId = undefined;
        this.selectedUniversityId = undefined;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to assign department to university: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  viewDetails(departmentId: number): void {
    this.router.navigate(['/departments', departmentId]);
  }

  clearError(): void {
    this.error = '';
  }
} 