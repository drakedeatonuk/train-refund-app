import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class AppConfig {

    theme: string = 'soho-dark';

    dark: boolean = false;

    inputStyle: string = 'outlined';

    ripple: boolean = true;

}
