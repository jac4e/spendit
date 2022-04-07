import { Component, OnInit } from '@angular/core';
import { Transaction } from 'client/app/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'client/app/_services';
import { first, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.sass']
})
export class TransactionsComponent implements OnInit {
  transactions!: Transaction[];
  form!: FormGroup;
  loading = false;
  submitted = false;

  refreshTransactions: Observable<Transaction[]>;

  // page stuff
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  showTransactions = true;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService
  ) {
    this.refreshTransactions = this.adminService.getAllTransactions();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      accountid: ['', Validators.required],
      type: ['', [Validators.required, Validators.pattern('^(credit|debit)$')]],
      reason: ['', Validators.required],
      total: [null, [Validators.required, Validators.min(0)]]
    });
  }

  get f() {
    return this.form.controls;
  }
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

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
          this.loading = false;
          // refresh transaction list
          this.showTransactions = false;
          setTimeout(() => {
            this.showTransactions = true;
          }, 100);
        }
      });
  }
}
