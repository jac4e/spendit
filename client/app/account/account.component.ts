import { Component, DoCheck, OnInit } from '@angular/core';
import { AccountService } from '../_services';
import { IAccount } from 'typesit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent implements DoCheck {
  account = {} as IAccount;
  links = [
    { title: 'Overview', route: '/account/overview' },
    { title: 'Settings', route: '/account/settings' },
    { title: 'Transactions', route: '/account/transactions' }
  ];
  url: string;

  // page stuff
  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.account.subscribe((account) => {
      if (account !== null) {
        this.account = account;
      }
    });
    this.url = this.router.url;
  }

  ngDoCheck(): void {
    this.url = this.router.url;
  }
}
