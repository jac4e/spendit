import { Component, OnInit } from '@angular/core';
import { ListControl, ListControlType } from 'client/app/_models';
import { AccountService } from 'client/app/_services';
import { ITransaction } from 'typesit';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.sass']
})
export class TransactionsComponent implements OnInit {
  listControl: ListControl[] = [
    {
      name: 'View',
      type: ListControlType.View,
      shouldDisplay: (data: ITransaction) => {
        return true;
      }
    }
  ];
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
  }

  refreshTransactions() {
    return this.accountService.getTransactions();
  }
}
