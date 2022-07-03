import { ToastController } from '@ionic/angular';
import { LoaderService } from '../../../lib/loader/loader.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Addresses } from '@multi/mdr';
import { Result } from '@multi/shared';
import { UserService } from '../../../../services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-register-more-details-page',
  templateUrl: './registerMoreDetailsPage.component.html',
})
export class RegisterMoreDetailsPageComponent implements OnInit {
  addressForm = new FormGroup({
    address1: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    address2: new FormControl('', [Validators.maxLength(100)]),
    city: new FormControl('', [Validators.required, Validators.pattern(/^[a-z- A-Z]*$/)]),
    postcode: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/),
      Validators.minLength(6),
      Validators.maxLength(12),
    ]),
  });

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private loadingSvc: LoaderService,
    private toastCntrl: ToastController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.configurePostcodes();
    if (this.userSvc.store?.regData?.address) this.addExistingFormData();
  }

  configurePostcodes(): void {
    this.postcode.valueChanges.subscribe(() => {
      this.postcode.patchValue(this.postcode.value.toUpperCase(), {emitEvent: false});
    });
  }

  addExistingFormData(): void {
    this.address1.setValue(this.userSvc.store.regData.address?.address1);
    this.address2.setValue(this.userSvc.store.regData.address?.address2);
    this.city.setValue(this.userSvc.store.regData.address?.city);
    this.postcode.setValue(this.userSvc.store.regData.address?.postcode);
  }

  async submit(): Promise<void> {
    this.loadingSvc.loading = true;
    const addressFields: Addresses.PartialAddress = {
      address1: this.addressForm.value.address1,
      address2: this.addressForm.value.address2,
      city: this.addressForm.value.city,
      postcode: this.addressForm.value.postcode,
    };
    this.userSvc.store.regData = { ...this.userSvc.store.regData, ...{ address: addressFields } };

    const res: Result<void> = await this.authSvc.register(this.userSvc.store.regData);

    if (res.ok == false) {
      if (res.error.message == 'emailTaken') {
        this.router.navigateByUrl('/register/1');
        return this.presentErrorToast('This email has already been registered, please check your email and try again!');
      } else return this.presentErrorToast(res?.error.message);
    }

    this.userSvc.store.regData = null;
    await this.presentSuccessToast();
    console.log(this.userSvc.store.user);
    await this.router.navigateByUrl('home');
    this.loadingSvc.loading = false;
  }

  get address1(): AbstractControl | null {
    return this.addressForm.get('address1');
  }

  get address2(): AbstractControl | null {
    return this.addressForm.get('address2');
  }

  get city(): AbstractControl | null {
    return this.addressForm.get('city');
  }

  get postcode(): AbstractControl | null {
    return this.addressForm.get('postcode');
  }

  async presentSuccessToast(): Promise<void> {
    const toast = await this.toastCntrl.create({
      header: 'Registration Successful',
      message: 'Your account has been created! To log in, please verify your email first.',
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

  async presentErrorToast(message: string): Promise<void> {
    this.loadingSvc.loading = false;
    const toast = await this.toastCntrl.create({
      header: 'Registration Error',
      message: message,
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

/*



*/
