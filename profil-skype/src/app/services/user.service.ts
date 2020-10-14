import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/';
import { Subject } from 'rxjs';
import {UserResult} from '../models/user/user-result';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {UserCreate} from '../models/user/user-create';
import { userMsg } from '../models/tech/user-msg';
import {environment} from '../../environments/environment';

const urlUserCreate = environment.urlServer + '/v1/user/create';
const urlUserUprole = environment.urlServer + '/v1/user/uprole/';
const urlUserUppassword = environment.urlServer + '/v1/user/updatepassword/';
const urlUserGetList = environment.urlServer + '/v1/user/list';
const urlUserGet = environment.urlServer + '/v1/user/get/';
const urlUserDelete = environment.urlServer + '/v1/user/delete/';

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

  private users: UserResult[] = null;
  private userGet: UserResult = null;
  private usersSubject = new Subject<UserResult[]>();
  private userAuth;
  public userSubject = new Subject<userType>();
  public userUpdateSubject = new Subject();
  public userDeleteSubject = new Subject();
  public userCreateSubject = new Subject();
  private userUpdatePasswordSubject = new Subject();
  private userGetSubject = new Subject();
  private tokenId: string;
  // pour l'affichage de la popup lors de la création
  public userIdExist: string;
  public userExistSubject = new Subject<string>();

  constructor(private httpClient: HttpClient) {

  }

  getUserById(id: number) {
        if (id < this.users.length) {
            return this.users[id];
        } else {
            console.log('Problème d\'indice sur la liste');
            return null;
        }
    }
    getUsers(): UserResult[]{
      return this.users;
    }

    getUser(): UserResult{
      return this.userGet;
    }

    /**
     * Récupère la liste des utilisateurs sans critères de filtre ni pagination
     */
    getUsersFromServer(){
        this.tokenId = 'Bearer ' + localStorage.getItem('token');
        this.httpClient.get<any[]>(urlUserGetList,
            {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
            .subscribe(
                (response) => {
                  console.log('header', response.headers.keys());
                  console.log('count', response.headers.get('count'));
                  this.users = response.body;
                  this.getRoles();
                  this.usersSubject.next(response.body);
                },
                (error) => {
                    console.log('erreur back-end ', error );
                }
            );
  }

  getUserDeleteSubject() {
        return this.userDeleteSubject;
  }

  getUpdatePasswordSubject(){
        return this.userUpdatePasswordSubject;
  }

  getGetSubject(){
        return this.userGetSubject;
  }


  updateRole(roleChosen: userType) {
    this.userAuth = roleChosen;
    // méthode suivante nécessaire pour les components qui ecoutent la maj du role
    this.userSubject.next(roleChosen);
  }
  userExist(idUser: string) {
        this.userIdExist = idUser;
        this.userExistSubject.next(idUser);
  }

  getCurrentRole() {
    return this.userAuth;
  }

  getusersSubject() {
        return this.usersSubject;
  }

    /**
     * Permet de récupérer les libellés Front associées aux rôles gérés par le back end
     */
  getRoles(){
      for (let userList of this.users) {
          this.getRole(userList);
      }
  }

  getRole(userList: UserResult): UserResult {
      console.log('get role user service');
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
      console.log('userList', userList);
      return userList;
  }

    /**
     * Mise à jour du rôle d'un utilisateur
     * @param userResult
     */
    updateUserToServer(userResult: UserResult) {
      this.setRoles(userResult.roles);
      console.log('roles service User', userResult.roles);
      this.tokenId = 'Bearer ' + localStorage.getItem('token');
      this.httpClient.put(urlUserUprole + userResult.collaboraterId + '/' + userResult.roles, null,
          {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
          .subscribe(
            (response: HttpResponse<Object>) => {
              console.log('Maj back-end Ok');
              console.log(response);
              this.userUpdateSubject.next(new userMsg(true, null));
            },
            (error: HttpErrorResponse) => {
              console.log('Maj back-end Ko' + error );
              if (error.status === 200 || error.status === 201) {
                this.userUpdateSubject.next(new userMsg(true, null));
              } else {
                const msg = this.errorHandler(error);
                this.userUpdateSubject.next(new userMsg(false, msg));
              }
            }
          );
      this.getRole(userResult);
    }

    /**
     * Récupére un utilisateur à partir de l'id annuaire
     */
    GetUserFromServerById(userId: string){
        this.tokenId = 'Bearer ' + localStorage.getItem('token');
        // console.log('valeur de token', this.tokenId);
        this.httpClient.get<UserResult>(urlUserGet + userId,
            {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
            .subscribe(
                (response) => {
                    this.userGetSubject.next(response);
                    console.log('user.service - GetUserFromServerById -> response', response);
                    this.userGet = response.body;
                },
                (error) => {
                    // this.userGetSubject.next(error);
                    console.log('user.service - GetUserFromServerById -> Error', error);
                }
            );
    }

    /**
     * Mise à jour du mot de passe
     */
    updatePasswordToServer(userId: string, oldPassword: string, newPassword){
        this.tokenId = 'Bearer ' + localStorage.getItem('token');
        this.httpClient.put(urlUserUppassword + userId + '/' + oldPassword + '/' + newPassword, null,
           {observe : 'response', headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
           .subscribe(
               (response) => {
                   this.userUpdatePasswordSubject.next(response);
               },
                   (error) => {
                   this.userUpdatePasswordSubject.next(error);
                   console.log('erreur back end', error);
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
        this.tokenId = 'Bearer ' + localStorage.getItem('token');
        this.httpClient.delete(urlUserDelete + userResult.collaboraterId,
            {headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
            .subscribe(
                (response: HttpResponse<Object>) => {
                  console.log('Maj back-end Ok');
                  console.log(response);
                  this.userDeleteSubject.next(new userMsg(true, null));
                },
                (error: HttpErrorResponse) => {
                  console.log('Maj back-end Ko' + error );
                  if (error.status === 200 || error.status === 201) {
                    this.userDeleteSubject.next(new userMsg(true, null));
                  } else {
                    const msg = this.errorHandler(error);
                    this.userDeleteSubject.next(new userMsg(false, msg));
                  }
                }
            );
    }

    /**
     * Création d'un user (id avec les rôles associés)
     * @param userCreate
     */
    createUserToServer(userCreate: UserCreate) {
        this.setRoles(userCreate.roles);
        this.tokenId = 'Bearer ' + localStorage.getItem('token');
        this.httpClient.post(urlUserCreate, userCreate,
            {headers: new HttpHeaders().set('Authorization', this.tokenId), withCredentials: true})
            .subscribe(
                (response: HttpResponse<Object>) => {
                  console.log('Maj back-end Ok');
                  console.log(response);
                  this.userCreateSubject.next(new userMsg(true, null));
                },
                (error: HttpErrorResponse) => {
                  console.log('Maj back-end Ko' + error );
                  if (error.status === 200 || error.status === 201) {
                    this.userCreateSubject.next(new userMsg(true, null));
                  } else {
                    const msg = this.errorHandler(error);
                    this.userCreateSubject.next(new userMsg(false, msg));
                  }
                }
            );
    }

    deleteUserFromList(userResult: UserResult) {
        const index: number = this.users.indexOf(userResult);
        this.users.splice(index, 1);
        console.log('index delete', index);
    }

    addUserToList(userResult: UserResult) {
        this.getRole(userResult);
        this.users.push(userResult);
    }

    getUserFromListByCollaboraterId(collaboraterId: string): UserResult{

        for (let user of this.users) {
            if (user.collaboraterId === collaboraterId){
                return user;
            }
        }
        return null;
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
