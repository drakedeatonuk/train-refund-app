import { HttpOfflineStoreService } from './core/http/services/httpOfflineStore.service';
import { HttpOfflineService } from './core/http/services/httpOffline.service';
import { UserService } from './services/user/user.service';
import { Subscription } from 'rxjs';
import { LoaderService } from './ui/lib/loader/loader.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { StorageService } from './core/storage/storage.service';
import { HttpService } from './core/http/services/http.service';
@Component({
  selector: 'multi-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  loadingSub: Subscription;

  constructor(
    private loadingSvc: LoaderService,
    private userSvc: UserService,
    private httpSvc: HttpService,
    private offlineStore: HttpOfflineStoreService,
    private swUpdate: SwUpdate,
    private storageSvc: StorageService
  ) {}

  async ngOnInit() {
    await this.storageSvc.initStorage();
    await this.offlineStore.initPendingRequestsStore();
    await this.httpSvc.initOfflineService();
    await this.httpSvc.store.initConnectionStore();
    await this.userSvc.store.initUserStore();
    await this.initServiceWorker();
    this.loadingSub = this.loadingSvc.loading$.subscribe(state => (this.loading = state));
  }

  async initServiceWorker() {
    if (!this.swUpdate.isEnabled) return;
    else console.log('Service Worker is running');

    const hasUpdate = await this.swUpdate.checkForUpdate();
    if (!hasUpdate) return;

    const hasBeenUpdated = await this.swUpdate.activateUpdate();
    if (!hasBeenUpdated) return;
    else console.log('Service Worker updated');
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }
}
