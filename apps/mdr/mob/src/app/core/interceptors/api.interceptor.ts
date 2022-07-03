import {Injectable, isDevMode} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

// Use this in production mode to intercept http requests and all the url of the backend server
@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isDevMode()) return next.handle(req);

    const apiReq = req.clone({ url: `https://localhost:3333${req.url}` });
    return next.handle(apiReq);
  }
}
