import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchText:string;
  public searchSubject = new Subject();

  constructor() { }

  getSearchText(textReceived:string) {
    this.searchSubject.next(textReceived);
  }
}
