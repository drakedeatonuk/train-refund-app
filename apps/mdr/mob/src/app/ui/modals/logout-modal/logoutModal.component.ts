import { NavigationService } from '../../../core/navigation/navigation.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logoutModal.component.html',
})
export class LogoutModalComponent implements OnInit {
  constructor(public modalController: ModalController, public userSvc: UserService, private navigationSvc: NavigationService) {}

  ngOnInit(): void {}

  closeModal(): void {
    this.modalController.dismiss();
  }

  async initLogout(): Promise<void> {
    await this.navigationSvc.logout();
  }
}
