import { Directive, Inject } from '../forks/angular-datetime-picker/node_modules/@angular/core/core';
// libs
import { BaseComponent } from '@multi/xplat/core';

@Directive()
export abstract class AppBaseComponent extends BaseComponent {
  /**
   * Define common root app component behavior for all web apps here
   */
}
