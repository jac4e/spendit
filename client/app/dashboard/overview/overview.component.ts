import { Component } from '@angular/core';
import { AdminService, StoreService } from 'client/app/_services';
import { IAccountStats, IFinanceStats, IInventoryStats, IRefillStats, IStoreStats, ITaskLean, ITransactionStats, StatsDateRange } from 'typesit';

interface Rank {
  place: number;
  name: string;
  amount: number;
};

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent {
  storeStats: IStoreStats | null = null;
  transactionStats: ITransactionStats | null = null;
  accountStats: IAccountStats | null = null;
  financeStats: IFinanceStats | null = null;
  inventoryStats: IInventoryStats | null = null;
  refillStats: IRefillStats | null = null;
  tasks: ITaskLean[] = [];
  dateOption: StatsDateRange = 'all' as StatsDateRange;
  // dateOption: string = 'all';

  constructor(
    private adminService: AdminService,
    private storeService: StoreService,
  ) {
    this.adminService.getTransactionStats().subscribe((stats) => {
      this.transactionStats = stats;
    });
    this.adminService.getAccountStats().subscribe((stats) => {
      this.accountStats = stats;
    });
    this.adminService.getFinanceStats(this.dateOption).subscribe((stats) => {
      this.financeStats = stats;
    });
    this.adminService.getInventoryStats().subscribe((stats) => {
      this.inventoryStats = stats;
    });
    this.adminService.getRefillStats().subscribe((stats) => {
      this.refillStats = stats;
    });
    this.adminService.getStoreStats().subscribe((stats) => {
      this.storeStats = stats;
    });
    this.adminService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });

  }

  onDateOptionChange(dateOption: string) {
    this.dateOption = dateOption as StatsDateRange;
    this.adminService.getFinanceStats(this.dateOption).subscribe((stats) => {
      this.financeStats = stats;
    });
  }
}
