import { Component } from '@angular/core';
import { ApiService } from '../app.api';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

interface Credentials {
  email: string;
  password: string;
}
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string;
  user: Credentials = {
    email: '',
    password: ''
  };

  constructor (
    private api: ApiService,
    private router: Router,
    public snackBar: MdSnackBar
  ) {}

  login(credentials: Credentials) {
    this.api.login(credentials).subscribe(
      user => this.router.navigate(['/home', user._id]),
      error => this.snackBar.open('Login failed! Review your credentials and try again', 'Got it', { duration: 300000 }));
  }
}