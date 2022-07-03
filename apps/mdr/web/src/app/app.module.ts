import { HttpInterceptor } from '@angular/common/http';
/* angular */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/* components */
import { HeaderComponent } from './modules/home/components/wrapper/header/header.component';
import { AppComponent } from './app.component';

/* prime */
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { StyleClassModule } from 'primeng/styleclass';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FooterComponent } from './modules/home/components/wrapper/footer/footer.component';
import { OpenCloseComponent } from './shared/animations/open-close/open-close.component';
import { PhotoFadeInComponent } from './shared/animations/photo-fade-in/photo-fade-in.component';
import { FadeInLeftComponent } from './shared/animations/fade-in-left/fade-in-left.component';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

/* other */
import { HighlightDirective } from './shared/directives/highlight.directive';
import { InViewportModule } from 'ng-in-viewport';
import { PricingPageComponent } from './modules/home/pages/pricing/pricing-page.component';
import { LandingPageComponent } from './modules/home/pages/landing/landing-page.component';
import { NotFoundPageComponent } from './modules/home/pages/not-found/not-found-page.component';
import { ContactFormComponent } from './modules/home/components/landing/contact-form.component';
import { TeamPageComponent } from './modules/home/pages/team/team-page.component';
import { MainPageComponent } from './modules/dashboard/pages/main/main-page.component';
import { MainSideNavComponent } from './modules/dashboard/components/wrapper/main-nav/main-nav.component';
import { HomeWrapperComponent } from './modules/home/home-wrapper.component';
import { DashboardWrapperComponent } from './modules/dashboard/dashboard-wrapper.component';
import { LoginModalComponent } from './shared/components/login/login-modal.component';
import { httpInterceptorProviders } from './core/interceptors';
import { RegisterComponent } from './shared/components/register/register.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		OpenCloseComponent,
		HighlightDirective,
		PhotoFadeInComponent,
		FadeInLeftComponent,
		PricingPageComponent,
		LandingPageComponent,
		NotFoundPageComponent,
		ContactFormComponent,
		TeamPageComponent,
    MainPageComponent,
    MainSideNavComponent,
    HomeWrapperComponent,
    DashboardWrapperComponent,
    LoginModalComponent,
    RegisterComponent,
	],
	imports: [
    RouterModule,
    CheckboxModule,
		ButtonModule,
		RippleModule,
		AvatarModule,
		BrowserModule,
		SidebarModule,
		InputTextModule,
		AppRoutingModule,
		InViewportModule,
		StyleClassModule,
		HttpClientModule,
		InputSwitchModule,
		ReactiveFormsModule,
		InputTextareaModule,
		BrowserAnimationsModule,
	],
	providers: [httpInterceptorProviders],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
