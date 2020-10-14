import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment} from '../../environments/environment';


const baseUrl = environment.urlServer + '/v1/event/list/';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private tokenId: string;
  public eventsSubject = new Subject();

  constructor(private httpClient: HttpClient) { }

  getEventsOfProfilFromServer(sip:string) {
    this.tokenId = 'Bearer ' + localStorage.getItem('token');

    this.httpClient.get<any[]>(baseUrl+sip,
      {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
    .subscribe(
      (response) => {
        console.log('retour back-end Ok : ', response);
        this.eventsSubject.next(response.body);
      },
      (error) => {
        console.log('retour back-end Ko : ', error);
      }
    );
  }

}
