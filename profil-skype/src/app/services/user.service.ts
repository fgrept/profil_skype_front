import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/';
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
  public userSubject = new Subject<userType>();

  constructor() {
    this.userAuth = userType.userUnknown;
  }

  updateRole(roleChosen: userType) {
    this.userAuth = roleChosen;
    // méthode suivante nécessaire pour les components qui ecoutent la maj du role
    this.userSubject.next(roleChosen);
  }

  getCurrentRole() {
    return this.userAuth;
  }
}
