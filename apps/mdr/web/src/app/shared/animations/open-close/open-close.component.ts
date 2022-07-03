import { Component, OnInit } from '@angular/core';
import { transition, state, style, animate, trigger } from '@angular/animations';

@Component({
	selector: 'app-open-close',
	templateUrl: './open-close.component.html',
	animations: [
		trigger('openClose', [
			state(
				'open',
				style({
					height: '200px',
					opacity: 1,
          display: 'block'
				})
			),
			state(
				'closed',
				style({
					height: '0px',
					opacity: 0.8,
          size: '0px'
				})
			),
			transition('open => closed', [ animate('1s') ]),
			transition('closed => open', [ animate('0.5s') ])
		])
	]
})
export class OpenCloseComponent implements OnInit {
	isOpen = false;

	constructor() {}

	ngOnInit(): void {}

	toggle() {
		this.isOpen = !this.isOpen;
	}
}
