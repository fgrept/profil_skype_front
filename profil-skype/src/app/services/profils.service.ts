import { Injectable, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ProfilFromList } from '../models/profil/profil-to-show';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { ProfilRaw } from '../models/profil/profil-raw';
import { ProfilForChange } from '../models/profil/profil-for-change';

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


  profilFromServer: ProfilFromList;

  private numberProfil: number;
  //private buttonFilter:boolean=false;
  public profilsSubject = new Subject<ProfilFromList[]>();
  public updateSubject = new Subject();
  public deleteSubject = new Subject();
  public getProfilSubject = new Subject();
  public createSubject = new Subject();
  public numberProfilSubject = new Subject<number>();
  public buttonFilterSubject = new Subject<boolean>();
  // variables when we go back to the list from the detail
  public profilListToReload = true;
  public profilListToCount = true;
  public pageListToShow = 1;

  private tokenId: string;

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
      this.tokenId = 'Bearer ' + localStorage.getItem('token');
      this.httpClient.post<any>(urlCreate, profilForChange,
          {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
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
      this.tokenId = 'Bearer ' + localStorage.getItem('token');

    if (this.profilListToCount) {
      this.httpClient.get<any>(baseUrl4,
          {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response) => {
          console.log('retour back-end Ok : ', response);
          this.numberProfil = response.body;
          this.profilListToCount = false;
          this.numberProfilSubject.next(response.body);
        },
        (error) => {
          console.log('retour back-end Ko : ', error );
        }
      );
    } else {
      this.numberProfilSubject.next(this.numberProfil);
    }
  }

  /**
   * method for reload the list of profil or to re-emit thus in memory
   */
  getProfilsFromServer(pageAsked: number) {
      
      this.tokenId = 'Bearer ' + localStorage.getItem('token');
      this.pageListToShow = pageAsked;
      if (this.profilListToReload) {
          const url = baseUrl + '/' + (pageAsked - 1) + '/10/0';
          this.httpClient.get<any[]>(url,
              {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
          .subscribe(
            (response) => {
              console.log('retour back-end Ok : ', response);
              this.profils = response.body;
              this.profilsSubject.next(response.body);
            },
            (error) => {
              console.log('retour back-end Ko : ', error);
            }
          );
    } else {
      this.profilsSubject.next(this.profils);
      this.profilListToReload = true;
    }
  }

  getProfilsFromServerWithCriteria(pageAsked: number, searchprofil: ProfilFromList) {

      this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.pageListToShow = pageAsked;
    if (this.profilListToReload) {
      const url = baseUrl5 + (pageAsked - 1) + '/10/0/ASC';
      console.log(url);
      this.httpClient.post<any[]>(url, searchprofil,
          {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response) => {
          console.log(response);
          this.profils = response.body;
          this.profilsSubject.next(response.body);
        },
        (error) => {
          console.log('erreur back-end ' + error );
        }
      );
    } else {
      this.profilsSubject.next(this.profils);
      this.profilListToReload = true;
    }
  }

  updateProfilToServer(profilRaw: ProfilRaw, idAnnuaire: string , idCil: string, comment: string) {
    const profilChanged = new ProfilForChange (
          profilRaw.sip, profilRaw.enterpriseVoiceEnabled, profilRaw.voicePolicy, profilRaw.dialPlan,
          profilRaw.samAccountName, profilRaw.exUmEnabled, profilRaw.exchUser, profilRaw.objectClass, profilRaw.statusProfile,
          idAnnuaire, idCil, comment);
      this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.post(baseUrl2, profilChanged,
        {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
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
      this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.post(baseUrl3 + sip, null,
        {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
    .subscribe(
      (response) => {
        this.numberProfil--;
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

        this.tokenId = 'Bearer ' + localStorage.getItem('token');
        this.httpClient.get<any>(urlGet + collaboraterId,
            {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
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
