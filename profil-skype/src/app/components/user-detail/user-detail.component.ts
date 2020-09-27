import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {UserResult} from '../../models/user-result';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

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
  // booléen dédié à l'action du bouton de mise à jour
  updateAuthorized: boolean;
  roles: string[];

  constructor(private routeUser: ActivatedRoute,
              private userService: UserService,
              private formBuilderUser: FormBuilder)  {

  }

  ngOnInit(): void {
 //   récupération de l'id sélectionnée
    this.routeUser.paramMap.subscribe((params: ParamMap) => {
      this.idUser = +params.get('idUser');
      console.log('id is : ', this.idUser);
        }
    );
    // récupération du user associé à l'id
    this.userResult = this.userService.getUserById(this.idUser);
    console.log('Roles', this.userResult.roles);
    this.initForm();
    console.log('Roles formulaire :', this.userRolesForm);
    this.updateAuthorized = false;
  }

  /**
   * intialisation des données du formulaire
   */
  initForm() {

    this.initRoles();
    // formatage de l'adresse (donnée non modifiable)
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

  /**
   * Initilisation des valeurs de checbox pour la liste des rôles
   */
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

  /**
   * permet d'activer/désactiver le bouton de mise à jour et de stocker les valeurs saisies
   * @param e: event sur le checkbox
   */
  onCheckRoleChange(e) {
    this.updateAuthorized = true;
    console.log('event value', e.target.value);
    console.log('event checked', e.target.checked);
    if (e.target.value === 'Administrateur') {
      this.userRolesForm[0].checked = e.target.checked;
    }
    if (e.target.value === 'Responsable') {
      this.userRolesForm[1].checked = e.target.checked;
    }
    if (e.target.value === 'Utilisateur') {
      this.userRolesForm[2].checked = e.target.checked;
    }
    if ((this.userRolesForm[0].checked === false) &&
        (this.userRolesForm[1].checked === false) &&
        (this.userRolesForm[2].checked === false)) {
      console.log('tous les champs désactivés');
      this.updateAuthorized = false;
    }
  }

  /**
   * Permettre de transmettre les valeurs de rôles stockées dans l'objet du formulaire (userRolesForm) vers l'objet user
   */
  updateUser() {
    this.roles = [];
    console.log('roles', this.userRolesForm);
    for (let role of this.userRolesForm) {
      if (role.checked) {
        this.roles.push(role.value);
      }
    }
    this.userResult.roles = this.roles;
    this.userService.updateUserToServer(this.userResult);
  }

  deleteUser() {
    this.userService.deleteUserToServer(this.userResult);
  }
}
