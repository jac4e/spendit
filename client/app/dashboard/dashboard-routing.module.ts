import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { AccountsComponent } from './accounts/accounts.component';
import { InventoryComponent } from './inventory/inventory.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RefillsComponent } from './refills/refills.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'accounts'},
      { path: 'accounts', component: AccountsComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'refills', component: RefillsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
