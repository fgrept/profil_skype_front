import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {CollaboraterService} from '../../services/collaborater.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Collaborater} from '../../models/collaborater';
import {UserService} from '../../services/user.service';
import {UserCreate} from '../../models/user-create';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-user-create-role',
  templateUrl: './user-create-role.component.html',
  styleUrls: ['./user-create-role.component.css']
})
export class UserCreateRoleComponent implements OnInit {

  // index de la table des collaborateurs issu du formulaire
  idCollaborater: string;
  collboraterSelect: Collaborater;
  userFormCreate: FormGroup;
  userRolesFormCreate: any[];
  localisation: string;
  createAuthorized: boolean;
  userCreate: UserCreate;
  roles: string[];
  isCreated: boolean;
  private successSubject = new Subject<string>();
  successMessage: string;
  isAvailableMessage = false;

  constructor(private routeUser: ActivatedRoute,
              private collaboraterService: CollaboraterService,
              private userService: UserService,
              private formBuilderUser: FormBuilder) { }

  ngOnInit(): void {
    //   récupération de l'id sélectionnée
    this.routeUser.paramMap.subscribe((params: ParamMap) => {
          this.idCollaborater = params.get('idUser');
          console.log('id is : ', this.idCollaborater);
        }
    );
    this.collboraterSelect = this.collaboraterService.getCollaboraterByCollaboraterId(this.idCollaborater);
    this.initForm();
    this.createAuthorized = false;
    this.isCreated = false;
    this.initAlert();
  }

    initForm() {
      this.initRoles();
      this.localisation = this.collboraterSelect.siteAddress.concat(
          ' ', this.collboraterSelect.sitePostalCode, ' ', this.collboraterSelect.siteCity);
      this.userFormCreate = this.formBuilderUser.group({
          collaboraterId: this.collboraterSelect.collaboraterId,
          lastName: this.collboraterSelect.lastName,
          firstName: this.collboraterSelect.firstName,
          deskPhoneNumber: this.collboraterSelect.deskPhoneNumber,
          mobilePhoneNumber: this.collboraterSelect.mobilePhoneNumber,
          mailAdress: this.collboraterSelect.mailAdress,
          orgaUnitCode: this.collboraterSelect.orgaUnitCode,
          localisation: this.localisation,
          userRolesForm: this.collboraterSelect
      });
    }

    private initRoles() {
        this.userRolesFormCreate =
            [{name : 'admin', value: 'Administrateur', checked: false},
                {name : 'resp', value: 'Responsable', checked: false},
                {name: 'user', value: 'Utilisateur', checked: false}];
    }

    onCheckRoleChange(e){
      this.createAuthorized = true;
      if (e.target.value === 'Administrateur') {
            this.userRolesFormCreate[0].checked = e.target.checked;
        }
      if (e.target.value === 'Responsable') {
            this.userRolesFormCreate[1].checked = e.target.checked;
        }
      if (e.target.value === 'Utilisateur') {
            this.userRolesFormCreate[2].checked = e.target.checked;
        }
      if ((this.userRolesFormCreate[0].checked === false) &&
            (this.userRolesFormCreate[1].checked === false) &&
            (this.userRolesFormCreate[2].checked === false)) {
            console.log('tous les champs désactivés');
            this.createAuthorized = false;
        }
    }

    createUser(){
      console.log('create User');
      this.getRolesForm();
      console.log('id', this.userFormCreate.value.collaboraterId);
      this.userCreate = new UserCreate(this.userFormCreate.value.collaboraterId, this.roles);
      console.log('Create User : id userCreate ', this.userCreate.collaboraterId);
      this.userService.createUserToServer(this.userCreate);
      this.isCreated = true;
      this.changeSuccessMessage('Création effectuée');
    }

    private getRolesForm() {
        this.roles = [];
        for (const roleForm of this.userRolesFormCreate){
            if (roleForm.checked === true){
                this.roles.push(roleForm.value);
            }
        }
    }

    initAlert() {
        this.successSubject.subscribe(message => this.successMessage = message);
        this.successSubject.pipe(
            debounceTime(2000)
        ).subscribe(() => {
            this.successMessage = '';
            this.isAvailableMessage = false;
        });
    }

    changeSuccessMessage(message: string) {
        this.isAvailableMessage = true;
        this.successSubject.next(message);
    }
}
