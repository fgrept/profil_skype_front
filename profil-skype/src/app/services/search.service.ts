import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public searchSubject = new Subject();

  constructor() { }

  // inutile : l'émission de la data est faite depuis le component source sur
  // le service injecté
  // getSearchText(textReceived:string) {
  //   this.searchSubject.next(textReceived);
  // }
}
