import { NewPhoto } from '../../../services/photo/constants/photo.constants';
import { DateTimePickerModalComponent } from '../../modals/datetime-picker-modal/dateTimePickerModal.component';
import { LoaderService } from '../../lib/loader/loader.service';
import { CustomValidators } from '../../../core/utils/customValidators';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { Claims, stationNames, TrainAPI } from '@multi/mdr';
import { ClaimService } from '../../../services/claim/claim.service';
import { debounceTime, map, Observable, startWith, Subscription } from 'rxjs';
import { PhotoService } from '../../../services/photo/services/photo.service';
import { HttpService } from '../../../core/http/services/http.service';
import { UserService } from '../../../services/user/user.service';
import { BAD_CONNECTION } from '@multi/shared';

@Component({
  selector: 'app-new-claim-page',
  templateUrl: './newClaimPage.component.html',
})
export class NewClaimPageComponent implements AfterViewInit, OnDestroy {
  ticketRefLength: 11 | 8;
  startingStations = Object.keys(stationNames);
  endingStations = Object.keys(stationNames);
  filteredStartingStations: Observable<string[]>;
  filteredEndingStations: Observable<string[]>;
  displayableJourneyDateTimes: string;
  newClaimTicketPhoto: NewPhoto;
  ticketTypeSub: Subscription;
  claimTypeSub: Subscription;
  purchaseTypeSub: Subscription;
  isDiffDayArrival = true;

  public newClaimForm = new FormGroup(
    {
      ticketType: new FormControl('', [Validators.required]),
      claimType: new FormControl('', [Validators.required]),
      purchaseType: new FormControl('', [Validators.required, Validators.pattern(/^fromTrainWebsite$|^fromStation$/)]),
      trainDelay: new FormControl('', [Validators.required]),
      journeyStartStation: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[123456 a-zA-Z-()&]*$/),
        Validators.maxLength(50),
        CustomValidators.isStation,
      ]),
      journeyEndStation: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[123456 a-zA-Z-()&]*$/),
        Validators.maxLength(50),
        CustomValidators.isStation,
      ]),
      journeyDateTimes: new FormControl('', [Validators.required]),
      journeyStartDateTime: new FormControl('', [Validators.required]),
      journeyEndDateTime: new FormControl('', [Validators.required]),
      isReturn: new FormControl('', [Validators.required]),
      ticketPrice: new FormControl('', [
        Validators.required,
        Validators.pattern(/^£?[0-9]*$|^£?[0-9]*[.][0-9]{1,2}$/),
        Validators.maxLength(10),
      ]),
      ticketRef: new FormControl('', [Validators.required]),
      ticketPic: new FormControl('', [Validators.required]),
    },
    { validators: [CustomValidators.isDifferentStations] }
  );

  displayedQuestions = {
    // key names are linked to form IDs on client & column names in the DB
    ticketType: true,
    claimType: true,
    purchaseType: true,
    trainDelay: true,
    journeyStations: true, //is journeyStartStation, journeyEndStation
    journeyDateTimes: true, //is journeyStartDateTime, journeyEndDateTime
    isReturn: true,
    ticketPrice: true,
    ticketRef: true,
    ticketPic: true,
  };

  constructor(
    private router: Router,
    private toastCntrl: ToastController,
    private claimSvc: ClaimService,
    private photoSvc: PhotoService,
    private httpSvc: HttpService,
    private loadingSvc: LoaderService,
    private modalCntrl: ModalController,
    private userSvc: UserService
  ) {}

  configureStationDropdowns() {
    // the drops for stations need filtering configured based on what the uses typing
    this.filteredStartingStations = this.journeyStartStation.valueChanges.pipe(
      debounceTime(400),
      startWith(''),
      map(value => this.startingStationsFilter(value))
    );
    this.filteredEndingStations = this.journeyEndStation.valueChanges.pipe(
      debounceTime(400),
      startWith(''),
      map(value => this.endingStationsFilter(value))
    );
  }

  configureTicketTypeForms() {
    // ticketType has effects on other form fields
    this.ticketTypeSub = this.ticketType.valueChanges.subscribe(ticketType => {
      this.ticketRefLength = ticketType == 'eTicket' ? 11 : 8;
      this.ticketRef.clearValidators();
      this.ticketRef.addValidators([
        Validators.minLength(this.ticketRefLength),
        Validators.maxLength(this.ticketRefLength),
        Validators.required,
      ]);
      this.ticketRef.updateValueAndValidity();
    });
  }

  configureClaimTypeForms() {
    // claimType effects which other form fields should be displayed
    this.claimTypeSub = this.claimType.valueChanges.subscribe(change => {
      if (change == 'delayedTrain') {
        [this.displayedQuestions.purchaseType, this.displayedQuestions.trainDelay] = [false, true];
        this.purchaseType.clearValidators();
        this.trainDelay.setValidators(Validators.required);
        this.purchaseType.updateValueAndValidity();
        this.trainDelay.updateValueAndValidity();
      } else {
        [this.displayedQuestions.purchaseType, this.displayedQuestions.trainDelay] = [true, false];
        this.trainDelay.clearValidators();
        this.purchaseType.setValidators(Validators.required);
        this.trainDelay.updateValueAndValidity();
        this.purchaseType.updateValueAndValidity();
      }
      console.log({
        purchaseType: this.purchaseType.errors,
        trainDelay: this.trainDelay.errors,
      });
    });
  }

  configureFormBreaks() {
    // based on a users options, we may not be able to accept some types of claims
    this.purchaseTypeSub = this.purchaseType.valueChanges.subscribe(purchaseType => {
      if (purchaseType == 'fromThirdParty')
        this.presentErrorToast(`Sorry, but if you bought your ticket from a third-party website, only they can give you a refund`);
    });
  }

  async preloadDatePickerModal() {
    // quickly preloading the modal for the first time so it loads quicker when the user opens it!
    let tempModal = await this.modalCntrl.create({
      animated: false, // this should prevent it from being visible
      swipeToClose: false, // disable interaction to prevent unexpected behavior
      backdropDismiss: false, // disable interaction to prevent unexpected behavior
      showBackdrop: false, // minimize changes to UI
      keyboardClose: false, // minimize side-effects
      component: DateTimePickerModalComponent, // Your custom modal component likely won't render, be sure to preload any related assets inside the index.html <head> tags
      componentProps: {
        journeyStartDateTime: this.journeyStartDateTime.value,
        journeyEndDateTime: this.journeyEndDateTime.value,
      },
    });
    await tempModal.present();
    await tempModal.dismiss();
  }

  // @ViewChild('ticketDetails', {read: ElementRef}) ticketDetailsAccordion: ElementRef;

  ngAfterViewInit(): void {
    this.configureStationDropdowns();
    this.configureTicketTypeForms();
    this.configureClaimTypeForms();
    this.configureFormBreaks();
    this.preloadDatePickerModal();
  }

  async setDaysField(from: string, to: string): Promise<TrainAPI.Days> {
    if ([from, to].some(day => day == 'SATURDAY')) return 'SATURDAY';
    else if ([from, to].some(day => day == 'SUNDAY')) return 'SUNDAY';
    else return 'WEEKDAY';
  }

  private startingStationsFilter(value: string): string[] {
    if (!value) return this.startingStations;
    const filterValue = value.toLowerCase();
    return this.startingStations.filter(option => option.toLowerCase().includes(filterValue));
  }

  private endingStationsFilter(value: string): string[] {
    if (!value) return this.endingStations;
    const filterValue = value.toLowerCase();
    return this.endingStations.filter(option => option.toLowerCase().includes(filterValue));
  }

  async addDateTimes(dateTimes: Date[]): Promise<void> {
    const startDateTime = dateTimes[0].toLocaleTimeString('en-GB', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const endDateTime = dateTimes[1].toLocaleTimeString('en-GB', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    this.newClaimForm.controls['journeyDateTimes'].setValue(dateTimes);
    this.displayableJourneyDateTimes = `${startDateTime} - ${endDateTime}`;
    this.newClaimForm.controls['journeyStartDateTime'].setValue(dateTimes[0]);
    this.newClaimForm.controls['journeyEndDateTime'].setValue(dateTimes[1]);
  }

  async takeTicketPhoto() {
    this.newClaimTicketPhoto = await this.photoSvc.takePhoto(this.userSvc.store.user);
    this.newClaimForm.controls['ticketPic'].setValue(this.newClaimTicketPhoto.photo.webPath);
    console.log('A');
    console.log(this.newClaimTicketPhoto);
  }

  async submitNewClaim(): Promise<void> {
    // TODO add in check for if a card has already been added... once WorldPay has been added
    // const isAddingCardNow: ConfirmResult = await Dialog.confirm({
    //   title: 'Add a Bank Card',
    //   message: "We can process your claim, but we'll need your bank detail before we can send your compensation",
    //   okButtonTitle: 'Add Card Now',
    //   cancelButtonTitle: 'Add Card Later',
    // });
    // if (isAddingCardNow.value) {
    //   /*TODO... once WorldPay has been added*/
    // }
    this.loadingSvc.loading = true;

    console.log('in prepPhotoUploadData');
    const photoUploadData = await this.photoSvc.prepPhotoUploadData(this.newClaimTicketPhoto);
    const photoSubmitter = await this.photoSvc.submitPhotoUpload(photoUploadData);
    console.log('got past submitPhotoUpload', photoSubmitter);

    if (photoSubmitter.ok == false && photoSubmitter.error.message == BAD_CONNECTION)
      await this.httpSvc.offlineStore.storePendingPhotoUploadRequest(photoUploadData);
    else if (photoSubmitter.ok == false)
      return this.presentErrorToast(photoSubmitter.error.message);

    const newClaim: Claims.NewClaim = {
      userId: this.userSvc.store.user.id,
      ticketType: this.ticketType.value,
      claimType: this.claimType.value,
      purchaseType: this.purchaseType.value ? this.purchaseType.value : null,
      trainDelay: this.trainDelay.value,
      journeyStartStation: this.claimSvc.stationToShortCode(this.journeyStartStation.value),
      journeyEndStation: this.claimSvc.stationToShortCode(this.journeyEndStation.value),
      journeyStartDateTime: this.journeyStartDateTime.value,
      journeyEndDateTime: this.journeyEndDateTime.value,
      isReturn: this.isReturn.value,
      ticketPrice: this.ticketPrice.value.replace(/£/, ''),
      ticketRef: this.ticketRef.value,
      claimStatus: 'pending', //TODO: add back in ClaimStatus.pending
      dateCreated: new Date(),
      photo: {
        userId: this.userSvc.store.user.id,
        firebaseId: photoUploadData.customMetadata.firebaseId,
        firebaseUrl: photoSubmitter.ok == true ? photoSubmitter.value : null,
        nativeUrl: this.newClaimTicketPhoto.photoPaths.webviewPath,
      },
    };

    console.log('atempting claim upload for:', newClaim);

    const claimSubmitter = await this.claimSvc.submitNewClaim(newClaim);
    console.log(console.log('TEST4', 'submitNewClaim passed'));

    // if there's any errors other than connectivity issues...
    if (claimSubmitter.ok == false && claimSubmitter.error.message != BAD_CONNECTION)
      return this.presentErrorToast(claimSubmitter.error.message);

    // for BAD_CONNECTION errors occurred, treat the request as if it was successfull
    if ((claimSubmitter.ok == false && claimSubmitter.error.message == BAD_CONNECTION)
    || (photoSubmitter.ok == false && photoSubmitter.error.message == BAD_CONNECTION))
      this.presentErrorToast(BAD_CONNECTION);
    else
      this.presentSuccessToast();

    this.newClaimForm.reset();

    this.router.navigateByUrl('/home');
  }

  get ticketType(): AbstractControl | null {
    return this.newClaimForm.get('ticketType');
  }

  get claimType(): AbstractControl | null {
    return this.newClaimForm.get('claimType');
  }

  get purchaseType(): AbstractControl | null {
    return this.newClaimForm.get('purchaseType');
  }

  get trainDelay(): AbstractControl | null {
    return this.newClaimForm.get('trainDelay');
  }

  get journeyStartStation(): AbstractControl | null {
    return this.newClaimForm.get('journeyStartStation');
  }

  get journeyEndStation(): AbstractControl | null {
    return this.newClaimForm.get('journeyEndStation');
  }

  get journeyDateTimes(): AbstractControl | null {
    return this.newClaimForm.get('journeyDateTimes');
  }

  get journeyStartDateTime(): AbstractControl | null {
    return this.newClaimForm.get('journeyStartDateTime');
  }

  get journeyEndDateTime(): AbstractControl | null {
    return this.newClaimForm.get('journeyEndDateTime');
  }

  get isReturn(): AbstractControl | null {
    return this.newClaimForm.get('isReturn');
  }

  get ticketPrice(): AbstractControl | null {
    return this.newClaimForm.get('ticketPrice');
  }

  get ticketRef(): AbstractControl | null {
    return this.newClaimForm.get('ticketRef');
  }

  get ticketPic(): AbstractControl | null {
    return this.newClaimForm.get('ticketPic');
  }

  hasBlankField() {
    return (
      this.ticketPic?.errors?.['required'] ||
      this?.ticketRef?.['required'] ||
      this?.ticketPrice?.['required'] ||
      this?.isReturn?.['required'] ||
      this?.journeyStartDateTime?.['required'] ||
      this?.journeyEndDateTime?.['required'] ||
      this?.journeyStartStation?.['required'] ||
      this?.journeyEndStation?.['required'] ||
      this?.ticketType?.['required'] ||
      this?.claimType?.['required']
    );
  }

  async presentSuccessToast(): Promise<void> {
    this.loadingSvc.loading = false;
    const toast = await this.toastCntrl.create({
      header: 'Claim Successfully Submitted!',
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

  ngOnDestroy(): void {
    this.ticketTypeSub.unsubscribe();
    this.claimTypeSub.unsubscribe();
    this.purchaseTypeSub.unsubscribe();
  }
}
