import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../core/http/users.service';
import { err } from '../../utils/utils';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  public regForm = new FormGroup({
    loginEmail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
  });

  constructor(private usersSvc: UsersService) {}

  ngOnInit(): void {}

  get loginEmail(): AbstractControl | null {
    return this.regForm.get('loginEmail');
  }

  get password(): AbstractControl | null {
    return this.regForm.get('password');
  }

  async submitReg(): Promise<void> {
    let email = this.regForm.get('loginEmail')?.value ?? err();
    let password = this.regForm.get('password')?.value ?? err();
    let regSuccessful = this.usersSvc.register(email, password);
    console.log({ regSuccessful });
  }
}
