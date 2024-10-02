import { Component, OnInit } from '@angular/core';
import { AdminService } from 'client/app/_services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import {
  AccountService,
  AlertService,
  CommonService
} from 'client/app/_services';
import { first } from 'rxjs';
import {
  getObject,
  keysIAccount,
  getValues,
  IAccount,
  IAccountForm,
  Roles
} from 'typesit';

@Component({
  selector: 'app-dashboard-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  accounts!: IAccount[];
  form!: UntypedFormGroup;
  loading = false;
  submitted = false;
  accountKeys = keysIAccount;
  rolesValues = Object.values(Roles);
  rolesEnum = Roles;
  updateAccount;
  resetPassword;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private commonService: CommonService,
    private alertService: AlertService
  ) {
    this.refreshList();
    this.updateAccount = this.adminService.boundedUpdateAccount;
    this.resetPassword = this.adminService.boundedResetPassword;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      role: [
        '',
        [
          Validators.required,
          Validators.pattern(`^(${this.rolesValues.join('|')})`)
        ]
      ],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/@ualberta.ca$/)
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      notify: [false]
    });
  }

  get f() {
    return this.form.controls;
  }

  remove(id: string) {
    // console.log('remove', id);
    // Popup confirmation
    if (!confirm('Are you sure you want to delete this account?')) {
      return;
    }

    this.adminService.removeAccount(id).subscribe({
      next: () => {
        this.refreshList();
      },
      error: (resp) => {
        this.alertService.error(resp.error.message);
      }
    });
  }
  refreshList() {
    this.adminService.getAllAccounts().subscribe((accounts: IAccount[]) => {
      this.accounts = accounts;
    });
  }

  export() {
    this.adminService.getAllAccounts().subscribe((data: IAccount[]) => {
      this.commonService.export(
        data,
        `accounts_${this.commonService.localeISOTime()}.csv`
      );
    });
  }

  verify(id: string, role: Roles) {
    this.adminService.verify(id, role).subscribe({
      next: () => {
        this.loading = false;
        this.alertService.success('Successfully verified user!', {
          autoClose: true,
          id: 'dashboard-alert'
        });
        this.refreshList();
      },
      error: (resp) => {
        this.alertService.error(resp.error.message, {
          autoClose: true,
          id: 'dashboard-alert'
        });
        this.loading = false;
      }
    });
  }

  isVerified(account: IAccount) {
    return account.role !== Roles.Unverified;
  }

  parseBalance(balance: IAccount[keyof IAccount]) {
    if (balance === undefined) {
      return 'Undefined';
    }
    balance = BigInt(balance);
    const sign = balance < BigInt(0) ? '-' : '';
    const amount = balance < BigInt(0) ? balance * BigInt(-1) : balance;
    return `${sign}${amount.toString()}`;
  }

  getItemWrapper(account: IAccount) {
    return getObject(account);
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // Confirmation dialog
    if (!confirm('Are you sure you want to add this account?')) {
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
          this.refreshList();
        },
        error: (resp) => {
          this.alertService.error(resp.error.message, {
            autoClose: true,
            id: 'dashboard-alert'
          });
          this.loading = false;
        }
      });
  }
}
