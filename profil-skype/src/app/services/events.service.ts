import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { EventModel } from '../models/eventModel' ;


const baseUrl = 'http://localhost:8181/v1/event/list/';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private tokenId: string;
  private eventsSubject = new BehaviorSubject([]) ;

  public events$:Observable<EventModel[]> =this.eventsSubject.asObservable() ;

  constructor(private httpClient: HttpClient) { }

  getEventsOfProfilFromServer(sip:string) {
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    return this.httpClient.get(baseUrl+sip,
        {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
        .toPromise()
    .then (
      (response:any) => {this.eventsSubject.next(response.body)}
    )
    .catch
    (erreur=>console.log('error :',erreur))
  }


 //
 //  loadUsersWithMetaPagination(pageNumber:number) {
 //    return this.httpClient.get(baseUrl + '/events' + '?page=' + pageNumber,
 //        {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true}).
 //    toPromise()
 //    .then(
 //      (response:any) => {this.eventsSubject.next(response)}
 //      )
 //    .catch
 //      (erreur=>console.log('error of pagination :',erreur))
 // }

}
