import { Injectable } from '@angular/core';

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
  userAuth = userType.userUnknown;

  constructor() {}

  updateRole(roleChosen:userType) {
    this.userAuth = roleChosen;
  }
}
