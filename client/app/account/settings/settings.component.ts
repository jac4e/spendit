import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  UntypedFormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { first } from 'rxjs';
import { IAccount, IAccountForm } from 'typesit';
import { AccountService, AlertService } from '../../_services';

class SettingsForm {
  form: FormGroup;
  showErrors: { [key: string]: boolean };
  loading: boolean;
  type: "accountDetails" | "password";
  controlsConfig: { [key: string]: any };
  constructor(
    private formBuilder: UntypedFormBuilder,
    type: "accountDetails" | "password",
    controlsConfig: { [key: string]: any }
  ) {
    this.type = type;
    this.controlsConfig = controlsConfig;
    this.showErrors = {};
    Object.keys(controlsConfig).map((key) => {
      this.showErrors[key] = false;
    });
    this.loading = false;
    this.form = this.formBuilder.group(this.controlsConfig);
  }
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {
  account = {} as IAccount;
  accountDetailsForm!: SettingsForm;
  passwordForm!: SettingsForm;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {
    this.accountService.account.subscribe((account) => {
      if (account !== null) {
        this.account = account;
        this.accountDetailsForm = new SettingsForm(formBuilder, "accountDetails", {
          username: [this.account.username, [Validators.required]],
          firstName: [this.account.firstName, [Validators.required]],
          lastName: [this.account.lastName, [Validators.required]],
          email: [
            this.account.email,
            [
              Validators.required,
              Validators.email,
              Validators.pattern(/@ualberta.ca$/)
            ]
          ],
          notify: [this.account.notify],
          currentPassword: ['', [Validators.required]]
        });
        this.passwordForm = new SettingsForm(formBuilder, "password", {
          password: ['', [Validators.required, this.passwordValidator]],
          confirmPassword: ['', [Validators.required, this.passwordValidator]],
          currentPassword: ['', [Validators.required]]
        });
      }
    });
  }

  ngOnInit(): void {}

  onFocusOut(form: SettingsForm, key: string) {
    form.showErrors[key] = true;
  }

  onSubmit(form: SettingsForm) {

    // Enable showErrors for all fields
    Object.keys(form.showErrors).map((key) => {
      form.showErrors[key] = true;
    });

    if (form.form.invalid) {
      return;
    }
    form.loading = true;

    const accountForm: IAccountForm = {
      username: form.form.value.username || undefined,
      firstName: form.form.value.firstName || undefined,
      lastName: form.form.value.lastName || undefined,
      email: form.form.value.email || undefined,
      password: form.form.value.password || undefined,
      notify: form.form.value.notify || undefined,
    };

    const currentPassword = form.form.value.currentPassword;

    if (form.type === "password") {
      if(!confirm('Are you sure you want to change your password? All your sessions will be logged out.')) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to submit your changes?')) {
        return;
      }
    }

    this.accountService
      .updateAccount(form.type, currentPassword, accountForm)
      .pipe(first())
      .subscribe({
        next: () => {
          form.loading = false;
          this.alertService.success('Update successful', { autoClose: true });
          this.accountService.refreshAccount();
        },
        error: (resp) => {
          form.loading = false;
          this.alertService.error(resp.error.message);
        }
      });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    // Get fields
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');

    // Check if password and confirm password exist
    if (!password || !confirmPassword) {
      return null;
    }

    // If there are errors on password but not passwordMatch error,
    // let user fix those first before displying confirmPassword error
    if (password.errors !== null && !password.hasError('passwordMatch')) {
      return null;
    }

    // Do not check for matching passwords if passwords are empty
    if (password.value === '' || confirmPassword.value === '') {
      return null;
    }

    // Check if password matches confirmPassword
    if (password.value !== confirmPassword.value) {
      password.setErrors({ passwordMatch: true });
      confirmPassword.setErrors({ passwordMatch: true });
      return { passwordMatch: true };
    } else {
      password.setErrors(null);
      confirmPassword.setErrors(null);
      return null;
    }
  }
}
