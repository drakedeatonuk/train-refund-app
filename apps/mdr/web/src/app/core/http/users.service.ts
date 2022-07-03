import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwToken } from '@multi/mdr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient, private router: Router) {}

  async login(email: string, password: string): Promise<void> {
    this.http.post<JwToken>('/api/login', { email, password }).subscribe({
      next: res => {
        if (!res?.access_token) return;
        localStorage.setItem('jwtoken', res.access_token);
        this.router.navigateByUrl('/dashboard');
      },
      error: err => console.log(err),
    });
  }

  async register(email: string, password: string) {
    return this.http.post<JwToken>('/api/register', { email, password }).subscribe({
      next: res => {
        if (!res?.access_token) return;
        localStorage.setItem('jwtoken', res.access_token);
        this.router.navigateByUrl('/dashboard');
      },
      error: err => console.log(err),
    });
  }

  logout() {
    localStorage.removeItem('jwtoken');
  }

  getUserInfo() {
    this.http.get('/api').subscribe(res => console.log(res));
  }
}
