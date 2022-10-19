import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  UntypedFormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { first } from 'rxjs';
import { AccountService, AlertService } from '../_services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  showErrors: { [key: string]: boolean } = {
    username: false,
    firstName: false,
    lastName: false,
    email: false,
    password: false
  };
  loading = false;
  registrationForm: { [key: string]: any } = {
    username: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.passwordValidator]],
    confirmPassword: ['', [Validators.required, this.passwordValidator]]
  };

  constructor(
    private formBuilder: UntypedFormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(this.registrationForm);
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      this.alertService.error(
        'Registration form is invalid, invalid fields are highlighted below.',
        {
          autoClose: true,
          keepAfterRouteChange: false
        }
      );
      return;
    }

    // convert form to IAccountForm
    const accountForm = this.form.value;
    delete accountForm.confirmPassword;

    this.loading = true;
    this.accountService
      .register(accountForm)
      .pipe(first())
      .subscribe({
        next: () => {
          this.loading = false;
          this.alertService.success('Successfully added new user', {
            autoClose: true,
            keepAfterRouteChange: true
          });
        },
        error: (resp) => {
          this.alertService.error(resp.error.message, {
            autoClose: true,
            keepAfterRouteChange: true
          });
          this.loading = false;
        }
      });
  }

  onFocusOut(key: string) {
    this.showErrors[key] = true;
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
