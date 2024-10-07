import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { ToastrService } from 'ngx-toastr';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.css'
})
export class VideoUploadComponent {
  title = signal('');
  description = signal('');
  selectedFile: File | null = null;
  isUploading = signal(false);
  uploadProgress = signal(0);
  previewUrl: string | null = null;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Create preview URL for video
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  uploadVideo(): void {
    if (!this.selectedFile) {
      this.toastr.warning('Please select a video file');
      return;
    }

    if (!this.title()) {
      this.toastr.warning('Please enter a title');
      return;
    }

    this.isUploading.set(true);
    const formData = new FormData();
    formData.append('video_file', this.selectedFile);
    formData.append('title', this.title());
    formData.append('description', this.description());

    this.movieService.uploadMovie(formData).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event.total
            ? Math.round(100 * event.loaded / event.total)
            : 0;
          this.uploadProgress.set(progress);
        } else if (event instanceof HttpResponse) {
          this.toastr.success('Video uploaded successfully!');
          this.router.navigate(['/videos', event.body.id]);
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.toastr.error(error.message || 'Failed to upload video');
        this.isUploading.set(false);
      },
      complete: () => {
        this.isUploading.set(false);
        this.uploadProgress.set(0);
      }
    });
  }

  ngOnDestroy() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }
}
