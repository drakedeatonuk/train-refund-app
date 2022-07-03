import { AppConfig } from '../../configs/app.config';
import { Component, OnInit } from '@angular/core';
import { err } from '../../shared/utils/utils';

@Component({
  selector: 'app-home-wrapper',
  templateUrl: './home-wrapper.component.html',
})
export class HomeWrapperComponent implements OnInit {
  public title = 'front';
  public isVisible = false;
  public color = "yellow";

  constructor(public appConfig: AppConfig) { }

  ngOnInit(): void {
  }

  changeTheme(event: Event, theme: string, dark: boolean) {
      let themeElement = document.getElementById?.('theme-link') ?? err();
      let hrefValue = themeElement.getAttribute?.('href') ?? err();
      themeElement.setAttribute('href', hrefValue.replace(this.appConfig.theme, theme));

      [this.appConfig.theme, this.appConfig.dark] = [theme, dark]
      event.preventDefault();
  }

}
