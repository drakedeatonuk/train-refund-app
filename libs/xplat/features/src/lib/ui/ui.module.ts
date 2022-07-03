import { NgModule } from '../forks/angular-datetime-picker/node_modules/@angular/core/core';
import { TranslateModule } from '@ngx-translate/core';
import { UI_PIPES } from './pipes';

const MODULES = [TranslateModule];

@NgModule({
  imports: [...MODULES],
  declarations: [...UI_PIPES],
  exports: [...MODULES, ...UI_PIPES],
})
export class UISharedModule {}
