import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const jwt = localStorage.getItem("jwtoken");

      if (!jwt) return next.handle(req);

      const reqWithJWT = req.clone({ headers: req.headers.set("Authorization", `Bearer ${jwt}`) });
      
      return next.handle(reqWithJWT);
    }
}
