import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {UserResult} from '../../../models/user/user-result';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DialogModalComponent} from '../../partagé/dialog-modal/dialog-modal.component';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, OnDestroy {

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
  private userUpdateSubscription:Subscription;
  private userDeleteSubscription:Subscription;
  private sucessSubscription:Subscription;

  // variables pour l'affichage d'une popup
  successSubject = new Subject<string>();
  successMessage: string;
  availableMessage = false;

  // options pour la fenêtre modale
  modalOptions: NgbModalOptions = {};

  constructor(private routeUser: ActivatedRoute,
              private userService: UserService,
              private formBuilderUser: FormBuilder,
              private modalService: NgbModal,
              private router: Router) {}

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

  ngOnDestroy(): void {
      if (this.sucessSubscription) {this.sucessSubscription.unsubscribe()};
      if (this.userDeleteSubscription) {this.userDeleteSubscription.unsubscribe()};
      if (this.userUpdateSubscription) {this.userUpdateSubscription.unsubscribe()};
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
    for (const item of this.userResult.roles) {
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
    for (const role of this.userRolesForm) {
      if (role.checked) {
        this.roles.push(role.value);
      }
    }
    this.userResult.roles = this.roles;

    this.userUpdateSubscription = this.userService.userUpdateSubject.subscribe(
      (response: Object) => {
        console.log(response);
        // update server done : display confirm box then routing
        this.emitAlertAndRouting('Mise à jour effectuée');
      }
    );
    
    const modalRef = this.openModal();
    modalRef.result.then(
        confirm => {
          console.log('retour modal', confirm);
          if (confirm.toString() === 'Confirm') {
            this.userService.updateUserToServer(this.userResult);
          }
        }, dismiss => {
          console.log('retour modal', dismiss);
        }
    );

  }

  /**
   * Suppression de l'utilisateur sur confirmation depuis la fenêtre modale.
   * Après suppression,
   */
  deleteUser() {

    this.userDeleteSubscription = this.userService.userDeleteSubject.subscribe(
      (response: Object) => {
        console.log(response);
        // update server done : display confirm box then routing
        this.emitAlertAndRouting('Suppression effectuée');
      }
    );

    const modalRef = this.openModal();
    modalRef.result.then(
        confirm => {
          console.log('retour modal', confirm);
          if (confirm.toString() === 'Confirm') {
            this.userService.deleteUserToServer(this.userResult);
            this.userService.deleteUserFromList(this.userResult);
          }
        }, dismiss => {
          console.log('retour modal', dismiss);
        }
    );

  }

  /**
   * Paramétrage de la fenêtre modale
   */
  openModal(): NgbModalRef {

    this.modalOptions.backdrop = 'static';
    this.modalOptions.keyboard = false;
    this.modalOptions.centered = true;
    const modalDiag = this.modalService.open(DialogModalComponent, this.modalOptions);
    modalDiag.componentInstance.message = 'Confirmez-vous la suppression de l\'id ' + this.userResult.collaboraterId + '?';
    modalDiag.componentInstance.title = 'Demande de suppression';
    return modalDiag;
  }

  emitAlertAndRouting(message:string) {
    this.successMessage = message;
    this.availableMessage = true;
    this.sucessSubscription = this.successSubject.pipe(debounceTime(2000)).subscribe(
        () => {
            this.successMessage = '';
            this.availableMessage = false;
            this.router.navigate(['/users'])
        }
    );
    this.successSubject.next();
  }

}
