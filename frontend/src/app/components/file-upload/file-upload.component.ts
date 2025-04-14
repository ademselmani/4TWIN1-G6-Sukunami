import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error' = 'idle';
  errorMessage: string = '';
  
  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    this.uploadStatus = 'uploading';
    this.uploadProgress = 0;
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8089/kaddem/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      finalize(() => {
        this.selectedFile = null;
      })
    ).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadStatus = 'success';
          setTimeout(() => {
            this.uploadStatus = 'idle';
            this.uploadProgress = 0;
          }, 3000);
        }
      },
      error: (err) => {
        this.uploadStatus = 'error';
        this.errorMessage = err.message || 'An error occurred during upload';
        setTimeout(() => {
          this.uploadStatus = 'idle';
          this.uploadProgress = 0;
          this.errorMessage = '';
        }, 3000);
      }
    });
  }
} 