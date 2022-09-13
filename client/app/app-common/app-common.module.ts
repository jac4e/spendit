import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { AlertComponent } from './alert/alert.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import { dripCross } from '@ng-icons/dripicons';

@NgModule({
  exports: [
    TransactionsListComponent,
    ViewModalComponent,
    EditModalComponent,
    AlertComponent
  ],
  declarations: [
    TransactionsListComponent,
    ViewModalComponent,
    EditModalComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    NgIconsModule.withIcons({ dripCross })
  ]
})
export class AppCommonModule { }
