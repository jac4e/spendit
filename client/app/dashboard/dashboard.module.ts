import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppCommonModule } from '../app-common/app-common.module';
import { AccountsComponent } from './accounts/accounts.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { InventoryComponent } from './inventory/inventory.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RefillsComponent } from './refills/refills.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    NgbModule,
    AppCommonModule
  ],
  declarations: [
    DashboardComponent,
    AccountsComponent,
    InventoryComponent,
    TransactionsComponent,
    RefillsComponent,
    OverviewComponent
  ]
})
export class DashboardModule {}
