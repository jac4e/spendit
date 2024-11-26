import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewModalComponent } from './view-modal/view-modal.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { AlertComponent } from './alert/alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import { dripCross } from '@ng-icons/dripicons';
import { ListComponent, NgbdSortableHeader } from './list/list.component';

@NgModule({
  exports: [
    TransactionsListComponent,
    ListComponent,
    ViewModalComponent,
    EditModalComponent,
    AlertComponent
  ],
  declarations: [
    TransactionsListComponent,
    ListComponent,
    ViewModalComponent,
    EditModalComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgbdSortableHeader,
    NgIconsModule.withIcons({ dripCross })
  ]
})
export class AppCommonModule { }
