import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  public showLogin = false;
  public showRegister = false;

  constructor() { }

  ngOnInit(): void {
  }

}
