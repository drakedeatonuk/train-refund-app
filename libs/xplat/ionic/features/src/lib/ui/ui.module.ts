import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '../forks/angular-datetime-picker/node_modules/@angular/core/core';
import { IonicModule } from '@ionic/angular';

import { UIModule as UIWebModule } from '@multi/xplat/web/features';
import { HeaderComponent } from './components';

@NgModule({
  imports: [UIWebModule, IonicModule],
  declarations: [HeaderComponent],
  exports: [UIWebModule, IonicModule, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UIModule {}
