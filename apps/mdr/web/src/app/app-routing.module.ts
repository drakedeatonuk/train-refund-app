import { LoggedInGuard } from './core/guards/logged-in.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FooterComponent } from './modules/home/components/wrapper/footer/footer.component';
import { PricingPageComponent } from './modules/home/pages/pricing/pricing-page.component';
import { LandingPageComponent } from './modules/home/pages/landing/landing-page.component';
import { NotFoundPageComponent } from './modules/home/pages/not-found/not-found-page.component';
import { TeamPageComponent } from './modules/home/pages/team/team-page.component';
import { MainPageComponent } from './modules/dashboard/pages/main/main-page.component';
import { DashboardWrapperComponent } from './modules/dashboard/dashboard-wrapper.component';
import { HomeWrapperComponent } from './modules/home/home-wrapper.component';

const routes: Routes = [
	{
		path: '',
		component: HomeWrapperComponent,
		children: [
			{
				path: '',
				component: LandingPageComponent
			}
		]
	},
	{
		path: 'pricing',
		component: HomeWrapperComponent,
		children: [
			{
				path: '',
				component: PricingPageComponent
			}
		]
	},
	{
		path: 'team',
		component: HomeWrapperComponent,
		children: [
			{
				path: '',
				component: TeamPageComponent
			}
		]
	},
	{
		path: 'dashboard',
		component: DashboardWrapperComponent,
		children: [
			{
				path: '',
				component: MainPageComponent,
				//canActivate: [ LoggedInGuard ]
			}
		]
	},
	{ path: 'secret', redirectTo: '' },
	{ path: 'sandbox', component: NotFoundPageComponent },
	{ path: '**', component: NotFoundPageComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
