import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AppCommonModule } from '../app-common/app-common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [OverviewComponent, SettingsComponent, TransactionsComponent],
  imports: [CommonModule, AccountRoutingModule, NgbModule, AppCommonModule]
})
export class AccountModule { }
