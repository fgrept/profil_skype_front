import { Injectable} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ProfilFromList } from '../models/profil/profil-to-show';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { ProfilRaw } from '../models/profil/profil-raw';
import { ProfilForChange } from '../models/profil/profil-for-change';
import { userMsg } from '../models/tech/user-msg';
import { delay } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {LoaderService} from "./loader.service";

const baseUrl = environment.urlServer + '/v1/profile/list/all';
const baseUrl2 = environment.urlServer + '/v1/profile/update';
const baseUrl3 = environment.urlServer + '/v1/profile/delete/';
const baseUrl4 = environment.urlServer + '/v1/profile/count/';
const baseUrl5 = environment.urlServer + '/v1/profile/list/criteria/';
const urlGet = environment.urlServer + '/v1/profile/get/';
const urlCreate = environment.urlServer + '/v1/profile/create/';

@Injectable({
  providedIn: 'root'
})
export class ProfilsService  {

  private profils: ProfilFromList[];


  profilFromServer: ProfilFromList;

  private numberProfil: number;
  public profilsSubject = new Subject<ProfilFromList[]>();
  public updateSubject = new Subject();
  public deleteSubject = new Subject();
  public getProfilSubject = new Subject();
  public createSubject = new Subject();
  public reloadProfilsSubject = new Subject();
  public numberProfilSubject = new Subject<number>();
  public buttonFilterSubject = new Subject<boolean>();
  // variables when we go back to the list from the detail
  public profilListToReload = true;
  public profilListToCount = true;
  private pageListToShow = 1;

  private tokenId: string;

  // variable pour permettre l'affichage de la popup si le profil skype existe à la création
  public profilIdExist: string;
  public profilExistSubject = new Subject<string>();

  constructor(private httpClient: HttpClient,
              private loader: LoaderService) {}

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
          {responseType: 'json', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
          .subscribe(
            (response: HttpResponse<Object>) => {
              console.log('Maj back-end Ok');
              console.log(response);
              this.createSubject.next(new userMsg(true, null));
            },
            (error: HttpErrorResponse) => {
              console.log('Maj back-end Ko' + error );
              if (error.status === 200 || error.status === 201) {
                this.createSubject.next(new userMsg(true, null));
              } else {
                const msg = this.errorHandler(error);
                this.createSubject.next(new userMsg(false, msg));
              }
            }
          );
  }

  getNumberOfProfilFromServer() {
      this.tokenId = 'Bearer ' + localStorage.getItem('token');

    if (this.profilListToCount) {
      this.httpClient.get<any>(baseUrl4,
          {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
      .subscribe(
        (response) => { delay (4000)
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
            (response) => {delay (4000)
                           console.log('retour back-end Ok : ', response);
                           this.profils = response.body;
                           this.profilsSubject.next(response.body);
            },
            (error) => {
              console.log('retour back-end Ko : ', error);
            }
          );
    } else {
          console.log('profil service - pas de rechargement');
          this.loader.hideLoader();
          this.profilsSubject.next(this.profils);
          this.profilListToReload = true;
    }
  }

  getProfilsFromServerWithCriteria(pageAsked: number, searchprofil: ProfilFromList) {

    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.pageListToShow = pageAsked;
    if (this.profilListToReload) {
      const url = baseUrl5 + (pageAsked - 1) + '/10/0/ASC';
      // en cas de chgt de taille de page : penser à modifier aussi le critère dans la liste profils avec filtre
      this.httpClient.post<any[]>(url, searchprofil,
          {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
          .subscribe(
            (response) => {
              console.log('Maj back-end Ok');
              this.profils = response.body;
              this.profilsSubject.next(response.body);
            },
            (error) => {
              console.log('Maj back-end Ko' + error );
            }
          );
    } else {
        console.log('profil service - pas de rechargement');
        this.loader.hideLoader();
        this.profilsSubject.next(this.profils);
        this.profilListToReload = true;
    }
  }

  /**
   * method for retrieving the list of expired profil
   */
  getExpiredProfilsFromServer(profilSearch: ProfilFromList) {

    console.log('profilSearch :', profilSearch);

    this.tokenId = 'Bearer ' + localStorage.getItem('token');

    // const url = (baseUrl5+profilSearch) ;
    const url = (baseUrl5) ;
    console.log('Service-Expired-URL', url);

    this.httpClient.post<any[]>(url, profilSearch,
        {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
        .subscribe(
          (response) => {
            console.log('Retour back-end Ok');
            console.log('Response : ', response);
            this.profils = response.body;
            this.profilsSubject.next(response.body);
            console.log('listExpired:', this.profils )
          },
          (error) => {
            console.log('Retour back-end Ko' + error );
          }
        );
  }

  updateProfilToServer(profilRaw: ProfilRaw, idAnnuaire: string , idCil: string, comment: string) {
    const profilChanged = new ProfilForChange (
          profilRaw.sip, profilRaw.enterpriseVoiceEnabled, profilRaw.voicePolicy, profilRaw.dialPlan,
          profilRaw.samAccountName, profilRaw.exUmEnabled, profilRaw.exchUser, profilRaw.objectClass, profilRaw.statusProfile,
          idAnnuaire, idCil, comment);
    this.tokenId = 'Bearer ' + localStorage.getItem('token');
    this.httpClient.post(baseUrl2, profilChanged,
        {responseType: 'json', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
        .subscribe(
          (response: HttpResponse<Object>) => {
            console.log('Maj back-end Ok');
            console.log(response);
            this.updateSubject.next(new userMsg(true, null));
          },
          (error: HttpErrorResponse) => {
            console.log('Maj back-end Ko' + error );
            if (error.status === 200 || error.status === 201) {
              this.updateSubject.next(new userMsg(true, null));
            } else {
              const msg = this.errorHandler(error);
              this.updateSubject.next(new userMsg(false, msg));
            }
          }
        );
  }

  deleteProfilToServer(sip: string) {
      this.tokenId = 'Bearer ' + localStorage.getItem('token');
      this.httpClient.post(baseUrl3 + sip, null,
        {responseType: 'json', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
        .subscribe(
          (response: HttpResponse<Object>) => {
            console.log('Maj back-end Ok');
            console.log(response);
            this.deleteSubject.next(new userMsg(true, null));
          },
          (error: HttpErrorResponse) => {
            console.log('Maj back-end Ko' + error );
            if (error.status === 200 || error.status === 201) {
              this.deleteSubject.next(new userMsg(true, null));
            } else {
              const msg = this.errorHandler(error);
              this.deleteSubject.next(new userMsg(false, msg));
            }
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

    profilExist(idUser: string) {
        this.profilIdExist = idUser;
        this.profilExistSubject.next(idUser);
    }

    getProfilFromServerByCollaboraterId(collaboraterId: string) {

        this.tokenId = 'Bearer ' + localStorage.getItem('token');
        this.httpClient.get<any>(urlGet + collaboraterId,
            {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
            .subscribe(
                (result) => {
//                    console.log('headers', result.headers.keys());
                    this.profilFromServer = result.body;
                    this.getProfilSubject.next(result);
                },
                (error) => {
                //    this.getProfilSubject.next(error);
                    console.log('erreur back-end ' + error.status );
                }
            );
    }

    errorHandler(error: HttpErrorResponse): string {
      //
      // these case below are handled by the back-end, so we just return the error msg formatted by the back
        if (error.status === 409) {
          // conflict during the update server with other user
          return 'Un autre utilisateur a mis à jour le système entre temps.' +
              'Veuillez ressayer. ('  + error.error.message + ')';
        }
        if (error.status === 400) {
          // the request has a correct syntax but bad values (validation control of the field
          // like sip, email, size of fields)
          return 'Données saisies incorrectes. (' + error.error.message + ')';
        }
        if (error.status === 304) {
          // the request has a incorrect syntax but because of the front, not the user : serious error
          return 'Incohérence des données envoyées. Contactez la MOE. (' + error.error.message + ')';
        }
        if (error.status === 404) {
          // the request has a incorrect syntax but because of the front, not the user : serious error
          const msg = error.error.message;
          return 'Incohérence des données en base. Contactez la MOE. (' + msg + ')';
        }

        return 'Contactez la MOE. Erreur interne (' + error.status + ')';
    }
}
