import { Injectable } from '@angular/core';
import { Users } from '@multi/mdr';
import { ok, Result } from '@multi/shared';
import { ModalController } from '@ionic/angular';
import { UserStoreService } from './userStore.service';
import { HttpService } from '../../core/http/services/http.service';
import { StorageService } from '../../core/storage/storage.service';
import { LocalData } from '../../core/storage/constants/storage.constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpSvc: HttpService, public modalController: ModalController, private _userStore: UserStoreService) {}

  async postUserUpdate(userFields: Users.PartialUser): Promise<Result<Users.User>> {
    const updateAttempt = await this.httpSvc.put<Result<Users.User>>(`/api/user/${this._userStore.user.id}`, {
      body: userFields
    });
    if (updateAttempt.ok == false) return updateAttempt;
    this._userStore.storeUserData(updateAttempt.value);
    return updateAttempt;
  }

  get store(): UserStoreService {
    return this._userStore;
  }
}
