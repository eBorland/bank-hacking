import { Component } from '@angular/core';
import { ApiService } from '../../app.api';

interface Transaction {
  amount: number;
  source: string;
  date: Date;
  message?: string;
}

@Component({
  selector: 'global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.css'],
  providers: [ApiService]
})
export class GlobalComponent {
  transactions: Transaction[] = [{
    amount: -5000,
    source: 'Ethical Hacking tickets',
    date: new Date('5/27/2017'),
    message: ' '
  }, {
    amount: 20000,
    source: 'Eric Borland',
    date: new Date('5/26/2017')
  }]
  constructor (private api: ApiService) {}
}