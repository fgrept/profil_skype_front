import { Injectable, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ProfilFromList } from '../models/profil-to-show';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ProfilRaw } from '../models/profil-raw';
import { ProfilForChange } from '../models/profil-for-change';

const baseUrl = 'http://localhost:8181/v1/profile/list/all';
const baseUrl2 = 'http://localhost:8181/v1/profile/update';
const baseUrl3 = 'http://localhost:8181/v1/profile/delete/';
const baseUrl4 = 'http://localhost:8181/v1/profile/count/';
/*const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*');
*/
@Injectable({
  providedIn: 'root'
})
export class ProfilsService  {

  private profils:ProfilFromList[];
  profilsSubject = new Subject<ProfilFromList[]>();
  updateSubject = new Subject();
  deleteSubject = new Subject();
  private numberProfil :number;
  numberProfilSubject = new Subject<number>();

  constructor(private httpClient: HttpClient) {}

  getProfilById(id: number) {
    if (id < this.profils['length']) {
      return this.profils[id];
    } else {
      console.log('Problème d\'indice sur la liste');
      return null;
    }
  }

  getNumberOfProfilFromServer() {
    this.httpClient.get<any>(baseUrl4// , {headers}
    )
    .subscribe(
      (response) => {
        console.log(response);
        this.numberProfil = response;
        this.numberProfilSubject.next(response);
      },
      (error) => {
        console.log('erreur back-end ' + error );
      }
    );
  }
  
  getProfilsFromServer(pageAsked:number) {
    let url = baseUrl + '/' + (pageAsked-1) + '/2/0';
    console.log(url);
    this.httpClient.get<any[]>(url// , {headers}
    )
    .subscribe(
      (response) => {
        console.log(response);
        this.profils = response;
        this.profilsSubject.next(response);
      },
      (error) => {
        console.log('erreur back-end ' + error );
      }
    );
  }

  updateProfilToServer(profilRaw: ProfilRaw, idAnnuaire: string , idCil: string, comment: string) {
    const profilChanged = new ProfilForChange (
          profilRaw.sip, profilRaw.enterpriseVoiceEnabled, profilRaw.voicePolicy, profilRaw.dialPlan,
          profilRaw.samAccountName, profilRaw.exUmEnabled, profilRaw.exchUser, profilRaw.objectClass, profilRaw.statusProfile,
          idAnnuaire, idCil, comment);
    this.httpClient.post(baseUrl2, profilChanged)
    .subscribe(
      (response) => {
        console.log('Maj back-end Ok');
        // this.route.navigate(['/profils']);
        this.updateSubject.next(response);
        // this.profils = response;
        // this.profilsSubject.next(response);
      },
      (error) => {
        console.log('erreur back-end ' + error );
        this.updateSubject.next(error);
      }
    );
  }

  deleteProfilToServer(sip: string) {
    this.httpClient.post(baseUrl3 + sip, null)
    .subscribe(
      (response) => {
        //console.log(response);
        this.deleteSubject.next(response);
        // this.profils = response;
        // this.profilsSubject.next(response);
      },
      (error) => {
        console.log('erreur back-end ' + error );
        this.deleteSubject.next(error);
      }
    );
  }

}
