import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  isLoading = false;
  errorMessage = '';
  private googleMapsApiKey = 'AIzaSyDPoje0mf_-GQACKolMQepw3PRRG0McqS0';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private universityService: UniversityService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadUniversity(+params['id']);
      }
    });
  }

  loadUniversity(id: number): void {
    this.isLoading = true;
    this.universityService.getUniversityById(id).subscribe({
      next: (data) => {
        this.university = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading university details';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/universities']);
  }
  
  getSafeMapUrl(): SafeResourceUrl {
    if (!this.university || !this.university.location) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    }
    
    const encodedLocation = encodeURIComponent(this.university.location);
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${this.googleMapsApiKey}&q=${encodedLocation}`;
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
  }
} 