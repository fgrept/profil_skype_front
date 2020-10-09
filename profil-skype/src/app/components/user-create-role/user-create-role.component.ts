import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CollaboraterService} from '../../services/collaborater.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Collaborater} from '../../models/collaborater';
import {UserService} from '../../services/user.service';
import {UserCreate} from '../../models/user-create';
import {debounceTime} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {UserResult} from '../../models/user-result';

@Component({
  selector: 'app-user-create-role',
  templateUrl: './user-create-role.component.html',
  styleUrls: ['./user-create-role.component.css']
})
export class UserCreateRoleComponent implements OnInit, OnDestroy {

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
  private userCreateSubscription:Subscription;
  private successSubscription:Subscription;
  // variables pour l'affichage d'une popup
  private successSubject = new Subject<string>();
  successMessage: string;
  availableMessage = false;

  constructor(private routeUser: ActivatedRoute,
              private collaboraterService: CollaboraterService,
              private userService: UserService,
              private formBuilderUser: FormBuilder,
              private router: Router) { }

  ngOnDestroy(): void {
    if (this.successSubscription) {this.successSubscription.unsubscribe()};
    if (this.userCreateSubscription) {this.userCreateSubscription.unsubscribe()};
  }

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

      this.userCreateSubscription = this.userService.userCreateSubject.subscribe(
        (response: Object) => {
          console.log(response);
          this.userService.addUserToList(new UserResult(
          this.collboraterSelect.collaboraterId, this.collboraterSelect.lastName,
          this.collboraterSelect.firstName, this.collboraterSelect.deskPhoneNumber,
          this.collboraterSelect.mobilePhoneNumber, this.collboraterSelect.mailAdress,
          this.collboraterSelect.orgaUnitCode, this.collboraterSelect.orgaUnitType,
          this.collboraterSelect.orgaUnitShortLabel, this.collboraterSelect.siteCode,
          this.collboraterSelect.siteName, this.collboraterSelect.siteAddress,
          this.collboraterSelect.sitePostalCode, this.collboraterSelect.siteCity,
          this.roles
          ));
          this.isCreated = true;
          // update server done : display confirm box then routing
          this.emitAlertAndRouting('Création effectuée');
        }
      );

      this.userService.createUserToServer(this.userCreate);

    }

    private getRolesForm() {
        this.roles = [];
        for (const roleForm of this.userRolesFormCreate){
            if (roleForm.checked === true){
                this.roles.push(roleForm.value);
            }
        }
    }

    emitAlertAndRouting(message:string) {
      this.successMessage = message;
      this.availableMessage = true;
      this.successSubscription = this.successSubject.pipe(debounceTime(2000)).subscribe(
          () => {
              this.successMessage = '';
              this.availableMessage = false;
              this.router.navigate(['/users'])
          }
      );
      this.successSubject.next();
    }
}
