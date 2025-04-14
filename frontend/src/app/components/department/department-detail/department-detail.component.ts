import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Department } from '../../../models/department.model';
import { DepartmentService } from '../../../services/department.service';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css']
})
export class DepartmentDetailComponent implements OnInit {
  department: Department | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadDepartment(+id);
      } else {
        this.error = 'Department ID is missing';
      }
    });
  }

  loadDepartment(id: number): void {
    this.isLoading = true;
    this.error = null;
    
    this.departmentService.getDepartmentById(id).subscribe({
      next: (data) => {
        this.department = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load department: ' + err;
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/departments']);
  }
} 