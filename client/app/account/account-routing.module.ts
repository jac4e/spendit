import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { OverviewComponent } from './overview/overview.component';
import { RefillComponent } from './refill/refill.component';
import { SettingsComponent } from './settings/settings.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AuthGuard } from '../_interceptors';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview'},
      { path: 'overview', component: OverviewComponent },
      { path: 'refill', component: RefillComponent, canActivate: [AuthGuard], data: { roles: ['member','nonmember'] } },
      { path: 'settings', component: SettingsComponent },
      { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard], data: { roles: ['member','nonmember'] } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
