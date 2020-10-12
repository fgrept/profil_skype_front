import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';

// api de recherche d'adresse
// plus d'informations sur https://geo.api.gouv.fr/adresse
const urlApiGeo = 'https://api-adresse.data.gouv.fr/reverse/';
@Injectable({
  providedIn: 'root'
})
export class TechnicalService {

  public getErrorSubject = new Subject();
  public getGeoSubject = new Subject();
  constructor(private httpClient: HttpClient) { }

  getCurrentPosition(long: number, lat: number) {
    this.httpClient.get <any>
    (urlApiGeo + '?lon=' + long + '&lat=' + lat, {observe: 'response'})
        .subscribe(
            (response: HttpResponse<any>) => {
              this.getGeoSubject.next(response.body);
              console.log('reponse API Geo', response.body);
            },
            (error) => {
              console.log('erreur suite appel api GEO', error);
            }

        );
  }

}
