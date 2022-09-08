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
import { AccountService, AlertService, CommonService } from 'client/app/_services';
import { first } from 'rxjs';

@Component({
  selector: 'app-dashboard-accounts',
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
          this.alertService.error(resp.error.message, {id: 'dashboard-alert'});
          this.loading = false;
        }
      });
  }
}
