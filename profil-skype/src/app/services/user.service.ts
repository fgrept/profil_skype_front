import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/';
import { Subject } from 'rxjs';
import {UserResult} from '../models/user-result';
import {HttpClient} from '@angular/common/http';
import {UserCreate} from '../models/user-create';

const urlUserCreate = 'http://localhost:8181/v1/user/create';
const urlUserUprole = 'http://localhost:8181/v1/user/uprole/';
const urlUserUppassword = 'http://localhost:8181/v1/user/updatepassword';
const urlUserGet = 'http://localhost:8181/v1/user/list';
const urlUserDelete = 'http://localhost:8181/v1/user/delete/';

enum userType {
  userUnknown,
  userCollab,
  userCil,
  userAdmin
}

@Injectable({
  providedIn: 'root'
})
/**
 * Service User effectuant l'interface avec le back end pour l'objet user
 */
export class UserService {

  private users: UserResult[];
  usersSubject = new Subject<UserResult[]>();
  private userAuth;
  public userSubject = new Subject<userType>();
  public userUpdateSubject = new Subject();
  public userDeleteSubject = new Subject();
  public userCreateSubject = new Subject();

  constructor(private httpClient: HttpClient) {
    this.userAuth = userType.userUnknown;
  }

  getUserById(id: number) {
        if (id < this.users.length) {
            return this.users[id];
        } else {
            console.log('Problème d\'indice sur la liste');
            return null;
        }
    }

    /**
     * Récupère la liste des utilisateurs sans critères de filtre ni pagination
     */
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
              console.log('erreur back-end ', error );
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

    /**
     * Permet de récupérer les libellés Front associées aux rôles gérés par le back end
     */
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

    /**
     * Mise à jour du rôle d'un utilisateur
     * @param userResult
     */
    updateUserToServer(userResult: UserResult) {
      this.setRoles(userResult.roles);
      console.log('roles service User', userResult.roles);
      this.httpClient.put(urlUserUprole + userResult.collaboraterId + '/' + userResult.roles, null).subscribe(
          (response)  => {
              console.log ('Maj role user back end ok');
              this.userUpdateSubject.next(response);
          },
          (error) => {
              console.log('erreur back-end ', error);
              this.userUpdateSubject.next(error);
          }
      );
    }

    /**
     * Formatage des rôles avant envoi aux back end
     * @param rolesForm
     */
    setRoles(rolesForm: string[]) {

      for (let index in rolesForm) {
          if (rolesForm[index] === 'Administrateur') {
              rolesForm[index] = 'ROLE_ADMIN';
          }
          if (rolesForm[index] === 'Responsable') {
              rolesForm[index] = 'ROLE_RESP';
          }
          if (rolesForm[index] === 'Utilisateur') {
              rolesForm[index] = 'ROLE_USER';
          }
      }
    }

    /**
     * Suppression d'un utilisateur à partir de son id
     * @param userResult
     */
    deleteUserToServer(userResult: UserResult) {
        this.httpClient.delete(urlUserDelete + userResult.collaboraterId).subscribe(
            (response) => {
                console.log('Suppression effectuée');
                this.userDeleteSubject.next(response);
            },
            (error) => {
                console.log('Erreur back end', error);
                this.userDeleteSubject.next(error);
            }
        );
    }
    createUserToServer(userCreate: UserCreate) {
        this.setRoles(userCreate.roles);
        this.httpClient.post(urlUserCreate, userCreate).subscribe(
            (response) => {
                console.log('Création effectuée');
                this.userCreateSubject.next(response);
            },
            (error) => {
                console.log('Erreur back end', error);
                this.userCreateSubject .next(error);
            }
        );
    }
}
