import { NgModule, Optional, SkipSelf } from '../forks/angular-datetime-picker/node_modules/@angular/core/core';
import { RouteReuseStrategy } from '../forks/angular-datetime-picker/node_modules/@angular/router/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { throwIfAlreadyLoaded } from '@multi/xplat/utils';
import { MultiCoreModule } from '@multi/xplat/web/core';

@NgModule({
  imports: [MultiCoreModule, IonicModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class MultiIonicCoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: MultiIonicCoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'MultiIonicCoreModule');
  }
}
