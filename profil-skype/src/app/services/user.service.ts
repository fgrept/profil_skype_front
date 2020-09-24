import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/';
import { Subject } from 'rxjs';
import {UserResult} from '../models/user-result';
import {HttpClient} from '@angular/common/http';

const urlUserCreate = 'http://localhost:8181/v1/user/create';
const urlUserUprole = 'http://localhost:8181/v1/user/uprole';
const urlUserUppassword = 'http://localhost:8181/v1/user/updatepassword';
const urlUserGet = 'http://localhost:8181/v1/user/list';
const urlUserDelete = 'http://localhost:8181/v1/user/delete';

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

  private users: UserResult[];
  usersSubject = new Subject<UserResult[]>();
  private userAuth;
  public userSubject = new Subject<userType>();

  constructor(private httpClient: HttpClient) {
    this.userAuth = userType.userUnknown;
  }

  getProfilById(id: number) {
        if (id < this.users.length) {
            return this.users[id];
        } else {
            console.log('Problème d\'indice sur la liste');
            return null;
        }
    }

    getUsersFromServer(){
    this.httpClient.get<any[]>(urlUserGet)
        .subscribe(
            (response) => {
              console.log(response);
              this.users = response;
              this.getRoles();
              this.usersSubject.next(response);
            },
            (error) => {
              console.log('erreur back-end ' + error );
            }
        );
  }

  updateRole(roleChosen: userType) {
    this.userAuth = roleChosen;
    // méthode suivante nécessaire pour les components qui ecoutent la maj du role
    this.userSubject.next(roleChosen);
  }

  getCurrentRole() {
    return this.userAuth;
  }

  getRoles(){
      for (let userList of this.users) {
          for (let index in userList.roles) {
              if (userList.roles[index] === 'ROLE_USER') {
                  userList.roles[index] = 'Utilisateur';
              }
              if (userList.roles[index] === 'ROLE_RESP') {
                  userList.roles[index] = 'Responsable';
              }
              if (userList.roles[index] === 'ROLE_ADMIN') {
                  userList.roles[index] = 'Administrateur';
              }
          }
      }
  }
}
