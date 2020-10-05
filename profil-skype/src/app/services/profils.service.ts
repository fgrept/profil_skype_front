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
const baseUrl5 = 'http://localhost:8181/v1/profile/list/criteria/';
const urlGet = 'http://localhost:8181/v1/profile/get/';
const urlCreate = 'http://localhost:8181/v1/profile/create/';

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

  private profils: ProfilFromList[];
  profilsSubject = new Subject<ProfilFromList[]>();
  updateSubject = new Subject();
  deleteSubject = new Subject();
  getProfilSubject = new Subject();
  createSubject = new Subject();

    profilFromServer: ProfilFromList;

  private numberProfil: number;
  numberProfilSubject = new Subject<number>();
  count: number;

  constructor(private httpClient: HttpClient) {}

  getProfilById(id: number) {
    if (id < this.profils.length) {
      return this.profils[id];
    } else {
      console.log('Problème d\'indice sur la liste');
      return null;
    }
  }

  createProfil(profilForChange: ProfilForChange) {
      this.httpClient.post<any>(urlCreate, profilForChange, {observe: 'response'})
          .subscribe(
              (result) => {
                  console.log(result);
                  this.createSubject.next(result.body);
              },
              (error) => {
                  console.log('erreur back-end ' + error.status );
                  this.createSubject.next(error);
              }
          );
  }

  getNumberOfProfilFromServer() {
    this.httpClient.get<any>(baseUrl4, {observe: 'response'})
    .subscribe(
      (result) => {
        console.log(result);
        this.numberProfil = result.body;
        this.numberProfilSubject.next(result.body);
      },
      (error) => {
        console.log('erreur back-end ' + error.status );
        this.numberProfilSubject.next(error);
      }
    );
  }

  getProfilsFromServer(pageAsked: number) {
    const url = baseUrl + '/' + (pageAsked - 1) + '/10/0';
    this.httpClient.get<any[]>(url, {observe: 'response'})
    .subscribe(
      (response) => {
        console.log(response);
        console.log('headers', response.headers.keys());
        console.log('count', response.headers.get('count'));
        this.profils = response.body;
        this.profilsSubject.next(response.body);
      },
      (error) => {
        console.log('erreur back-end ' + error.status );
      }
    );
  }


  getProfilsFromServerWithCriteria(pageAsked: number, searchprofil: ProfilFromList) {
    const url = baseUrl5 + (pageAsked - 1) + '/10/0/ASC';

    console.log(url);
    this.httpClient.post<any[]>(url, searchprofil, {observe: 'response'})
    .subscribe(
      (response) => {
        console.log(response);
        console.log('headers', response.headers.keys());
        this.profils = response.body;
        this.count = Number(response.headers.get('count'));
        console.log('count après récupération :', this.count);
        this.profilsSubject.next(response.body);
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
        this.deleteSubject.next(response);
      },
      (error) => {
        console.log('erreur back-end ' + error.status );
        this.deleteSubject.next(error);
      }
    );
  }

    getProfilFromListByCollaboraterId(collaboraterId: string): ProfilFromList {

    for (let profil of this.profils) {
          if (profil.collaboraterId === collaboraterId) {
            return profil;
          }
        }
    return null;
    }

    getProfilFromServerByCollaboraterId(collaboraterId: string) {

        this.httpClient.get<any>(urlGet + collaboraterId, {observe: 'response'})
            .subscribe(
                (result) => {
//                    console.log('headers', result.headers.keys());
                    this.profilFromServer = result.body;
                    this.getProfilSubject.next(result.body);
                },
                (error) => {
                    this.getProfilSubject.next(error);
                    console.log('erreur back-end ' + error.status );
                }
            );
    }
}
