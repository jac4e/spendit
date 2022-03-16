import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { AccountsComponent } from './accounts/accounts.component';
import { InventoryComponent } from './inventory/inventory.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'accounts', component: AccountsComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'transactions', component: TransactionsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
