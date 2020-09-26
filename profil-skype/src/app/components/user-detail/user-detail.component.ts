import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {UserResult} from '../../models/user-result';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  // index de la table des users issu du formulaire
  idUser: number;
  // user associé à l'index
  userResult: UserResult;
  userForm: FormGroup;
  localisation: string;
  userRolesForm: any[];

  constructor(private routeUser: ActivatedRoute,
              private userService: UserService,
              private formBuilderUser: FormBuilder)  {

  }

  ngOnInit(): void {
 //   this.idUser = this.routeUser.snapshot.params.idUSer;
    this.routeUser.paramMap.subscribe((params: ParamMap) => {
      this.idUser = +params.get('idUser');
      console.log('id is : ', this.idUser);
        }
    );
    this.userResult = this.userService.getUserById(this.idUser);
    console.log('Roles', this.userResult.roles);
    this.initForm();
    console.log('Roles formulaire :', this.userRolesForm);
  }

  initForm() {

    this.initRoles();
    this.localisation = this.userResult.siteAddress.concat(' ', this.userResult.sitePostalCode, ' ', this.userResult.siteCity);
    this.userForm = this.formBuilderUser.group({
      collaboraterId: this.userResult.collaboraterId,
      lastName: this.userResult.lastName,
      firstName: this.userResult.firstName,
      deskPhoneNumber: this.userResult.deskPhoneNumber,
      mobilePhoneNumber: this.userResult.mobilePhoneNumber,
      mailAdress: this.userResult.mailAdress,
      orgaUnitCode: this.userResult.orgaUnitCode,
      localisation: this.localisation,
      userRolesForm: this.userRolesForm
    });
  }

  initRoles() {
    this.userRolesForm =
        [{name : 'admin', value: 'Administrateur', checked: false},
          {name : 'resp', value: 'Responsable', checked: false},
          {name: 'user', value: 'Utilisateur', checked: false}];
    for (let item of this.userResult.roles) {
      if (item === 'Administrateur') {
        this.userRolesForm[0].checked = true;
      }
      if (item === 'Responsable') {
        this.userRolesForm[1].checked = true;
      }
      if (item === 'Utilisateur') {
        this.userRolesForm[2].checked = true;
      }
    }
  }
}
