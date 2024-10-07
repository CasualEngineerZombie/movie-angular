import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule],  // Add HttpClientModule here
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.authService.register(this.username, this.password, this.email, this.confirmPassword).subscribe(
      (response: any) => {
        // Save the token and redirect
        localStorage.setItem('access_token', response.access_token || response.access || ''); // Ensure correct token name
        this.router.navigate(['/']);
        this.toastr.success('Registration successful');
      },
      (error) => {
        // Handle error response, possibly show error message from backend
        if (error.error && error.error.detail) {
          this.error = error.error.detail;  // Backend error message
        } else {
          this.error = 'Registration failed';  // Generic message if no specific backend message
        }
      }
    );
  }
}
