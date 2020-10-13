import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';


@Injectable()
export class LoaderService {

  public loaderSubject = new Subject();
  isLoading = false;
  constructor() { }

  showLoader() {
    console.log('========>showLoader()');
    this.isLoading = true;
    this.loaderSubject.next(true);
  }

  hideLoader() {
    console.log('========>hideLoader()');
    this.isLoading = false;
    this.loaderSubject.next(false);
  }


}
