import { transition, state, style, animate, trigger } from '@angular/animations';
import { Component, Input, Renderer2, ElementRef } from '@angular/core';
import { InViewportMetadata } from 'ng-in-viewport';
import { err } from '../../utils/utils';
@Component({
	selector: 'app-photo-fade-in',
	templateUrl: './photo-fade-in.component.html',
	animations: [
		trigger('appear', [
			state(
				'invisible',
				style({
					opacity: 0,
					position: 'relative',
					top: '50px'
				})
			),
			state(
				'visible',
				style({
					opacity: 1,
					position: 'relative',
					top: '0'
				})
			),
			transition('invisible => visible', [ animate('900ms 30ms ease-in-out') ])
		])
	]
})
export class PhotoFadeInComponent {
	@Input() src: string = '';
	@Input() alt: string = '';
	@Input() class: string = '';

	public startAnimation = false;

	constructor(private renderer: Renderer2) {}

	onAppear(e: any) {
		const { [InViewportMetadata]: { entry }, target, visible } = e;
		if (visible) this.startAnimation = visible;
		console.log(e);
	}

}
