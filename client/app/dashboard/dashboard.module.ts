import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountsComponent } from './accounts/accounts.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { InventoryComponent } from './inventory/inventory.component';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent,
    AccountsComponent,
    InventoryComponent,
    TransactionsComponent
  ]
})
export class DashboardModule {}
