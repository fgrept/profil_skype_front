import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ProfilShort } from '../models/profil-short';
import { HttpClient, HttpHeaders} from '@angular/common/http';

const baseUrl     : string = 'http://localhost:8181/profile/list/all';
/*const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*');
*/
@Injectable({
  providedIn: 'root'
})
export class ProfilsService {

  private profils: ProfilShort[];
  profilsSubject = new Subject<ProfilShort[]>();

  constructor(private httpClient: HttpClient) {}

  getProfilById(id:number) {
    if (id < this.profils.length) {
      return this.profils[id];
    } else {
      console.log("Problème d'indice sur la liste");
      return null;
    }
  }

  getProfilsFromServer() {
    this.httpClient.get<any[]>(baseUrl//, {headers}
    )
    .subscribe(
      (response) => {
        //console.log(response);
        this.profils = response;
        this.profilsSubject.next(response);
      },
      (error) => {
        console.log("erreur back-end " + error );
      }
    );
  }
}
