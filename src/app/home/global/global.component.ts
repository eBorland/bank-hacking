import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';
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
  styleUrls: ['./global.component.css']
})
export class GlobalComponent {
  id: string;
  transactions: Transaction[];
  positive: number = 0;
  negative: number = 0;
  total: number = 0;

  constructor (
    private api: ApiService,
    public snackBar: MdSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.id = params['id'];
      this.loadTransactions();
    });
  }

  public loadTransactions() {
    this.api.getTransactions(this.id).subscribe(
      this.computeTransactions.bind(this),
      error => this.snackBar.open('Your request could not be performed, please try again later!', 'Got it', { duration: 300000 }));
  }

  computeTransactions(response) {
    this.positive = 0;
    this.negative= 0;
    this.total = 0;
    this.transactions = response.transactions;
    this.transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        this.positive += transaction.amount;
      } else {
        this.negative -= transaction.amount;
      }
      this.total += transaction.amount;
    });
  }
}