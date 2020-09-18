import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ProfilFromList } from '../models/profil-to-show';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ProfilRaw } from '../models/profil-raw';
import { ProfilForChange } from '../models/profil-for-change';

const baseUrl: string = 'http://localhost:8181/v1/profile/list/all';
const baseUrl2: string = 'http://localhost:8181/v1/profile/update';
const baseUrl3: string = 'http://localhost:8181/v1/profile/delete/';
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

  private profils: ProfilFromList[];
  profilsSubject = new Subject<ProfilFromList[]>();

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

  updateProfilToServer(profilRaw:ProfilRaw, idAnnuaire:string ,idCil:string, comment:string) {
    const profilChanged = new ProfilForChange (
          profilRaw.sip, profilRaw.enterpriseVoiceEnabled, profilRaw.voicePolicy, profilRaw.dialPlan,
          profilRaw.samAccountName,profilRaw.exUmEnabled,profilRaw.exchUser,profilRaw.objectClass,profilRaw.statusProfile,
          idAnnuaire, idCil, comment);
    this.httpClient.post(baseUrl2,profilChanged)
    .subscribe(
      (response) => {
        console.log(response);
        //this.profils = response;
        //this.profilsSubject.next(response);
      },
      (error) => {
        console.log("erreur back-end " + error );
      }
    )
  }

  deleteProfilToServer(sip:string) {
    this.httpClient.post(baseUrl3 + sip, null)
    .subscribe(
      (response) => {
        console.log(response);
        //this.profils = response;
        //this.profilsSubject.next(response);
      },
      (error) => {
        console.log("erreur back-end " + error );
      }
    )
  }

}
