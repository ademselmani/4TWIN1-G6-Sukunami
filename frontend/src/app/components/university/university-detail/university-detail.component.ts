import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { University } from '../../../models/university.model';
import { UniversityService } from '../../../services/university.service';

@Component({
  selector: 'app-university-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './university-detail.component.html',
  styleUrls: ['./university-detail.component.css']
})
export class UniversityDetailComponent implements OnInit {
  university: University | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private universityService: UniversityService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadUniversity(+params['id']);
      }
    });
  }

  loadUniversity(id: number): void {
    this.loading = true;
    this.universityService.getUniversityById(id).subscribe({
      next: (data) => {
        this.university = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading university details';
        console.error(err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/universities']);
  }
} 