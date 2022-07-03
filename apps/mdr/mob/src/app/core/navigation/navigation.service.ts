import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LocalData } from '../storage/constants/storage.constants';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {

  constructor(
    private router: Router,
    public modalController: ModalController,
    private storageSvc: StorageService
  ) {}

  async logout() {
    this.modalController.dismiss();
    await this.storageSvc.set(LocalData.Jwt, "")
    await this.storageSvc.set(LocalData.User, {});
    this.router.navigateByUrl('/logged-out');
  }

}
