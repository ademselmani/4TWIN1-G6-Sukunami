import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DepartmentDetailComponent implements OnInit {
  departmentId: number = 0;
  department: Department | null = null;
  isLoading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.departmentId = +params['id'];
        this.loadDepartment();
      }
    });
  }

  loadDepartment(): void {
    this.isLoading = true;
    this.error = '';
    
    this.departmentService.getDepartment(this.departmentId).subscribe({
      next: (department) => {
        this.department = department;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load department details: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/departments']);
  }
} 