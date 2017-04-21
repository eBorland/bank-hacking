import { Component } from '@angular/core';
import { ApiService } from '../../app.api';

interface Transaction {
  fullName: string;
  account: string;
  amount: string;
  message: string;
}
@Component({
  selector: 'wire',
  templateUrl: './wire.component.html',
  styleUrls: ['./wire.component.css'],
  providers: [ApiService]
})
export class WireComponent {
  transaction: Transaction = {
    fullName: '',
    account: '',
    amount: '',
    message: ''
  };
  constructor (private api: ApiService) {}
}