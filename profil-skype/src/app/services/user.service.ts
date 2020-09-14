import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/'
import { Subject } from 'rxjs';

enum userType {
  userUnknown,
  userCollab,
  userCil,
  userAdmin
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userAuth;
  userSubject = new Subject<userType>();

  constructor() {
    this.userAuth = userType.userUnknown;
  }

  updateRole(roleChosen:userType) {
    this.userAuth = roleChosen;
    this.userSubject.next(roleChosen);
  }

}
