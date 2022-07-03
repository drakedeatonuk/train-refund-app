import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { LocalData } from '../storage/constants/storage.constants';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  private router: Router;
  private storageSvc: StorageService;

  constructor(private injector: Injector) {
    this.router = this.injector.get(Router);
    this.storageSvc = this.injector.get(StorageService);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // let the user access restricted routes if they have an mdr.jwtoken stored in local storage

    try {
      return this.storageSvc.get(LocalData.Jwt)
      .then((val) => {
        if (val) return true;
        else return this.router.navigate(['/logged-out']), false;
      })
    } catch (e) {
      console.error(e);
      return this.router.navigate(['/logged-out']), false;
    }
  // testing
  }

}
