import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { LocalData } from '../storage/constants/storage.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storageSvc: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.storageSvc.get(LocalData.Jwt))
      .pipe(
        switchMap(jwt => {
          const reqWithJWT = req.clone({ headers: req.headers.set('Authorization', `Bearer ${jwt}`) });
          return next.handle(reqWithJWT);
      })
    );
  }

}
