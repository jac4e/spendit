import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { AccountsComponent } from './accounts/accounts.component';
import { InventoryComponent } from './inventory/inventory.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { RefillsComponent } from './refills/refills.component';
import { StockComponent } from './stock/stock.component';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { ApiKeysComponent } from './api-keys/api-keys.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview'},
      { path: 'overview', component: OverviewComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'api-keys', component: ApiKeysComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'refills', component: RefillsComponent },
      { path: 'stock', component: StockComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
