import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services';
import { User, Transaction } from '../_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent implements OnInit {
  account!: User;
  links = [
    { title: 'Overview', route: '/account/overview' },
    { title: 'Settings', route: '/account/settings' },
    { title: 'Transactions', route: '/account/transactions' }
  ];
  url: string;

  // page stuff
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  transactions!: Transaction[];
  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.account.subscribe((account) => {
      this.account = account || new User();
    });
    this.url = this.router.url;
    if (this.router.url === '/account'){
      this.router.navigate([this.links[0].route]);
    }
  }

  ngOnInit(): void {
    this.url = this.router.url;
    if (this.router.url === '/account'){
      this.router.navigate([this.links[0].route]);
    }
  }
}
