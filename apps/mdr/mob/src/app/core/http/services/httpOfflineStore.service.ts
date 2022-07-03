import { FirebasePhotoUploadData } from './../../../services/photo/constants/photo.constants';
import { UserService } from './../../../services/user/user.service';
import { HttpMethod, HttpOptions, PendingRequest, PendingRequests } from '../constants/http.constants';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { badRequest, err, ok, Result } from '@multi/shared';
import { StorageService } from '../../storage/storage.service';
import { LocalData } from '../../storage/constants/storage.constants';
import { v4 as uuid } from 'uuid';
import { NewPhoto } from '../../../services/photo/constants/photo.constants';

@Injectable({
  providedIn: 'root',
})
export class HttpOfflineStoreService {
  constructor(private storageSvc: StorageService) {}

  //********************* RequestsStorage Store *********************//
  //* stores a behaviourSubject containing details on the current network connection

  private _pendingRequests: PendingRequests;
  private storedRequestsSubject: BehaviorSubject<PendingRequests>;
  public storedRequests$: Observable<PendingRequests>;

  public get pendingRequests(): PendingRequests {
    return this._pendingRequests;
  }

  public async initPendingRequestsStore() {
    if ((await this.storageSvc.get(LocalData.Requests)) == undefined) await this.storageSvc.set(LocalData.Requests, []);
    this._pendingRequests = (await this.storageSvc.get(LocalData.Requests)) as PendingRequests;
    this.storedRequestsSubject = new BehaviorSubject<PendingRequests>(this._pendingRequests);
    this.storedRequests$ = this.storedRequestsSubject.asObservable();
  }

  public async deletePendingRequest(requestId: string): Promise<Result<void>> {
    try {
      const requests = await this.storageSvc.get<PendingRequests>(LocalData.Requests);
      for (let [index, req] of requests.entries()) if (req.id == requestId) requests.splice(index, 1);
      await this.storageSvc.set(LocalData.Requests, requests);
      return ok();
    } catch (e) {
      return err(badRequest('deleteRequest failed'));
    }
  }

  public async storePendingPhotoUploadRequest(newFirebasePhoto: FirebasePhotoUploadData): Promise<Result<void>> {
    console.log("TEST1.2", "in storePhotoUploadRequest...");
    const request: PendingRequest<'IMAGE'> = {
      type: 'IMAGE',
      id: uuid(),
      data: newFirebasePhoto,
      time: new Date().getTime(),
    };
    return this.storePendingRequest(request);
  }

  public async storePendingHttpRequest(url: string, method: HttpMethod, data: HttpOptions): Promise<Result<void>> {
    console.log("TEST3.4", "in storeHttpRequest...");
    const request: PendingRequest<'REST'> = {
      type: 'REST',
      id: uuid(),
      url: url,
      data: data,
      method: method,
      time: new Date().getTime(),
    };
    return this.storePendingRequest(request);
  }

  public async storePendingRequest(request: PendingRequest<'IMAGE'> | PendingRequest<'REST'>): Promise<Result<PendingRequest<any>>> {
    try {
      console.log("TEST1.3 OR 3.5", "in storeRequest...");
      let requests = await this.storageSvc.get<PendingRequests>(LocalData.Requests);
      console.log("TEST1.4 OR 3.6", "current pending requests found...", requests);
      console.log(requests);
      if (requests.length)
        for (let req of requests) if (req.id == request.id) return err(badRequest('request already exists'));

      const updatedRequests = [...requests, request] as PendingRequests;

      this._pendingRequests = updatedRequests;
      await this.storageSvc.set(LocalData.Requests, this._pendingRequests);
      this.storedRequestsSubject.next(this._pendingRequests);
      return ok(request);
    } catch (e) {
      console.log(e);
      return err(badRequest('storeHttpRequest failed'));
    }
  }

  // private async storePendingRequestData(requests: PendingRequests): Promise<Result<void>> {
  //   console.log("TEST1.5 OR 3.7", "in storePendingRequestData...");
  //   this._pendingRequests = requests;
  //   await this.storageSvc.set(LocalData.Requests, this._pendingRequests);
  //   this.storedRequestsSubject.next(this._pendingRequests);
  //   console.log("TEST1.5 OR 3.8", "storedRequest observable _pendingRequest has been updated...", this._pendingRequests);
  //   return ok();
  // }
}
