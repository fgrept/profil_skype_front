import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { delay, tap } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


    this.loaderService.showLoader();

    return next.handle(request)
        .pipe(
        tap( (event: HttpEvent<any>) => {

          if (event instanceof HttpResponse || event instanceof HttpErrorResponse) {
            // on part du principe que nous n'avons qu'une seule requête http à la fois
            this.loaderService.hideLoader();

          }
        })
    );
  }
}
