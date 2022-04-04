import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services';
import { User, Transaction } from '../_models';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent implements OnInit {
  account!: User;
  transactions!: Transaction[];
  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe((account) => {
      this.account = account || new User();
    });
    this.accountService.refreshAccount();
    this.accountService
      .getTransactions()
      .subscribe((transactions: Transaction[]) => {
        this.transactions = transactions;
      });
  }

  ngOnInit(): void {}
}
