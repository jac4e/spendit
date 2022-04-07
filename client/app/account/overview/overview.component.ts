import { Component, Input, OnInit } from '@angular/core';
import { User } from 'client/app/_models';
import { AccountService } from 'client/app/_services';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent implements OnInit {

  account!: User;

  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe((account) => {
      this.account = account || new User();
    });
    this.accountService.refreshAccount();
  }

  ngOnInit(): void {
  }

}
