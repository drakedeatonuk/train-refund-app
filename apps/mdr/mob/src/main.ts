import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 import { defineCustomElements } from '@stripe-elements/stripe-elements/loader';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements as defineCustEls } from '@ionic/pwa-elements/loader';
import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
    .then(() => defineCustomElements(window))
  .catch(e => console.error(e));

  defineCustEls(window);
