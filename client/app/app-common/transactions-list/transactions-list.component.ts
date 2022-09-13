import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'client/app/_models';
import { Observable } from 'rxjs';
import { CommonService } from 'client/app/_services';

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

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.refreshTransactions();
  }
  export() {
    this.getTransactions.subscribe((transactions: Transaction[]) => {
      const data: any = transactions.map((el: any) => {
        el.date = new Date(el.date).toISOString();
        return el;
      });
      this.commonService.export(
        data,
        `transactions_${this.commonService.localeISOTime()}.csv`
      );
    });
  }

  refreshTransactions() {
    this.getTransactions.subscribe((transactions: Transaction[]) => {
      this.transactions = transactions.map((data) => {
        data.date = new Date(data.date);
        return data;
      });
      // console.log(this.transactions[0].date.toLocaleString());
      this.collectionSize = transactions.length;
      this.transactions = transactions.slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
    });
  }
}
