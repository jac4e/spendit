import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { OverviewComponent } from './overview/overview.component';
import { RefillComponent } from './refill/refill.component';
import { SettingsComponent } from './settings/settings.component';
import { TransactionsComponent } from './transactions/transactions.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview'},
      { path: 'overview', component: OverviewComponent },
      { path: 'refill', component: RefillComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'transactions', component: TransactionsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
