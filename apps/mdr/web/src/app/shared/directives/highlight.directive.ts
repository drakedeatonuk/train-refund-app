import { Directive, ElementRef, HostListener, HostBinding, Input, Renderer2 } from '@angular/core';

@Directive({
	selector: '[appHighlight]'
})
export class HighlightDirective {
	@Input('defaultColor') defaultColor: string = '';

	//@Input('appHighlight') appHighlight: string = '';
	//@HostBinding('style.backgroundColor') background: string = this.appHighlightColor;

	constructor(private el: ElementRef) {
		console.log('HELLO');
	}

	@HostListener('mouseenter')
	onMouseEnter(e: any) {
		console.log('enter');
		this.highlight(this.defaultColor || 'red');
	}

	@HostListener('mouseleave')
	onMouseLeave(e: any) {
		console.log('mouseleave');
		this.highlight('');
	}

	highlight(color: string) {
		console.log(color);
		console.log(this.defaultColor);
		this.el.nativeElement.style.backgroundColor = color;
	}
}
