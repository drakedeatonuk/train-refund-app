import { ElementRef, Output, Directive, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Directive({
	selector: '[appear]'
})
export class AppearDirective implements AfterViewInit, OnDestroy {
	@Output() appear: EventEmitter<void>;

	elementPos: number = 0;
	elementHeight: number = 0;

	scrollPos: number = 0;
	windowHeight: number = 0;

	subscriptionScroll;
	subscriptionResize;

	constructor(private element: ElementRef, subscriptionScroll: Subscription, subscriptionResize: Subscription) {
    console.log('ElementRef');
    console.log(ElementRef);
    console.log('sunscriptionScroll');
    console.log(subscriptionScroll);
		this.appear = new EventEmitter<void>();
		this.subscriptionScroll = subscriptionScroll;
		this.subscriptionResize = subscriptionResize;
	}

	saveDimensions() {
    console.log('in saveDimensions');
		this.elementPos = this.getOffsetTop(this.element.nativeElement);
		this.elementHeight = this.element.nativeElement.offsetHeight;
		this.windowHeight = window.innerHeight;
	}
	saveScrollPos() {
    console.log('in saveScrollPos');
		this.scrollPos = window.scrollY;
	}
	getOffsetTop(element: any) {
    console.log('in getOffsetTop');
		let offsetTop = element.offsetTop || 0;
		if (element.offsetParent) {
			offsetTop += this.getOffsetTop(element.offsetParent);
		}
		return offsetTop;
	}
	checkVisibility() {
		console.log('in checkVisibility');
		if (this.isVisible()) {
			// double check dimensions (due to async loaded contents, e.g. images)
			this.saveDimensions();
			if (this.isVisible()) {
				this.unsubscribe();
				this.appear.emit();
			}
		}
	}
	isVisible() {
    console.log('in isVisible')
		return (
			this.scrollPos >= this.elementPos ||
			this.scrollPos + this.windowHeight >= this.elementPos + this.elementHeight
		);
	}

	subscribe() {
    console.log('in subscribe')
		this.subscriptionScroll = fromEvent(window, 'scroll').pipe(startWith(null)).subscribe(() => {
			this.saveScrollPos();
			this.checkVisibility();
		});
		this.subscriptionResize = fromEvent(window, 'resize').pipe(startWith(null)).subscribe(() => {
			this.saveDimensions();
			this.checkVisibility();
		});
	}

	unsubscribe() {
    console.log('in unsubscribe');
		if (this.subscriptionScroll) {
			this.subscriptionScroll.unsubscribe();
		}
		if (this.subscriptionResize) {
			this.subscriptionResize.unsubscribe();
		}
	}

	ngAfterViewInit() {
    console.log('in ngAfterViewInit');
		this.subscribe();
	}
	ngOnDestroy() {
    console.log('in ngOnDestroy');
		this.unsubscribe();
	}
}
