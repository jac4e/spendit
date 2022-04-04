import { Component, OnInit } from '@angular/core';
import { Transaction } from 'client/app/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'client/app/_services';
import { first } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.sass']
})
export class TransactionsComponent implements OnInit {
  transactions!: Transaction[];
  form!: FormGroup;
  loading = false;
  submitted = false;

  // page stuff
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService
  ) {
    this.refreshTransactions();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      accountid: ['', Validators.required],
      type: ['', [Validators.required, Validators.pattern('^(credit|debit)$')]],
      reason: ['', Validators.required],
      amount: [
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
          this.refreshTransactions();
        },
        error: (error) => {
          // this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  refreshTransactions() {
    this.adminService
      .getAllTransactions()
      .subscribe((transactions: Transaction[]) => {
        this.transactions = transactions;
        this.collectionSize = transactions.length;
        this.transactions = transactions.slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize
        );
      });
  }
}
