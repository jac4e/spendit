import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'client/app/_models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.sass']
})
export class TransactionsListComponent {
  transactions!: Transaction[];
  page = 1;
  pageSize = 10;
  collectionSize!: number;
  @Input() getTransactions!: Observable<Transaction[]>;

  constructor() {}

  ngOnInit(): void {
    this.refreshTransactions();
  }

  refreshTransactions() {
    this.getTransactions.subscribe((transactions: Transaction[]) => {
      this.transactions = transactions;
      this.collectionSize = transactions.length;
      this.transactions = transactions.slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
    });
  }
}
