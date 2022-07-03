import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from '@multi/mdr';
import { UserService } from '../../../../services/user/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register-page',
  templateUrl: './registerPage.component.html',
})
export class RegisterPageComponent implements OnInit {
  public regForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(40),
      Validators.pattern(/^[a-zA-Z]*$/),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(40),
      Validators.pattern(/^[a-zA-Z]*$/),
    ]),
    loginEmail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
    consent: new FormControl('false', [Validators.requiredTrue]),
  });

  constructor(private userSvc: UserService, private router: Router, public toastCntrl: ToastController) {}

  ngOnInit(): void {
    if (this.userSvc.store?.regData) this.addExistingFormData();
    else this.userSvc.store.regData = {};
  }

  addExistingFormData(): void {
    this.firstName.setValue(this.userSvc.store.regData.firstName);
    this.lastName.setValue(this.userSvc.store.regData.lastName);
    this.loginEmail.setValue(this.userSvc.store.regData.email);
  }

  get firstName(): AbstractControl | null {
    return this.regForm.get('firstName');
  }

  get lastName(): AbstractControl | null {
    return this.regForm.get('lastName');
  }

  get loginEmail(): AbstractControl | null {
    return this.regForm.get('loginEmail');
  }

  get password(): AbstractControl | null {
    return this.regForm.get('password');
  }

  get consent(): AbstractControl | null {
    return this.regForm.get('consent');
  }

  async submit(): Promise<void> {
    const userFields: Users.NewUser = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.loginEmail.value,
      password: this.password.value,
      consent: this.consent.value,
    };

    this.userSvc.store.regData = { ...this.userSvc.store.regData, ...userFields };
    this.router.navigateByUrl('/register/2');
  }

  async presentErrorToast(error: string): Promise<void> {
    const errorMessage = `A error occurred: '${error}', please review your details & try again.`;

    const toast = await this.toastCntrl.create({
      header: 'Registration Error',
      message: errorMessage,
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
