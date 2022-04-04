import { Component, OnInit } from '@angular/core';
import { AdminService } from 'client/app/_services/admin.service';
import { User } from 'client/app/_models';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { AccountService } from 'client/app/_services';
import { first } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  accounts!: User[];
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {
    this.adminService.getAllAccounts().subscribe((accounts: User[]) => {
      this.accounts = accounts;
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      ccid: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: 'user'
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
      .addAccount(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.loading = false;
          this.adminService.getAllAccounts().subscribe((accounts: User[]) => {
            this.accounts = accounts;
          });
        },
        error: (error) => {
          // this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
