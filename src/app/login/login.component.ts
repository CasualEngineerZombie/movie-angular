import { Component } from '@angular/core'; 
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrected from styleUrl to styleUrls
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/']); // Navigate to movie list on successful login
        
        if (response.access) {
          localStorage.setItem('access_token', response.access); // Save token to local storage
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password'; // Show error message
        console.error(err); // Log error for debugging
        
      }
    });
  }
}
