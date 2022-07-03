import { HttpOfflineStoreService } from './core/http/services/httpOfflineStore.service';
import { FirebasePhotoUploader } from './services/photo/services/firebasePhotoUploader.service';
import { HttpOfflineService } from './core/http/services/httpOffline.service';
import { HttpStoreService } from './core/http/services/httpStore.service';
import { HttpService } from './core/http/services/http.service';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from './core/navigation/navigation.service';
import { RegisterMoreDetailsPageComponent } from './ui/pages/registration-pages/register-more-details-page/registerMoreDetailsPage.component';
import { AddressService } from './services/address/address.service';
import { TicketPicModalComponent } from './ui/modals/ticket-pic-modal/ticketPicModal.component';
import { TrainService } from './services/train/train.service';
import { PhotoService } from './services/photo/services/photo.service';
import { DateTimePickerModalComponent } from './ui/modals/datetime-picker-modal/dateTimePickerModal.component';
import { ClaimService } from './services/claim/claim.service';
import { LoaderService } from './ui/lib/loader/loader.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IgxAutocompleteModule, IgxDropDownModule, IgxInputGroupModule } from 'igniteui-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { OwlRadioModule } from 'owl-ng';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from '@drake.s.deaton/angular-datetime-picker';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoggedOutPageComponent } from './ui/pages/logged-out-page/loggedOutPage.component';
import { ClaimsDashboardPageComponent } from './ui/pages/claims-dashboard-page/claimsDashboardPage.component';
import { LoginPageComponent } from './ui/pages/login-page/loginPage.component';
import { RegisterPageComponent } from './ui/pages/registration-pages/register-page/registerPage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { ClaimPageComponent } from './ui/pages/claim-page/claimPage.component';
import { UserSettingsPageComponent } from './ui/pages/user-settings-page/userSettingsPage.component';
import { LogoutModalComponent } from './ui/modals/logout-modal/logoutModal.component';
import { ChangeCardModalComponent } from './ui/modals/change-card-modal/changeCardModal.component';
import { PaymentInfoPageComponent } from './ui/pages/payment-info-page/paymentInfoPage.component';
import { UserService } from './services/user/user.service';
import { UserStoreService } from './services/user/userStore.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpInterceptorProviders } from './core/interceptors';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordModalComponent } from './ui/modals/forgot-password-modal/forgotPasswordModal.component';
import { environment } from '../environments/environment';
import { ProcessorService } from './services/processor/processor.service';
import { NgxStripeModule } from 'ngx-stripe';
import { LoaderComponent } from './ui/lib/loader/loader.component';
import { NewClaimPageComponent } from './ui/pages/new-claim-page/newClaimPage.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatTimepickerModule } from 'mat-timepicker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PhotoLibrary } from '@awesome-cordova-plugins/photo-library/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { SandboxPageComponent } from './ui/sandbox/sandboxPage.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppTooltipComponent } from './ui/lib/tooltip/tooltip.component';
import { PersonalInfoPageComponent } from './ui/pages/personal-info-page/personalInfoPage.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SpeedTestModule } from 'ng-speed-test';
import { IonicStorageModule } from '@ionic/storage-angular';
import { StorageService } from './core/storage/storage.service';
import { Drivers } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { FIREBASE_PHOTO_UPLOADER_SERVICE } from './services/photo/constants/photo.constants';
import { AuthService } from './core/auth/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    LoggedOutPageComponent,
    ClaimsDashboardPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ClaimPageComponent,
    UserSettingsPageComponent,
    LogoutModalComponent,
    ChangeCardModalComponent,
    PaymentInfoPageComponent,
    ForgotPasswordModalComponent,
    TicketPicModalComponent,
    LoaderComponent,
    NewClaimPageComponent,
    DateTimePickerModalComponent,
    SandboxPageComponent,
    AppTooltipComponent,
    PersonalInfoPageComponent,
    RegisterMoreDetailsPageComponent,
  ],
  entryComponents: [],
  imports: [
    IonicStorageModule.forRoot({
      name: 'mdr',
      driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage],
    }),
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    HttpClientModule,
    NgxStripeModule.forRoot(environment.stripePublicKey),
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatDatepickerModule,
    MatNativeDateModule,
    OwlRadioModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatAutocompleteModule,
    IgxAutocompleteModule,
    IgxDropDownModule,
    MatTimepickerModule,
    IgxInputGroupModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    //AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence({synchronizeTabs:true}),
    MatTooltipModule,
    MatIconModule,
    SpeedTestModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      scope: './',
      registrationStrategy: 'registerImmediately', //registerWhenStable:30000
    }),
  ],
  providers: [
    StorageService,
    UserService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpInterceptorProviders,
    HttpService,
    HttpStoreService,
    HttpOfflineService,
    AuthService,
    NavigationService,
    UserStoreService,
    ProcessorService,
    LoaderService,
    ClaimService,
    AddressService,
    TrainService,
    PhotoService,
    FirebasePhotoUploader,
    PhotoLibrary,
    PhotoViewer,
    HttpOfflineStoreService,
    { provide: FIREBASE_PHOTO_UPLOADER_SERVICE, useClass: FirebasePhotoUploader },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
