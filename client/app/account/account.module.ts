import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AppCommonModule } from '../app-common/app-common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { RefillComponent } from './refill/refill.component';
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [OverviewComponent, SettingsComponent, TransactionsComponent, RefillComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NgbModule,
    NgxStripeModule.forRoot(),
    AppCommonModule,
    ReactiveFormsModule
  ]
})
export class AccountModule { }
