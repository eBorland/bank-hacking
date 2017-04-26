import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { ApiService } from '../../app.api';

interface Transaction {
  source: string;
  account: string;
  amount: number;
  message: string;
}
interface UserInfo {
  email: string;
  fullName: string;
  accountNumber: string;
}
@Component({
  selector: 'wire',
  templateUrl: './wire.component.html',
  styleUrls: ['./wire.component.css']
})
export class WireComponent {
  id: string;
  transaction: Transaction = {
    source: '',
    account: '',
    amount: 0,
    message: ''
  };
  user: UserInfo = {
    email: '',
    fullName: '',
    accountNumber: ''
  }
  constructor (
    private api: ApiService,
    public snackBar: MdSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.id = params['id'];
      this.api.getInfo(this.id).subscribe(
        user => this.user = user,
        error => this.snackBar.open('Your request could not be performed, please try again later!', 'Got it', { duration: 300000 }));
    });
  }

  wire(transaction: Transaction) {
    if (!transaction.account || transaction.amount < 0) {
      return this.snackBar.open('Woah! Are you cheating?', 'I\'m sorry, it won\'t happen again', { duration: 300000 });
    }
    this.api.wireTransaction(transaction).subscribe(
      result => this.router.navigate(['home', this.id, 'global']),
      error => this.snackBar.open('Your request could not be performed, please try again later!', 'Got it', { duration: 300000 }));
  }
}