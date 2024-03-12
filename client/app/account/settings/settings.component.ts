import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  UntypedFormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { first } from 'rxjs';
import { IAccount } from 'typesit';
import { AccountService, AlertService } from '../../_services';

class SettingsForm {
  form: FormGroup;
  showErrors: { [key: string]: boolean };
  loading: boolean;
  controlsConfig: { [key: string]: any };
  constructor(
    private formBuilder: UntypedFormBuilder,
    controlsConfig: { [key: string]: any }
  ) {
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
        this.accountDetailsForm = new SettingsForm(formBuilder, {
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
        this.passwordForm = new SettingsForm(formBuilder, {
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
    console.log(form.form);

    // Enable showErrors for all fields
    Object.keys(form.showErrors).map((key) => {
      form.showErrors[key] = true;
    });

    if (form.form.invalid) {
      return;
    }
    form.loading = true;

    const data = form.form.value;
    this.accountService
      .updateAccount(form.form.value)
      .pipe(first())
      .subscribe(
        (data) => {
          form.loading = false;
          this.alertService.success('Update successful', { autoClose: true });
        },
        (error) => {
          form.loading = false;
          this.alertService.error(error);
        }
      );
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
