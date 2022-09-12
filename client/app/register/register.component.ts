import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;
  showErrors: {[key: string]: boolean} = {
    username: false,
    firstName: false,
    lastName: false,
    email: false,
    password: false
  };
  loading: boolean = false;
  registrationForm: {[key: string]: any} = {
    username: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.passwordValidator]],
    confirmPassword: ['', [Validators.required, this.passwordValidator]],
  }

  constructor(private formBuilder: UntypedFormBuilder) { 
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(this.registrationForm);
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log("form invalid");
      console.log(this.form);
      return;
    }
  }

  onFocusOut(key: string){
    this.showErrors[key] = true;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {;
    // Get fields
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');

    // Check if password and confirm password exist
    if (!password || !confirmPassword){
      return null;
    }

    // If there are errors on password but not passwordMatch error, 
    // let user fix those first before displying confirmPassword error
    if (password.errors !== null && !password.hasError('passwordMatch')){
      return null;
    }

    // Do not check for matching passwords if passwords are empty
    if (password.value === '' || confirmPassword.value === ''){
      return null;
    }

    // Check if password matches confirmPassword
    if (password.value !== confirmPassword.value) {
      password.setErrors({'passwordMatch': true});
      confirmPassword.setErrors({'passwordMatch': true});
      return {'passwordMatch': true};
    } else {
      password.setErrors(null);
      confirmPassword.setErrors(null);
      return null;
    }
  }

}
