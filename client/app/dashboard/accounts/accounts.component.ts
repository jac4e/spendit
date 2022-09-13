import { Component, OnInit } from '@angular/core';
import { AdminService } from 'client/app/_services/admin.service';
import { User } from 'client/app/_models';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { AccountService, AlertService, CommonService } from 'client/app/_services';
import { first } from 'rxjs';

@Component({
  selector: 'app-dashboard-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  accounts!: User[];
  form!: UntypedFormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private commonService: CommonService,
    private alertService: AlertService
  ) {
    this.adminService.getAllAccounts().subscribe((accounts: User[]) => {
      this.accounts = accounts;
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      role: [
        'user',
        [Validators.required, Validators.pattern('^(user|admin)$')]
      ],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.form.controls;
  }

  export() {
    this.adminService.getAllAccounts().subscribe((data: User[]) => {
      this.commonService.export(
        data,
        `accounts_${this.commonService.localeISOTime()}.csv`
      );
    });
  }

  verify(id: string) {
    this.adminService.verify(id).subscribe({
      next: () => {
        this.loading = false;
        this.alertService.success('Successfully verified user!', {
          autoClose: true,
          id: 'dashboard-alert'
        });
        this.adminService.getAllAccounts().subscribe((accounts: User[]) => {
          this.accounts = accounts;
        });
      },
      error: (resp) => {
        this.alertService.error(resp.error.message, {autoClose: true,id: 'dashboard-alert'});
        this.loading = false;
      }
    });
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
          this.alertService.success('Successfully added new user', {
            autoClose: true,
            id: 'dashboard-alert'
          });
          this.adminService.getAllAccounts().subscribe((accounts: User[]) => {
            this.accounts = accounts;
          });
        },
        error: (resp) => {
          this.alertService.error(resp.error.message, {autoClose: true,id: 'dashboard-alert'});
          this.loading = false;
        }
      });
  }
}
