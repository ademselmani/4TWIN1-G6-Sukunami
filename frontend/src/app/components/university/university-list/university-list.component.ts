import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { University } from '../../../models/university.model';
import { UniversityService } from '../../../services/university.service';

declare var bootstrap: any;

@Component({
  selector: 'app-university-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './university-list.component.html',
  styleUrls: ['./university-list.component.css']
})
export class UniversityListComponent implements OnInit, AfterViewInit {
  universities: University[] = [];
  newUniversity: University = { 
    nomUniv: '',
    imagePath: undefined,
    description: undefined,
    location: undefined
  };
  editingUniversity: University | null = null;
  loading = false;
  error = '';
  addModal: any;
  editModal: any;

  constructor(private universityService: UniversityService) { }

  ngOnInit(): void {
    this.loadUniversities();
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap modals
    this.addModal = new bootstrap.Modal(document.getElementById('addUniversityModal'));
    if (document.getElementById('editUniversityModal')) {
      this.editModal = new bootstrap.Modal(document.getElementById('editUniversityModal'));
    }
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
        // Reset form
        this.newUniversity = { 
          nomUniv: '',
          imagePath: undefined,
          description: undefined,
          location: undefined
        };
        this.loading = false;
        this.error = '';
        // Close the modal
        this.addModal.hide();
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
    // Need to initialize the modal after the element is created in the DOM
    setTimeout(() => {
      this.editModal = new bootstrap.Modal(document.getElementById('editUniversityModal'));
      this.editModal.show();
    });
  }

  cancelEdit(): void {
    if (this.editModal) {
      this.editModal.hide();
    }
    this.editingUniversity = null;
  }

  saveEdit(): void {
    if (this.editingUniversity) {
      this.loading = true;
      this.universityService.updateUniversity(this.editingUniversity).subscribe({
        next: (data) => {
          const index = this.universities.findIndex(u => u.idUniv === this.editingUniversity!.idUniv);
          if (index !== -1) {
            this.universities[index] = data;
          }
          this.loading = false;
          this.error = '';
          this.cancelEdit();
        },
        error: (err) => {
          this.error = 'Error updating university';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  deleteUniversity(id: number | undefined): void {
    if (!id) {
      this.error = 'Cannot delete: Invalid university ID';
      return;
    }
    
    if (confirm('Are you sure you want to delete this university?')) {
      this.loading = true;
      this.universityService.deleteUniversity(id).subscribe({
        next: () => {
          this.universities = this.universities.filter(u => u.idUniv !== id);
          this.loading = false;
        },
        error: (err) => {
          this.error = `Failed to delete university: ${err.message}`;
          this.loading = false;
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }
}
