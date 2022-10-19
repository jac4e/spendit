import { Component, Input, OnInit } from '@angular/core';
import { IAccount } from 'typeit';
import { AccountService } from 'client/app/_services';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent implements OnInit {
  account = {} as IAccount;

  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe((account) => {
      if (account !== null) {
        this.account = account;
      }
    });
    this.accountService.refreshAccount();
  }

  ngOnInit(): void {
  }

}
