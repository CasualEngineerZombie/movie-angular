import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';  // Updated baseUrl to match the endpoint
  commentAdded = new Subject();

  constructor(private http: HttpClient) {}

  // Fetch all videos (movies)
  getVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/videos/`);
  }

  // Fetch video details by uid
  getVideoDetail(uid: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/videos/${uid}/`);
  }

  // Upload a new video
  uploadVideo(videoData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/videos/`, videoData);
  }

  // Like a video
  likeVideo(uid: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/videos/${uid}/like/`, {});
  }

  // Add a comment to a video
  addComment(videoId: number, comment: string): Observable<any> {
    const newComment = { video: videoId, content: comment };
    this.commentAdded.next(newComment);
    return this.http.post(`${this.baseUrl}/comments/`, newComment);
  }
}
