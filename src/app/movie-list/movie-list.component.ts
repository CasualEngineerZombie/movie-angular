import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];  // Hold all movie data fetched from the API
  error: string = '';  // Add error handling if something goes wrong

  constructor(private movieService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.movieService.getVideos().subscribe(
      (data: any[]) => {
        this.movies = data;  // Set movies to the API response
      },
      (error) => {
        this.error = 'Failed to fetch movies';  // Handle error
      }
    );
  }

  get username(): string {
    return this.authService.getUsername();
  }

  onLogout(): void {
    // Implement logout functionality here
    this.authService.logout();
  }

}
