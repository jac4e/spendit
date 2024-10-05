import { Component, OnInit, ViewChild } from '@angular/core';
import { ITransaction, TransactionType } from 'typesit';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AdminService, AlertService } from 'client/app/_services';
import { first, Observable } from 'rxjs';
import { ListControl, ListControlType } from 'client/app/_models';
import { ListComponent } from 'client/app/app-common/list/list.component';

@Component({
  selector: 'app-dashboard-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.sass']
})
export class TransactionsComponent implements OnInit {
  @ViewChild(ListComponent)
  private listComponent!: ListComponent;
  transactions!: ITransaction[];
  form!: UntypedFormGroup;
  types = Object.values(TransactionType);
  loading = false;
  submitted = false;

  refreshTransactions: Observable<ITransaction[]>;

  // page stuff
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  
  listControl: ListControl[] = [
    {
      name: 'View',
      type: ListControlType.View,
      shouldDisplay: (data: ITransaction) => {
        return true;
      }
    }
  ];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private adminService: AdminService,
    private alertService: AlertService
  ) {
    this.refreshTransactions = this.adminService.getAllTransactions();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      accountid: ['', Validators.required],
      type: [
        '',
        [Validators.required, Validators.pattern(`^(${this.types.join('|')})$`)]
      ],
      reason: ['', Validators.required],
      total: [
        null,
        [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]
      ]
    });
  }

  get f() {
    return this.form.controls;
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // Confirmation dialog
    if (!confirm('Are you sure you want to add this transaction?')) {
      return;
    }

    // Convert to ITransactionForm
    const transactionForm = this.form.value;
    transactionForm.products = [];

    this.loading = true;
    this.adminService
      .addTransaction(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Successfully added new transaction', {
            autoClose: true,
            id: 'dashboard-alert'
          });
          this.loading = false;
          // refresh transaction list
          this.listComponent.refreshData();
        },
        error: (resp) => {
          this.alertService.error(resp.error.message, {autoClose: true,id: 'dashboard-alert'});
          this.loading = false;
        }
      });
  }
}
