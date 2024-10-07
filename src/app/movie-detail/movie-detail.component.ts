import { Component, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

interface Comment {
  id: number;
  user: string;
  content: string;
  created_at: string;
  video?: number;
}

interface Movie {
  id: number;
  uid: string;
  title: string;
  description: string;
  video_file: string;
  user: string;
  likes: number[];
  comments: Comment[];
  created_at: string;
}

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class MovieDetailComponent implements OnInit, OnChanges {
  movie: Movie | null = null;
  newComment: string = '';
  isLoggedIn: boolean = false;
  safeVideoUrl: SafeUrl | null = null;
  isLoading = signal(false);
  isEditing = signal(false);
  editableTitle = signal('');
  editableDescription = signal('');
  

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getMovieDetails();
  }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.getMovieDetails();
  }

  isMovieOwner(): boolean {
    return this.movie?.user === this.authService.getUsername();
  }

  startEditing(): void {
    if (this.movie) {
      this.editableTitle.set(this.movie.title);
      this.editableDescription.set(this.movie.description);
      this.isEditing.set(true);
    }
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  getMovieDetails(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.movieService.getMovie(movieId).subscribe({
        next: (movie: Movie) => {
          this.movie = {
            ...movie,
            comments: movie.comments || []
          };
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustUrl(movie.video_file);
        },
        error: (error) => {
          console.error('Error fetching movie details:', error);
          this.toastr.error('Error loading movie details');
        }
      });
    }
  }

  addComment(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
  
    if (!this.movie || !this.newComment.trim()) {
      this.toastr.warning('Please enter a comment');
      return;
    }
  
    this.isLoading.set(true);
  
    const comment = {
      text: this.newComment.trim()
    };
  
    this.movieService.addComment(this.movie.id, comment).subscribe({
      next: (newComment: Comment) => {
        if (this.movie) {
          // Add the new comment to the beginning of the comments array
          this.movie = {
            ...this.movie,
            comments: [newComment, ...this.movie.comments]
          };
        }
        this.newComment = ''; // Clear the input
        this.toastr.success('Comment added successfully!');
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.toastr.error(error.message || 'Error adding comment');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  deleteMovie(): void {
    if (!this.movie || !confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      return;
    }

    this.isLoading.set(true);

    this.movieService.deleteMovie(this.movie.id).subscribe({
      next: () => {
        this.toastr.success('Movie deleted successfully!');
        this.router.navigate(['/']);  // Navigate to home page
      },
      error: (error) => {
        console.error('Error deleting movie:', error);
        this.toastr.error(error.message || 'Error deleting movie');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  saveEdits(): void {
    if (!this.movie) return;

    this.isLoading.set(true);
    
    const updates = {
      title: this.editableTitle(),
      description: this.editableDescription()
    };

    this.movieService.updateMovie(this.movie.id, updates).subscribe({
      next: (updatedMovie) => {
        this.movie = updatedMovie;
        this.isEditing.set(false);
        this.toastr.success('Movie updated successfully!');
      },
      error: (error) => {
        console.error('Error updating movie:', error);
        this.toastr.error(error.message || 'Error updating movie');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}