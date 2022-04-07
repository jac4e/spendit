import { Component, OnInit } from '@angular/core';
import { AccountService } from 'client/app/_services';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.sass']
})
export class TransactionsComponent implements OnInit {
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
  }

  refreshTransactions() {
    return this.accountService.getTransactions();
  }
}
