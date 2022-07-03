import { PendingRequest, PendingRequests, HttpOptions, HttpMethod } from '../constants/http.constants';
import { Injectable } from '@angular/core';
import { badRequest, err, ok, Result } from '@multi/shared';
import { StorageService } from '../../storage/storage.service';
import { LocalData } from '../../storage/constants/storage.constants';
import { v4 as uuid } from 'uuid';
import { NewPhoto } from '../../../services/photo/constants/photo.constants';
import { HttpOfflineStoreService } from './httpOfflineStore.service';

@Injectable({
  providedIn: 'root',
})
export class HttpOfflineService {

  constructor(private storageSvc: StorageService) {}

}
