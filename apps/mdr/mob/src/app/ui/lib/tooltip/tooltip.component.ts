import { TooltipPosition } from '@angular/material/tooltip';
import { Component, Input, OnInit, } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
})
export class AppTooltipComponent implements OnInit {

  @Input() @Required() message: string;
  @Input() position: TooltipPosition

  ngOnInit() {
    this.position = this.position ? this.position : "right";

  }
}


function Required() {
    return function (target: any, key: string): void {
        const original: Function | null = target['ngOnInit'];
        target['ngOnInit'] = function () {
            if (this[key] === undefined) throw new Error(`Property ${key} is required`);
            if (original) original.apply(this);
        };
    };
}
