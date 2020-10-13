import { Injectable } from '@angular/core';
import {Collaborater} from '../models/collaborater/collaborater';
import {Subject} from 'rxjs';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';

const urlCollaboraterSearch = 'http://localhost:8181/v1/collaborater/list/criteria/';
const urlGetCollaborater = 'http://localhost:8181/v1/collaborater/get/';

@Injectable({
  providedIn: 'root'
})


export class CollaboraterService {

  private collaboraters: Collaborater[];
  private collaboraterGetSubject = new Subject();
  collaborterGetUniqSubject = new Subject();
  private collaborater: Collaborater;
  private collaboraterGet: Collaborater;
  countApi: number;
    private tokenId: string;

  constructor(private httpClient: HttpClient) { }

   getCollaboratersFromServer(collaboratersSearch: Collaborater) {

       this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.post<any[]>(urlCollaboraterSearch + '0/100/collaboraterId', collaboratersSearch,
        {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
        .subscribe(
        (response) => {
          // console.log('headers', response.headers.keys());
          // console.log('count', response.headers.get('count'));
          this.collaboraters = response.body;
          console.log('collaboraters from services', this.collaboraters);
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

      if (this.collaboraters){
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
  getCollaboraterFromServeurById(id: string){
      this.tokenId = 'Bearer ' + localStorage.getItem('token');
      console.log('token: ', this.tokenId);
      this.httpClient.get<Collaborater>(urlGetCollaborater + id,
          {observe: 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
          .subscribe(
              (response: HttpResponse<Collaborater>) => {
                  this.collaboraterGet = response.body;
                  this.collaborterGetUniqSubject.next(response);
                },
              (error) => {
                  this.collaborterGetUniqSubject.next(error);
                  console.log('erreur backend', error.status);
              }
          );

  }

  getCollaboraterGetSubject() {
      return this.collaboraterGetSubject;
  }
}
