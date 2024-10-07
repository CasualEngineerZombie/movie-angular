import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface CommentResponse {
  id: number;
  user: string;
  content: string;
  created_at: string;
  video: number;
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'http://localhost:8000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Token ${token}`
    });
  }

  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/videos/`);
  }

  getMovie(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/videos/${id}/`);
  }

  getVideoUrl(movie: any): string {
    return `${this.apiUrl}/media/videos/${movie.video_file}`;
  }

  addComment(movieId: number, comment: { text: string }): Observable<CommentResponse> {
    const headers = this.getHeaders();
  
    const body = {
      video: movieId,
      content: comment.text
    };
  
    return this.http.post<CommentResponse>(
      `${this.apiUrl}/api/comments/`,
      body,
      { headers }
    );
  }


  likeMovie(movieId: string): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post<any>(
      `${this.apiUrl}/api/videos/${movieId}/like/`,
      {},
      { headers }
    );
  }

  uploadMovie(formData: FormData): Observable<HttpEvent<any>> {
    const headers = this.getHeaders();
    
    return this.http.post(`${this.apiUrl}/api/videos/`, formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    });
  }

  // Add this new method
  updateMovie(movieId: number, updateData: {title?: string; description?: string}): Observable<any> {
    const headers = this.getHeaders();
    
    return this.http.patch(
      `${this.apiUrl}/api/videos/${movieId}/`,
      updateData,
      { headers }
    );
  }

  // Update the delete method to use consistent URL and headers
  deleteMovie(movieId: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http.delete<any>(
      `${this.apiUrl}/api/videos/${movieId}/`,
      { headers }
    );
  }
}