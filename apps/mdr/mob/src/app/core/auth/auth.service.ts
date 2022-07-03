import { HttpService } from '../http/services/http.service';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { LocalData } from '../storage/constants/storage.constants';
import { Users } from '@multi/mdr';
import { Result, ok } from '@multi/shared';
import { UserService } from '../../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private storageSvc: StorageService, private httpSvc: HttpService, private userSvc: UserService){}

  async requestPasswordResetEmail(email: string): Promise<Result<void>> {
    return await this.httpSvc.post<Result<void>>('/api/forgot-password', { body: email });
  }

  async requestVerificationEmail(email: string): Promise<void> {
    return await this.httpSvc.post<void>('/api/user/verification-email', {
      body: { email: email }
    })
  }

  async login(loginUser: Users.LoginUser): Promise<Result<void>> {
    const loginAttempt = await this.httpSvc.post<Result<Users.LoginData>>('/api/login', { body: loginUser });
    if (loginAttempt.ok == false) return loginAttempt;
    await this.storageSvc.set(LocalData.Jwt, loginAttempt.value.jwToken);
    await this.userSvc.store.storeUserData(loginAttempt.value.user);
    return ok();
  }

  async register(userFields: Users.NewUser): Promise<Result<void>> {
    const regAttempt = await this.httpSvc.post<Result<Users.LoginData>>('/api/register', { body: userFields });
    if (regAttempt.ok == false) return regAttempt;
    await this.storageSvc.set(LocalData.Jwt, regAttempt.value.jwToken);
    await this.userSvc.store.storeUserData(regAttempt.value.user);
    return ok();
  }

}
