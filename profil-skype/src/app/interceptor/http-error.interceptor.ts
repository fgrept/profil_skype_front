import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {UserService} from '../services/user.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
        .pipe(
            map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                console.log('Interceptor - Event: ', event);
              }
              return event;
            }
        ),
            catchError((error: HttpErrorResponse) => {
              console.log('Interceptor - Error: ', error);
              if (error.status !== 401){
                console.log('Interceptor - Error: ', error.status);
              }else {
                this.userService.updateRole(0);
              }
              return throwError(error);
            })
        );
  }
}
