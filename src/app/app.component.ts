import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  
import { MovieListComponent } from './movie-list/movie-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MovieListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { 
}
