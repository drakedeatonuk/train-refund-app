import { badRequest, err, NO_CONNECTION } from '@multi/shared';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { HttpService } from '../http/services/http.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  constructor(private httpSvc: HttpService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.httpSvc.store.networkStatus$.value.connected == false) return throwError(() => err(badRequest(NO_CONNECTION)));
    else return next.handle(req);
  }
}
