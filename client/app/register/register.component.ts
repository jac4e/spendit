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
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  showErrors: { [key: string]: boolean } = {
    username: false,
    // firstName: false,
    // lastName: false,
    // email: false,
    password: false
  };
  loading = false;
  registrationForm: { [key: string]: any } = {
    username: ['', [Validators.required]],
    // firstName: ['', [Validators.required]],
    // lastName: ['', [Validators.required]],
    name: ['', [Validators.required]],
    gid: ['', [Validators.required]],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/@ualberta.ca$/)
      ]
    ],
    password: ['', [Validators.required, this.passwordValidator]],
    confirmPassword: ['', [Validators.required, this.passwordValidator]],
    notify: [false]
  };
  jwtService = new JwtHelperService();
  client: any;
  access_token: any;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(this.registrationForm);

    // Initialize google client
    // @ts-ignore
    this.client = google.accounts.oauth2.initTokenClient({
      client_id: '1008970565201-lfhoe9qt1ceuoc3uikoa457o7k25le4q.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/userinfo.email \
              https://www.googleapis.com/auth/userinfo.profile \
              openid',
      callback: this.register
    });
    console.log(this.client);
    console.log(this.access_token);

    // // @ts-ignore
    // google.accounts.id.disableAutoSelect();
    // // @ts-ignore
    // google.accounts.id.initialize({
    //   client_id:
    //     '1008970565201-lfhoe9qt1ceuoc3uikoa457o7k25le4q.apps.googleusercontent.com',
    //   // @ts-ignore
    //   callback: register,
    //   auto_select: false,
    //   context: 'signup'
    // });
    // // @ts-ignore
    // google.accounts.id.renderButton(
    //   document.getElementById('google_oauth'),
    //   {
    //     text: 'signup_with',
    //     shape: 'pill',
    //     theme: 'filled_blue',
    //     size: 'medium',
    //     width: '350'
    //   } // customization attributes
    // );
    // const iframe = document.getElementById('google_oauth')?.getElementsByTagName('iframe')[0];
    // let newStyle = iframe?.style;
    // if (newStyle !== undefined) {
    //   newStyle.colorScheme = 'dark';
    // }
    // console.log(newStyle?.cssText);
    // console.log(document.getElementById('google_oauth')?.getElementsByTagName('iframe')[0].style.cssText);
  }

  get f() {
    return this.form.controls;
  }

  // @HostListener('window:oauth.success', ['$event'])
  register(tokenResponse: { hd: string; access_token: string; }) {
    if (tokenResponse.hd !== 'ualberta.ca') {
      this.alertService.error('Google account must be a UAlberta account', {
        autoClose: false,
        keepAfterRouteChange: true
      });
      return;
    }
    // this.access_token = tokenResponse.access_token;
    // console.log(tokenResponse);

    // Get decoded token for name and email
    // const decodedToken = this.jwtService.decodeToken(this.access_token);
    // console.log("test");
    // console.log(decodedToken);

    // Inject access token into form
    // this.form.controls['name'].setValue(decodedToken.name);
    // this.form.controls['gid'].setValue(decodedToken.sub);
    // this.form.controls['email'].setValue(decodedToken.email);

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
    const { ['confirmPassword']: confirmPassword, ...account } = this.form.value;
    this.accountService
      .register(accountForm, tokenResponse.access_token)
      .pipe(first())
      .subscribe({
        next: () => {
          this.loading = false;
          this.alertService.success('Successfully added new user', {
            autoClose: true,
            keepAfterRouteChange: true
          });
          // @ts-ignore
          google.accounts.oauth2.revoke(tokenResponse.access_token);
        },
        error: (resp) => {
          this.alertService.error(resp.error.message, {
            autoClose: true,
            keepAfterRouteChange: true
          });
          this.loading = false;
          // @ts-ignore
          google.accounts.oauth2.revoke(tokenResponse.access_token);
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

// global register function that google sign in button
// function passes oauth response as an event which calls the proper register function
// (<any>window).register = (response: any) => {
//   window.dispatchEvent(
//     new CustomEvent('oauth.success', {
//       detail: response,
//       bubbles: true,
//       cancelable: true
//     })
//   );
// };
