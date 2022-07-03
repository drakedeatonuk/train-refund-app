import { Injectable, OnDestroy } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Platform } from '@ionic/angular';
import { PluginListenerHandle } from '@capacitor/core';
import { SpeedTestModule, SpeedTestService } from 'ng-speed-test';
import { err, badRequest, ok, Result } from '@multi/shared';

@Injectable({
  providedIn: 'root',
})
export class HttpStoreService implements OnDestroy {
  constructor(private speedTestSvc: SpeedTestService, private platform: Platform) {}

  //********************* Network Status Store *********************//
  //* stores a behaviourSubject containing details on the current network connection

  async initConnectionStore(): Promise<void> {
    this.platform.ready().then(readySource => {
      console.log(`Platform ready on:`, readySource);
      this.updateNetworkStatus();
      this.networkListener = Network.addListener('networkStatusChange', () => this.updateNetworkStatus());
    });
  }

  public networkStatus$: BehaviorSubject<ConnectionStatus> = new BehaviorSubject<ConnectionStatus>({
    connected: false,
    connectionType: 'none',
  });
  private networkListener: PluginListenerHandle;

  public async updateNetworkStatus(): Promise<Result<void>> {
    try {
      const status: ConnectionStatus = await Network.getStatus();
      console.log('Network status is:', status);
      this.networkStatus$.next(status);
      return ok();
    } catch (e) {
      return err(badRequest(e));
    }
  }

  // details on file to retreive in network speed test
  private speedTestSettings: SpeedTestModule = {
    file: {
      path: 'https://raw.githubusercontent.com/jrquick17/ng-speed-test/02c59e4afde67c35a5ba74014b91d44b33c0b3fe/demo/src/assets/500kb.jpg',
      size: 408949,
      iterations: 1,
    },
  };

  public async getConnectionSpeed(): Promise<number> {
    return Math.round(await firstValueFrom(this.speedTestSvc.getKbps(this.speedTestSettings)));
  }

  ngOnDestroy() {
    this.networkListener.remove();
  }
}
