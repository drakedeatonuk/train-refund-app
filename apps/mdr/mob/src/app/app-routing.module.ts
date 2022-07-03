import { LoggedInGuard } from './core/guards/loggedIn.guard';
import { PaymentInfoPageComponent } from './ui/pages/payment-info-page/paymentInfoPage.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './ui/pages/login-page/loginPage.component';
import { LoggedOutPageComponent } from './ui/pages/logged-out-page/loggedOutPage.component';
import { RegisterPageComponent } from './ui/pages/registration-pages/register-page/registerPage.component';
import { ClaimsDashboardPageComponent } from './ui/pages/claims-dashboard-page/claimsDashboardPage.component';
import { ClaimPageComponent } from './ui/pages/claim-page/claimPage.component';
import { UserSettingsPageComponent } from './ui/pages/user-settings-page/userSettingsPage.component';
import { NewClaimPageComponent } from './ui/pages/new-claim-page/newClaimPage.component';
import { SandboxPageComponent } from './ui/sandbox/sandboxPage.component';
import { PersonalInfoPageComponent } from './ui/pages/personal-info-page/personalInfoPage.component';
import { RegisterMoreDetailsPageComponent } from './ui/pages/registration-pages/register-more-details-page/registerMoreDetailsPage.component';

const routes: Routes = [
  {
    path: 'logged-out',
    component: LoggedOutPageComponent,
  },
  {
    path: 'log-in',
    component: LoginPageComponent,
  },
  {
    path: 'register/1',
    component: RegisterPageComponent,
  },
  {
    path: 'register/2',
    component: RegisterMoreDetailsPageComponent,
  },
  {
    path: 'home',
    component: ClaimsDashboardPageComponent,
    //canActivate: [ LoggedInGuard ]
  },
  {
    path: 'claim',
    component: ClaimPageComponent,
    canActivate: [ LoggedInGuard ]
  },
  {
    path: 'new-claim',
    component: NewClaimPageComponent,
    canActivate: [ LoggedInGuard ]
  },
  {
    path: 'settings',
    component: UserSettingsPageComponent,
    canActivate: [ LoggedInGuard ]
  },
  {
    path: 'payment-information',
    component: PaymentInfoPageComponent,
    canActivate: [ LoggedInGuard ]
  },
  {
    path: 'personal-information',
    component: PersonalInfoPageComponent,
    canActivate: [ LoggedInGuard ]
  },
  { path: 'sandbox', component: SandboxPageComponent },
  //{ path: '**', component: ClaimsDashboardComponent }
  {
    path: '',
    redirectTo: 'logged-out',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
