import { Component } from '@angular/core';
import { ApiService } from '../app.api';
import { Router } from '@angular/router';

interface Credentials {
  email: string;
  password: string;
}
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ApiService]
})
export class LoginComponent {
  errorMessage: string;
  user: Credentials = {
    email: '',
    password: ''
  };

  constructor (
    private api: ApiService,
    private router: Router
  ) {}

  login(credentials: Credentials) {
    this.api.login(credentials).subscribe(
      user => this.router.navigate(['/home']),
      error => this.errorMessage = <any>error);
  }
}