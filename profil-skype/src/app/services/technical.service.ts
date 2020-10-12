import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnicalService {

  public getErrorSubject = new Subject();
  constructor() { }

}
