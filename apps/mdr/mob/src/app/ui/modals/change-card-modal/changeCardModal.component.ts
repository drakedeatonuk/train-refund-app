import { LoaderService } from '../../lib/loader/loader.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StripePaymentElementComponent } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { ProcessorService } from '../../../services/processor/processor.service';
import { ModalController, ToastController } from '@ionic/angular';
import { delay } from '@multi/shared';
import { ResultError } from '@multi/shared';
import { UserService } from '../../../services/user/user.service';
import { HttpService } from '../../../core/http/services/http.service';

@Component({
  selector: 'app-change-card-modal',
  templateUrl: './changeCardModal.component.html',
})
export class ChangeCardModalComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent) paymentElement: StripePaymentElementComponent;

  cardDetails = new FormGroup({});

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  appearance = {
    theme: 'none',
    labels: 'floating',
    variables: {
      colorPrimary: '#08c277',
      colorBackground: '#f7f7f7',
      colorText: '#5a5a5a',
      colorDanger: '#fe4d64',
      borderRadius: '30px',
      spacingGridRow: '0.5rem',
    },
    rules: {
      '.Input': {
        border: '0',
      },
      '.Input:focus': {
        borderColor: '#08c277',
        outline: '2px solid #08c277',
      },
      '.Label--floating': {
        fontSize: '12px',
        color: '#adb3c8',
      },
      '.Error': {
        fontSize: '12px',
        paddingLeft: '0.8rem',
      },
    },
  };

  options: StripePaymentElementOptions = {
    terms: {
      bancontact: 'never',
      card: 'never',
      ideal: 'never',
      sepaDebit: 'never',
      sofort: 'never',
      auBecsDebit: 'never',
      usBankAccount: 'never',
    },
  };

  constructor(
    private processorSvc: ProcessorService,
    private toastCntrl: ToastController,
    private loadingSvc: LoaderService,
    private modalController: ModalController,
    private userSvc: UserService,
    private httpSvc: HttpService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadingSvc.loading = true;

    const setupIntentGetter = await this.processorSvc.getSetupIntent();
    if (setupIntentGetter.ok == false) return this.presentErrorToast(setupIntentGetter.error);
    this.elementsOptions.clientSecret = setupIntentGetter.value.client_secret;

    await this.letStripeLoad();
  }

  async letStripeLoad(): Promise<void> {
    while (true) {
      try {
        if (this.paymentElement.state === 'ready') {
          this.loadingSvc.loading = false;
          break;
        }
        await delay(500);
      } catch (e) {
        await delay(500);
      }
    }
  }

  async addCard() {
    this.loadingSvc.loading = true;
    let intentReq = await this.processorSvc.sendStripeSetupIntent(this.paymentElement.elements);
    if (intentReq.ok == false) return this.presentErrorToast(intentReq.error);

    if (this.userSvc.store.user.customer.paymentMethods.length) {
      const paymentMethodDeleter = await this.processorSvc.deleteCurrentPaymentMethod();
      if (paymentMethodDeleter.ok == false) return this.presentErrorToast(paymentMethodDeleter.error);
    }

    const paymentMethodSaver = await this.processorSvc.savePaymentMethodDetails(intentReq.value.setupIntent.payment_method.toString());
    if (paymentMethodSaver.ok == false) this.presentErrorToast(paymentMethodSaver.error);

    const loginDataUpdator = await this.httpSvc.fetchUserLoginData();
    if (loginDataUpdator.ok == false) this.presentErrorToast(loginDataUpdator.error);

    this.modalController.dismiss();
    this.presentSuccessToast();
  }

  async presentSuccessToast(): Promise<void> {
    this.loadingSvc.loading = false;
    const toast = await this.toastCntrl.create({
      header: 'Card Successfully Added',
      message: 'All future compensation earnings will be sent to the card you added!',
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

  async presentErrorToast(error: ResultError): Promise<void> {
    this.loadingSvc.loading = false;
    const errorMessage = `A error occurred: '${error.message}', please review your details & try again.`;

    const toast = await this.toastCntrl.create({
      header: 'Error Adding Card',
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
