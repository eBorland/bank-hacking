import { Component } from '@angular/core';
import { ApiService } from '../app.api';

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

  constructor (private api: ApiService) {}

  login(credentials: Credentials) {
    this.api.login(credentials).subscribe(
      user => console.log('heree', user),
      error => this.errorMessage = <any>error);
  }
}