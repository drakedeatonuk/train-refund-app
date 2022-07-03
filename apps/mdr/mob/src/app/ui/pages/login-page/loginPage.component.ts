import { LoaderService } from '../../lib/loader/loader.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Users } from '@multi/mdr';
import { Result, UNVERIFIED_LOGIN } from '@multi/shared';
import { UserService } from '../../../services/user/user.service';
import { err } from '../../../core/utils/utils';
import { AuthService } from '../../../core/auth/auth.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './loginPage.component.html',
})
export class LoginPageComponent implements OnInit {
  constructor(
    private authSvc: AuthService,
    private router: Router,
    public toastCntrl: ToastController,
    private loadingSvc: LoaderService
  ) {}

  ngOnInit(): void {}

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

  async login(): Promise<void> {
    this.loadingSvc.loading = true;
    let email = this.loginForm.get('loginEmail')?.value ?? err();
    let password = this.loginForm.get('password')?.value ?? err();
    let user: Users.LoginUser = { email, password };

    let res: Result<void> = await this.authSvc.login(user);
    if (res.ok == false) {
      if (res.error.message == 'unverifiedEmail')
        return this.presentEmailVerificationToast();
      else return this.presentErrorToast(res.error.message);
    } else this.router.navigateByUrl('/home');
    this.loadingSvc.loading = false;
  }

  async presentEmailVerificationToast(): Promise<void> {
    this.loadingSvc.loading = false;
    const toast = await this.toastCntrl.create({
      header: 'Email Verification Required',
      message: UNVERIFIED_LOGIN,
      icon: 'information-circle',
      color: 'd',
      position: 'top',
      duration: 8000,
      buttons: [
        {
          text: 'Re-Send Email',
          role: 'cancel',
          handler: () => {
            this.authSvc.requestVerificationEmail(this.loginEmail.value);
          },
        },
      ],
    });
    await toast.present();
  }

  async presentErrorToast(error: string): Promise<void> {
    this.loadingSvc.loading = false;
    const toast = await this.toastCntrl.create({
      header: 'Login Error',
      message: error,
      icon: 'information-circle',
      color: 'd',
      position: 'top',
      duration: 3000,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel'
        },
      ],
    });
    await toast.present();
  }
}
