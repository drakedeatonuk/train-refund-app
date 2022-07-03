import { NavigationService } from '../../core/navigation/navigation.service';
import { StorageService } from '../../core/storage/storage.service';
import { Users } from '@multi/mdr';
import { Injectable } from "@angular/core";
import objectPath from "object-path";
import { BehaviorSubject, Observable } from "rxjs";
import { Result, err, badRequest } from "@multi/shared";
import { LocalData } from '../../core/storage/constants/storage.constants';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {

  constructor(
    private storageSvc: StorageService,
    private navigationSvc: NavigationService,
  ){}

  //********************* User Store *********************//
  //* Stores a user object containing all data related to the user

  private _user: Users.User | null;
  private userSubject: BehaviorSubject<Users.User>;
  public user$: Observable<Users.User>;

  public get user(): Users.User {
    return this._user;
  }

  async initUserStore() {
    if (await this.storageSvc.get(LocalData.User) == null) {
      await this.storageSvc.set(LocalData.User, {});
      return await this.navigationSvc.logout();
    }
    this._user = await this.storageSvc.get(LocalData.User) as Users.User;
    this.userSubject = new BehaviorSubject<Users.User>(this._user);
    this.user$ = this.userSubject.asObservable();
  }

  async storeUserData<T>(value: T | Users.User, path?: string): Promise<Result<void>> {
    console.log("TEST3.10", "in storeUserData...");
    if (path === undefined) {
      // replacing entire this._user object...
      this._user = value as Users.User;
    } else {
      // updating a nested this._user fields in the store (e.g. value: [...], path: "claims")
      if (!objectPath.has(this._user, path)) return err(badRequest('bad path provided'));
      objectPath.set(this._user, path, value);
    }
    await this.storageSvc.set(LocalData.User, this._user);
    this.userSubject.next(this._user);
    console.log(console.log("TEST3.11", "leaving storeUserData..."));
  }


  //********************* Registration Store *********************//
  //* Data is used when a user is creating an account (i.e. in registration components)

  private myRegData: Users.PersonalDetails;

  public get regData(): Users.PersonalDetails {
    return this.myRegData;
  }

  public set regData(fields: any) {
    this.myRegData = fields;
  }
}
