import { Component } from '@angular/core';
import { ApiService } from '../app.api';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  errorMessage: string;
  user = {
    _id: '',
    email: '',
    question: '',
    answer: '',
    newPassword: ''
  };

  constructor (
    private api: ApiService,
    private router: Router,
    public snackBar: MdSnackBar
  ) {}

  next(user) {
    if (user._id && user.answer && user.newPassword) {
      this.api.reset(user).subscribe(
        user => this.router.navigate(['/login']),
        error => this.snackBar.open('Reset failed! Something was wrong', 'Got it', { duration: 300000 }));
    } else if (user.email) {
      this.api.recover(user.email).subscribe(
        user => this.user = user,
        error => this.snackBar.open('Request failed! Are u sure that email exists?', 'Got it', { duration: 300000 }));
    } else {
      this.snackBar.open('You have to fill all fields', 'Got it', { duration: 300000 });
    }
  }
}
