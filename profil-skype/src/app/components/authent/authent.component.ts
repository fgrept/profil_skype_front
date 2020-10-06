import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { ProfilsService } from 'src/app/services/profils.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-authent',
  templateUrl: './authent.component.html',
  styleUrls: ['./authent.component.css']
})
export class AuthentComponent implements OnInit {

  currentUserType;
  userSuscribe: Subscription;
  urlAuthent = 'http://localhost:8181/v1/user/create';
  authentForm:FormGroup;

  constructor(private userService: UserService,
              private profilService: ProfilsService,
              private httpClient: HttpClient,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();
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

    let routeAuthent="http://localhost:8181/login"
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
}
