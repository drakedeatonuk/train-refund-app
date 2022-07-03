import { ToastController } from '@ionic/angular';
import { LoaderService } from '../../lib/loader/loader.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Users, Addresses } from '@multi/mdr';
import { UserService } from '../../../services/user/user.service';
import { AddressService } from '../../../services/address/address.service';
import { CustomValidators } from '../../../core/utils/customValidators';

@Component({
  selector: 'app-personal-info-page',
  templateUrl: './personalInfoPage.component.html',
})
export class PersonalInfoPageComponent implements OnInit {
  private originalForm: object;

  personalInfoForm = new FormGroup({
    loginEmail: new FormControl(this.userSvc.store?.user?.email, [Validators.required, Validators.email]),
    firstName: new FormControl(this.userSvc.store?.user?.firstName, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(40),
      Validators.pattern(/^[a-zA-Z]*$/),
    ]),
    lastName: new FormControl(this.userSvc.store?.user?.lastName, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(40),
      Validators.pattern(/^[a-zA-Z]*$/),
    ]),
    address1: new FormControl(this.userSvc.store?.user?.address.address1, [Validators.required, Validators.maxLength(100)]),
    address2: new FormControl(this.userSvc.store?.user?.address.address2, [Validators.maxLength(100)]),
    city: new FormControl(this.userSvc.store?.user?.address.city, [Validators.required, Validators.pattern(/^[a-z- A-Z]*$/)]),
    postcode: new FormControl(this.userSvc.store?.user?.address.postcode, [
      Validators.required,
      Validators.pattern(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/),
      Validators.minLength(6),
      Validators.maxLength(12),
    ]),
  });

  constructor(
    private userSvc: UserService,
    private addressSvc: AddressService,
    private loadingSvc: LoaderService,
    private toastCntrl: ToastController
  ) {}

  private configureOriginalForm(): void {
    // creating form copy to compare form changes against so we only make submissions when there's been changes
    this.originalForm = this.personalInfoForm.value;
    this.personalInfoForm.addValidators(CustomValidators.formHasChanges(this.originalForm));
    this.personalInfoForm.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.personalInfoForm.disable();
    this.configureOriginalForm();
  }

  enterEditMode(): void {
    this.personalInfoForm.enable();
    this.loginEmail.disable();
  }

  leaveEditMode(): void {
    this.personalInfoForm.reset({
      loginEmail: this.userSvc.store?.user?.email,
      firstName: this.userSvc.store?.user?.firstName,
      lastName: this.userSvc.store?.user?.lastName,
      address1: this.userSvc.store?.user?.address?.address1,
      address2: this.userSvc.store?.user?.address?.address2,
      city: this.userSvc.store?.user?.address?.city,
      postcode: this.userSvc.store?.user?.address?.postcode,
    });
    this.originalForm = this.personalInfoForm.value;
    this.personalInfoForm.updateValueAndValidity();
    this.personalInfoForm.disable();
  }

  async submit(): Promise<void> {
    this.loadingSvc.loading = true;
    const userPersonalInfo: Users.PartialUser = {
      firstName: this.personalInfoForm.value.firstName,
      lastName: this.personalInfoForm.value.lastName,
    };
    const userAddressInfo: Addresses.PartialAddress = {
      userId: this.userSvc.store?.user?.id,
      address1: this.personalInfoForm.value.address1,
      address2: this.personalInfoForm.value.address2,
      city: this.personalInfoForm.value.city,
      postcode: this.personalInfoForm.value.postcode,
    };
    const userUpdater = await this.userSvc.postUserUpdate(userPersonalInfo);
    const addressUpdater = await this.addressSvc.postAddressUpdate(userAddressInfo);
    if (userUpdater.ok == false || addressUpdater.ok == false) this.presentErrorToast("There's been an error updating your details");
    else this.presentSuccessToast();
    this.leaveEditMode();
  }

  async presentSuccessToast(): Promise<void> {
    this.loadingSvc.loading = false;
    const toast = await this.toastCntrl.create({
      header: 'Details Successfully Updated!',
      message: 'Your details have been changed on our system!',
      icon: 'checkmark-circle-outline',
      color: 'p',
      position: 'bottom',
      duration: 3000,
    });
    await toast.present();
  }

  async presentErrorToast(message: string): Promise<void> {
    this.loadingSvc.loading = false;
    const toast = await this.toastCntrl.create({
      header: 'Claim Creation Error',
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

  get loginEmail(): AbstractControl | null {
    return this.personalInfoForm.get('loginEmail');
  }

  get firstName(): AbstractControl | null {
    return this.personalInfoForm.get('firstName');
  }

  get lastName(): AbstractControl | null {
    return this.personalInfoForm.get('lastName');
  }

  get address1(): AbstractControl | null {
    return this.personalInfoForm.get('address1');
  }

  get address2(): AbstractControl | null {
    return this.personalInfoForm.get('address2');
  }

  get city(): AbstractControl | null {
    return this.personalInfoForm.get('city');
  }

  get postcode(): AbstractControl | null {
    return this.personalInfoForm.get('postcode');
  }
}
