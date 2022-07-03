import { transition, state, style, animate, trigger } from '@angular/animations';
import { Component, AfterViewInit } from '@angular/core';

@Component({
	selector: 'app-fade-in-left',
	templateUrl: './fade-in-left.component.html',
	animations: [
		trigger('slideIn', [
			state(
				'invisible',
				style({
					opacity: 0,
					position: 'relative',
					left: '75px'
				})
			),
			state(
				'visible',
				style({
					opacity: 1,
					position: 'relative',
					left: '0'
				})
			),
			transition('invisible => visible', [ animate('1000ms 0ms ease-in-out') ])
		])
	]
})
export class FadeInLeftComponent implements AfterViewInit {
	public startAnimation = false;

	constructor() {}

	ngAfterViewInit() {
		this.startAnimation = true;
	}
}
