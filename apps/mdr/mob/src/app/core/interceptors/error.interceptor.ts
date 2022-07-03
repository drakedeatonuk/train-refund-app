import { badRequest, err, Result, NO_CONNECTION } from '@multi/shared';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse, res: Observable<any>) => {
        console.log(error, res);
        return throwError(() => err(badRequest(error?.error?.message ? error.error.message : error.message)));
      })
    );
  }
}
