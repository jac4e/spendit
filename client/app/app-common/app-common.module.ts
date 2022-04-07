import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  exports: [TransactionsListComponent, ViewModalComponent, EditModalComponent, AlertComponent],
  declarations: [TransactionsListComponent, ViewModalComponent, EditModalComponent, AlertComponent],
  imports: [CommonModule, NgbModule]
})
export class AppCommonModule { }
