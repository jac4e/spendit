import { Component, OnInit } from '@angular/core';
import { ITransaction } from 'typeit';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AdminService, AlertService } from 'client/app/_services';
import { first, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.sass']
})
export class TransactionsComponent implements OnInit {
  transactions!: ITransaction[];
  form!: UntypedFormGroup;
  loading = false;
  submitted = false;

  refreshTransactions: Observable<ITransaction[]>;

  // page stuff
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  showTransactions = true;

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
      type: ['', [Validators.required, Validators.pattern('^(debit|credit)$')]],
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
          this.showTransactions = false;
          setTimeout(() => {
            this.showTransactions = true;
          }, 100);
        },
        error: (resp) => {
          this.alertService.error(resp.error.message, {autoClose: true,id: 'dashboard-alert'});
          this.loading = false;
        }
      });
  }
}
