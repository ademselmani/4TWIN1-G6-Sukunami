import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { University } from '../../../models/university.model';
import { UniversityService } from '../../../services/university.service';

@Component({
  selector: 'app-university-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './university-list.component.html',
  styleUrls: ['./university-list.component.css']
})
export class UniversityListComponent implements OnInit {
  universities: University[] = [];
  newUniversity: University = { nomUniv: '' };
  editingUniversity: University | null = null;
  loading = false;
  error = '';

  constructor(private universityService: UniversityService) { }

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities(): void {
    this.loading = true;
    this.universityService.getAllUniversities().subscribe({
      next: (data) => {
        this.universities = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading universities';
        console.error(err);
        this.loading = false;
      }
    });
  }

  addUniversity(): void {
    if (!this.newUniversity.nomUniv.trim()) {
      this.error = 'University name is required';
      return;
    }

    this.loading = true;
    this.universityService.addUniversity(this.newUniversity).subscribe({
      next: (data) => {
        this.universities.push(data);
        this.newUniversity = { nomUniv: '' };
        this.loading = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error adding university';
        console.error(err);
        this.loading = false;
      }
    });
  }

  startEdit(university: University): void {
    this.editingUniversity = { ...university };
  }

  cancelEdit(): void {
    this.editingUniversity = null;
  }

  updateUniversity(): void {
    if (!this.editingUniversity) return;
    
    this.loading = true;
    this.universityService.updateUniversity(this.editingUniversity).subscribe({
      next: (data) => {
        const index = this.universities.findIndex(u => u.idUniv === data.idUniv);
        if (index !== -1) {
          this.universities[index] = data;
        }
        this.editingUniversity = null;
        this.loading = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error updating university';
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteUniversity(id: number): void {
    if (confirm('Are you sure you want to delete this university?')) {
      this.loading = true;
      this.universityService.deleteUniversity(id).subscribe({
        next: () => {
          this.universities = this.universities.filter(u => u.idUniv !== id);
          this.loading = false;
          this.error = '';
        },
        error: (err) => {
          this.error = 'Error deleting university';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
} 