import { ModalController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { err } from '../../../core/utils/utils';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgotPasswordModal.component.html',
})
export class ForgotPasswordModalComponent implements OnInit {
  public forgotPasswordForm = new FormGroup({
    loginEmail: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(public toastCntrl: ToastController, public modalController: ModalController, public authSvc: AuthService) {}

  ngOnInit(): void {}

  get loginEmail(): AbstractControl | null {
    return this.forgotPasswordForm.get('loginEmail');
  }

  async initPasswordReset(): Promise<void> {
    let email = this.forgotPasswordForm.get('loginEmail')?.value ?? err();
    let request = await this.authSvc.requestPasswordResetEmail(email);

    if (request.ok == false) this.presentErrorToast(request.error.message);

    this.presentSuccessToast();

    this.modalController.dismiss();
  }

  async presentSuccessToast(): Promise<void> {
    const toast = await this.toastCntrl.create({
      header: 'Reset Password Email Sent',
      message: 'Please reset your password by using the link in the email we sent you.',
      icon: 'checkmark-circle-outline',
      color: 'p',
      position: 'bottom',
      duration: 7000,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  async presentErrorToast(error: string): Promise<void> {
    console.log(error);

    const toast = await this.toastCntrl.create({
      header: 'Password Reset Error',
      message: "We weren't able to find that email on our system",
      icon: 'information-circle',
      color: 'd',
      position: 'top',
      duration: 10000,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
