import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UniversityService } from '../../services/university.service';
import { University } from '../../models/university.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-university-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './university-search.component.html',
  styleUrls: ['./university-search.component.css']
})
export class UniversitySearchComponent implements OnInit {
  universities: University[] = [];
  filteredUniversities: University[] = [];
  searchTerm = '';
  showDropdown = false;
  loading = false;
  searchTerms = new Subject<string>();
  searchFields = ['name', 'location', 'description'];
  selectedField = 'name';

  constructor(private universityService: UniversityService) { }

  ngOnInit(): void {
    this.loadUniversities();
    
    // Set up search with debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.filterUniversities();
    });
  }

  loadUniversities(): void {
    this.loading = true;
    this.universityService.getAllUniversities().subscribe({
      next: (data) => {
        this.universities = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading universities:', err);
        this.loading = false;
      }
    });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
  
  filterUniversities(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUniversities = [];
      this.showDropdown = false;
      return;
    }
    
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredUniversities = this.universities.filter(uni => {
      switch(this.selectedField) {
        case 'name':
          return uni.nomUniv?.toLowerCase().includes(term);
        case 'location':
          return uni.location?.toLowerCase().includes(term);
        case 'description':
          return uni.description?.toLowerCase().includes(term);
        default: // all fields
          return (
            uni.nomUniv?.toLowerCase().includes(term) || 
            uni.location?.toLowerCase().includes(term) || 
            uni.description?.toLowerCase().includes(term)
          );
      }
    });
    
    this.showDropdown = this.filteredUniversities.length > 0;
  }
  
  selectField(field: string): void {
    this.selectedField = field;
    this.filterUniversities();
  }
  
  closeDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
} 