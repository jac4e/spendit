import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';

@NgModule({
  exports: [TransactionsListComponent, ViewModalComponent, EditModalComponent],
  declarations: [TransactionsListComponent, ViewModalComponent, EditModalComponent],
  imports: [CommonModule, NgbModule]
})
export class AppCommonModule { }
