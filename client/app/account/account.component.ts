import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services';
import { User } from '../_models';
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
  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.account.subscribe((account) => {
      this.account = account || new User();
    });
    this.url = this.router.url;
  }

  ngOnInit(): void {
    this.url = this.router.url;
  }
}
