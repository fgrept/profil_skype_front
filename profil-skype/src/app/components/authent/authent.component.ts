import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {Subject, Subscription} from 'rxjs';
import { ProfilsService } from 'src/app/services/profils.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import {UserResult} from '../../models/user-result';

@Component({
  selector: 'app-authent',
  templateUrl: './authent.component.html',
  styleUrls: ['./authent.component.css']
})
export class AuthentComponent implements OnInit {

  currentUserType;
  userSuscribe: Subscription;
  urlAuthent = 'http://localhost:8181/v1/user/create';
  authentForm: FormGroup;
  userId: string;
  userResult: UserResult = null;
  roles = '';

  constructor(private userService: UserService,
              private profilService: ProfilsService,
              private httpClient: HttpClient,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();
    this.userId = '300004';
    this.getUser(this.userId);

    this.profilService.buttonFilterSubject.next(false);

    // méthode inutile à part ajouter une couche d'abstraction et de la complexité
    /*this.userSuscribe = this.userService.userSubject.subscribe(
      (user) => {
        this.currentUserType= user;
      }
    );*/

    this.authentForm = this.formBuilder.group(
      {username : '', password : ''}
    );
  }

  updateUserRole(roleChosen) {
    this.userService.updateRole(roleChosen);
  }

  userConnect() {
    let credential = {
      username : this.authentForm.get('username').value,
      password : this.authentForm.get('password').value
    };

    this.authentForm.get('username').value

    const routeAuthent = 'http://localhost:8181/login';
    this.httpClient.post(routeAuthent, credential)
    .subscribe(
      (response) => {
        console.log('retour back-end Ok : ', response);
      },
      (error) => {
        console.log('retour back-end Ok : ', error);
      }
    );
  }

  getUser(userId: string) {
    this.userService.getGetSubject().subscribe(
        (response: any) => {

          this.userResult = this.userService.getUser();
          this.updateLocalStorage();
          console.log('response authent :', response);
          console.log('valeur http status', response.status);
        }
    );
    this.userService.GetUserFromServerById(userId);
  }

  updateLocalStorage() {
    console.log('update local storage', this.userResult);
    if (this.userResult === null || this.userResult === undefined){
      localStorage.setItem('userId', '000000');
      localStorage.setItem('lastName', 'Nom inconnu');
      localStorage.setItem('firstName', 'Prenom inconnu');
      localStorage.setItem('userRoles', '');
    } else {
      localStorage.setItem('userId', this.userResult.collaboraterId);
      localStorage.setItem('lastName', this.userResult.lastName);
      localStorage.setItem('firstName', this.userResult.firstName);
      console.log('user Result', this.userResult);
      if (this.userResult !== null || this.userResult !== undefined) {
        this.roles = this.userService.getRole(this.userResult).roles.toString();
      }

      localStorage.setItem('userRoles', this.roles);
    }

  }
}
