import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ListControl, ListControlType } from 'client/app/_models';
import { ListComponent } from 'client/app/app-common/list/list.component';

@Component({
  selector: 'app-dashboard-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.sass']
})
export class AccountsComponent implements OnInit {
  @ViewChild(ListComponent)
  private listComponent!: ListComponent;
  form!: UntypedFormGroup;
  loading = false;
  submitted = false;
  rolesValues = Object.values(Roles);
  listControl: ListControl[] = [
    {
      name: 'Verify',
      type: ListControlType.CustomDropdown,
      shouldDisplay: (data: IAccount) => {
        return data.role === Roles.Unverified;
      },
      options: [Roles.Member,Roles.NonMember].map((role) => {
        return {
          name: role,
          onClick: (data: IAccount) => {
            this.verify(data.id, role);
          }
        };
      })
    },
    {
      name: 'View',
      type: ListControlType.View,
      shouldDisplay: (data: IAccount) => {
        return true;
      }
    },
    {
      name: 'Edit',
      type: ListControlType.Edit,
      shouldDisplay: (data: IAccount) => {
        return true;
      },
      edit: {
        successAlert: 'dashboard-alert',
        submit: this.adminService.boundedUpdateAccount,
        secondarySubmit: this.adminService.boundedResetPassword
      }
    },
    {
      name: 'Remove',
      type: ListControlType.CustomButton,
      shouldDisplay: (data: IAccount) => {
        return true;
      },
      onClick: (data: IAccount) => {
        this.remove(data.id);
      }
    }
  ];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private commonService: CommonService,
    private alertService: AlertService
  ) {
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
        this.alertService.success('Successfully deleted account!', {
          autoClose: true,
          id: 'dashboard-alert'
        });
        this.listComponent.refreshData();
      },
      error: (resp) => {
        this.alertService.error(resp.error.message);
      }
    });
  }

  refreshList() {
    return this.adminService.getAllAccounts();
  }

  verify(id: string, role: Roles) {
    this.adminService.verify(id, role).subscribe({
      next: () => {
        this.loading = false;
        this.alertService.success('Successfully verified user!', {
          autoClose: true,
          id: 'dashboard-alert'
        });
        this.listComponent.refreshData();
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
          this.listComponent.refreshData();
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
