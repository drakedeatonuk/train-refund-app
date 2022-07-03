import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
	selector: 'app-pricing-page',
	templateUrl: './pricing-page.component.html'
})
export class PricingPageComponent implements OnInit {
	private name: string = '';

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.queryParams.subscribe((params) => {
			this.name = params['name'];
		});
	}
}
