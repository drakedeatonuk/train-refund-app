import { NgModule } from '../forks/angular-datetime-picker/node_modules/@angular/core/core';
import { CommonModule } from '../forks/angular-datetime-picker/node_modules/@angular/common/common';
import { FormsModule, ReactiveFormsModule } from '../forks/angular-datetime-picker/node_modules/@angular/forms/forms';
import { RouterModule } from '../forks/angular-datetime-picker/node_modules/@angular/router/router';

// libs
import { UISharedModule } from '@multi/xplat/features';
import { UI_COMPONENTS } from './components';

const MODULES = [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, UISharedModule];

@NgModule({
  imports: [...MODULES],
  declarations: [...UI_COMPONENTS],
  exports: [...MODULES, ...UI_COMPONENTS],
})
export class UIModule {}
