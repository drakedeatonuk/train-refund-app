import { UsersService } from '../../../core/http/users.service';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { err } from '../../utils/utils';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
})
export class LoginModalComponent {
  constructor(private usersSvc: UsersService) {
    this.loginForm.valueChanges.subscribe((loginForm: FormGroup) => {
      console.log(loginForm);
    });
  }

  public binary = false;
  public loginForm = new FormGroup({
    loginEmail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
  });

  get loginEmail(): AbstractControl | null {
    return this.loginForm.get('loginEmail');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  async submitLogin(): Promise<void> {
    let email = this.loginForm.get('loginEmail')?.value ?? err();
    let password = this.loginForm.get('password')?.value ?? err();
    let loginSuccessful = await this.usersSvc.login(email, password);
    console.log({ loginSuccessful });
  }
}
