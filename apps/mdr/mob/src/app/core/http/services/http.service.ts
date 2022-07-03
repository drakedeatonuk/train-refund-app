import { HttpOptions, HttpMethod, PendingRequest, PendingRequests, PendingRequestTypes } from './../constants/http.constants';
import { Injectable, OnDestroy } from '@angular/core';
import { delay, firstValueFrom, Subscription, TimeoutError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpStoreService } from './httpStore.service';
import { badRequest, err, Result, BAD_CONNECTION, ok } from '@multi/shared';
import { PhotoService } from '../../../services/photo/services/photo.service';
import { StorageService } from '../../storage/storage.service';
import { LocalData } from '../../storage/constants/storage.constants';
import { ToastController } from '@ionic/angular';
import { HttpOfflineStoreService } from './httpOfflineStore.service';
import { UserStoreService } from '../../../services/user/userStore.service';
import { Users } from '@multi/mdr';

@Injectable({
  providedIn: 'root',
})
export class HttpService implements OnDestroy {

  private pendingRequestsSub: Subscription;
  private managingPendingRequests = false;

  constructor(private http: HttpClient, private _httpStore: HttpStoreService, private userStore: UserStoreService, private photoSvc: PhotoService, private storageSvc: StorageService, private _offlineStore: HttpOfflineStoreService, private toastCntrl: ToastController) {

  }

  async get<T>(url: string, options?: HttpOptions): Promise<T> {
    try {
      return await firstValueFrom(this.http.request<T>(HttpMethod.GET, url, options ? options : undefined));
    } catch (e) {
      return e;
    }
  }

  async post<T>(url: string, options: HttpOptions): Promise<T> {
    try {
      return await firstValueFrom(this.http.request<T>(HttpMethod.POST, url, options));
    } catch (e) {
      return e;
    }
  }

  async put<T>(url: string, options: HttpOptions): Promise<T> {
    try {
      return await firstValueFrom(this.http.request<T>(HttpMethod.PUT, url, options));
    } catch (e) {
      return e;
    }
  }

  async fetchUserLoginData(): Promise<Result<void>> {
    const loginDataUpdater = await this.get<Result<Users.User>>(`/api/user/${this.userStore.user.id}`);
    if (loginDataUpdater.ok == false) return loginDataUpdater;
    this.userStore.storeUserData(loginDataUpdater.value);
  }

  get store(): HttpStoreService {
    return this._httpStore;
  }

  //********************* Offline Service *********************//
  //* All the below functions pertain to the management of pending requests

  async initOfflineService(): Promise<void> {
    this.pendingRequestsSub = this.offlineStore.storedRequests$.pipe(delay(5000)).subscribe(() => this.managePendingRequests())
  }

  // use this method for storing post requests if the post fails due to connectivity issues
  async postOrStore<T>(url: string, options: HttpOptions): Promise<Result<T>> {
    console.log("TEST3.2", "in tryPost...");
    try {
      return await firstValueFrom(this.http.request<Result<T>>(HttpMethod.POST, url, options));
    } catch (e) {
      console.log("TEST3.3", "unable to sent POST. Error was:", e);
      if (this._httpStore.networkStatus$.value.connected == false || e instanceof TimeoutError || e.error instanceof ErrorEvent) {
        this.offlineStore.storePendingHttpRequest(url, HttpMethod.POST, options);
        return err(badRequest(BAD_CONNECTION));
      }
      return e;
    }
  }

  private async retryPendingHttpRequest<T>(pendingRequest: PendingRequest<'REST'>): Promise<Result<void>> {
    try {
      const requester = await firstValueFrom(this.http.request<Result<T>>(pendingRequest.method, pendingRequest.url, pendingRequest.data));
      if (requester.ok == false) return err(badRequest('deleteRequest failed'));
      console.log(`request sent to: ${pendingRequest.url}`);
      await this.offlineStore.deletePendingRequest(pendingRequest.id);
      console.log('request deleted from storage');
      return ok();
    } catch (e) {
      console.log('error sending request');
      console.log(e);
      return err(badRequest('deleteRequest failed'));
    }
  }

  private async managePendingRequests(): Promise<void> {
    console.log("TESTX", "in managePendingRequests...");
    console.log('managingPendingRequests:', this.managingPendingRequests);
    if (this.managingPendingRequests == true) return;

    let requests = await this.storageSvc.get<PendingRequests>(LocalData.Requests);
    // let reqKeys = Object.keys(requests);
    console.log("current pending requests:", requests);
    console.log('requests.length:', requests.length);
    if (!requests.length) return;

    this.managingPendingRequests = true;
    while (this.managingPendingRequests == true) {
      console.log('in managingRequests loop...')
      console.log('requests left to send are:');
      console.log("requests", requests);
      console.log("reqs", requests);
      for (let req of requests) {
        console.log("req:", req);
        console.log('Req to send is:', req);
        console.log("Req.type is:", req.type);
        if (req.type === PendingRequestTypes.Rest) {
          console.log('retyringHttpRequest...')
          const result = await this.retryPendingHttpRequest(req);
          console.log('http retry result:', result.ok);
        }
        else if (req.type === PendingRequestTypes.Image) {
          console.log('retrying photo upload...')
          const result = await this.photoSvc.resubmitPhotoUpload(req);
          console.log('photo upload retry result:', result);
        }
        if (!this._httpStore.networkStatus$.value.connected) await new Promise(resolve => setTimeout(resolve, 5000))
        requests = await this.storageSvc.get<PendingRequests>(LocalData.Requests);
        if (!requests.length) this.managingPendingRequests = false;
      }
    };
    this.presentSuccessToast();
    console.log('all pending requests sent!');
    await this.fetchUserLoginData();
    console.log('user login data fetched & updated!');
  }

  async presentSuccessToast(): Promise<void> {
    const toast = await this.toastCntrl.create({
      header: 'Claims Synced',
      message: 'All claims you submitted while offline have been synced with our servers!',
      icon: 'checkmark-circle-outline',
      color: 'p',
      position: 'bottom',
      duration: 5000,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
        },
      ],
    });
    //this.userService = this.injectorSvc.get(UserService);
    await toast.present();
  }

  get offlineStore(): HttpOfflineStoreService {
    return this._offlineStore;
  }

  ngOnDestroy() {
    this.pendingRequestsSub.unsubscribe();
  }
}
