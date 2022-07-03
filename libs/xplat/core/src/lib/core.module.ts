import { ModuleWithProviders, NgModule, Optional, SkipSelf, Inject } from '../forks/angular-datetime-picker/node_modules/@angular/core/core';
import { APP_BASE_HREF, CommonModule } from '../forks/angular-datetime-picker/node_modules/@angular/common/common';

// libs
import { TranslateService } from '@ngx-translate/core';
import { throwIfAlreadyLoaded } from '@multi/xplat/utils';

// app
import { environment } from './environments/environment';
import { LogService } from './services/log.service';
import { PlatformLanguageToken } from './services/tokens';
import { WindowService } from './services/window.service';

/**
 * DEBUGGING
 */
LogService.DEBUG.LEVEL_4 = !environment.production;

@NgModule({
  imports: [CommonModule],
})
export class CoreModule {
  // configuredProviders: *required to configure WindowService and others per platform
  static forRoot(configuredProviders: Array<any>): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        LogService,
        WindowService,
        {
          provide: APP_BASE_HREF,
          useValue: '/',
        },
        ...configuredProviders,
      ],
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    @Inject(PlatformLanguageToken) lang: string,
    translate: TranslateService
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');

    // ensure default platform language is set
    translate.use(lang);
  }
}
