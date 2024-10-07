import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000';
  private username: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register(username: string, password1: string, email: string, password2: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    const body = {
      username,
      email,
      password1,
      password2
    };
    
    return this.http.post(`${this.baseUrl}/api/dj-rest-auth/registration/`, body, { headers });
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    const body = { username, password };
  
    return this.http.post(`${this.baseUrl}/api/dj-rest-auth/login/`, body, { headers })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('access_token', response.key);  // Token will be in 'key'
          this.username = username;
        })
      );
  }
  
  

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');  // The token is now a key
  }
  

  getUsername(): string {
    return this.username;
  }

 

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('access_token');
  }
}
