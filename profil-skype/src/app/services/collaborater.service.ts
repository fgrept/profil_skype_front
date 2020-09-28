import { Injectable } from '@angular/core';
import {Collaborater} from '../models/collaborater';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const urlCollaboraterSearch = 'http://localhost:8181/v1/collaborater/list/criteria/';

@Injectable({
  providedIn: 'root'
})


export class CollaboraterService {

  private collaboraters: Collaborater[];
  public collaboraterGetSubject = new Subject();
  private collaborater: Collaborater;

  constructor(private httpClient: HttpClient) { }

  getCollaboratersFromServer(collaboratersSearch: Collaborater) {
    this.httpClient.post<any[]>(urlCollaboraterSearch + '0/100/collaboraterId', collaboratersSearch).subscribe(
        (response) => {
          console.log('réponse Get collaborateur', response);
          this.collaboraters = response;
          this.collaboraterGetSubject.next(response);
        },
        (error) => {
          console.log('erreur backend', error);
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
}
