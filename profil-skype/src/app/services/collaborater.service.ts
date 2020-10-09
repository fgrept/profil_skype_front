import { Injectable } from '@angular/core';
import {Collaborater} from '../models/collaborater/collaborater';
import {Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const urlCollaboraterSearch = 'http://localhost:8181/v1/collaborater/list/criteria/';

@Injectable({
  providedIn: 'root'
})


export class CollaboraterService {

  private collaboraters: Collaborater[];
  private collaboraterGetSubject = new Subject();
  private collaborater: Collaborater;
  countApi: number;
    private tokenId: string;

  constructor(private httpClient: HttpClient) { }

   getCollaboratersFromServer(collaboratersSearch: Collaborater) {

       this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.post<any[]>(urlCollaboraterSearch + '0/100/collaboraterId', collaboratersSearch,
        {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
        .subscribe(
        (response) => {
          console.log('headers', response.headers.keys());
          console.log('count', response.headers.get('count'));
          this.collaboraters = response.body;
          this.countApi = Number(response.headers.get('count'));
          this.collaboraterGetSubject.next(response.body);
        },
        (error) => {
            this.collaboraterGetSubject.next(error);
            console.log('erreur backend', error.status);
        }
    );
  }
  getCollaboraterByCollaboraterId(id: string): Collaborater {

      if (this.collaboraters.length === 0){
          this.collaborater = new Collaborater(
              id, '', '', '', '', '',
              '', '', '', '', '', '', '',
          '');
          this.getCollaboratersFromServer(this.collaborater);
      }

      for (let coll of this.collaboraters) {
          if (coll.collaboraterId === id) {
              return coll;
          }
      }
  }

  getCollaboraterGetSubject() {
      return this.collaboraterGetSubject;
  }
}
