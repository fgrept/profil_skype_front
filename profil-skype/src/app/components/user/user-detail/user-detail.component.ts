import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {UserResult} from '../../../models/user/user-result';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DialogModalComponent} from '../../partagé/dialog-modal/dialog-modal.component';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { userMsg } from 'src/app/models/tech/user-msg';
import {TechnicalService} from '../../../services/technical.service';


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
  private userUpdateSubscription: Subscription;
  private userDeleteSubscription: Subscription;
  private successSubscription: Subscription;

  // variables pour l'affichage d'une popup
  successSubject = new Subject<string>();
  successMessage: string;
  availableMessage:boolean = false;
  typeMessage = 'success';

  // options pour la fenêtre modale
  modalOptions: NgbModalOptions = {};

  linkMail: string;
  linkPhoneDesk: string;
  linkPhoneMobile: string;

  currentAddress: string;
  isCurrentAddressAvailable = false;

  urlMapGoogleDir = 'https://www.google.com/maps/dir/?api=1&origin=';
  urlMapGoogleSearch = 'https://www.google.com/maps/search/?api=1&query=';

  linkLocate: string;

  constructor(private routeUser: ActivatedRoute,
              private userService: UserService,
              private technicalService: TechnicalService,
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
    this.getLocation();
    this.toFormatLinkMapGoogle();
  }

  ngOnDestroy(): void {
      if (this.successSubscription) {this.successSubscription.unsubscribe(); }
      if (this.userDeleteSubscription) {this.userDeleteSubscription.unsubscribe(); }
      if (this.userUpdateSubscription) {this.userUpdateSubscription.unsubscribe(); }
  }

  /**
   * intialisation des données du formulaire
   */
  initForm() {

    this.initRoles();
    // formatage de l'adresse (donnée non modifiable)
    this.localisation = this.userResult.siteAddress.concat(' ', this.userResult.sitePostalCode, ' ', this.userResult.siteCity);
    this.userForm = this.formBuilderUser.group({

      userRolesForm: this.userRolesForm
    });
    this.linkMail = 'mailto:' + this.userResult.mailAdress + '&subject=A propos de votre profil skype';
    this.linkPhoneDesk = 'tel:' + this.userResult.deskPhoneNumber;
    this.linkPhoneMobile = 'tel:' + this.userResult.mobilePhoneNumber;
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
      (response: userMsg) => {
        // update server done : display confirm box then routing
        this.emitAlertAndRouting('Mise à jour effectuée', response);
    }
    );

    this.userService.updateUserToServer(this.userResult);

  }

  /**
   * Suppression de l'utilisateur sur confirmation depuis la fenêtre modale.
   * Après suppression,
   */
  deleteUser() {
    this.userDeleteSubscription = this.userService.userDeleteSubject.subscribe(
      (response: userMsg) => {
        // update server done : display confirm box then routing
        this.emitAlertAndRouting('Suppression effectuée', response);
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


  emitAlertAndRouting(message: string, response: userMsg) {

    if (response.success) {
        this.successMessage = message;
        this.typeMessage = 'success';
        this.availableMessage = true;
        this.successSubscription = this.successSubject.pipe(debounceTime(2000)).subscribe(
            () => {
                this.successMessage = '';
                this.availableMessage = false;
                this.router.navigate(['/users']);
            }
        );
        this.successSubject.next();
    } else {
        this.successMessage = response.msg;
        this.typeMessage = 'danger';
        this.availableMessage = true;
    }
  }
  getLocation(): void{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        console.log('longitude: ' + longitude + ' latitude: ' + latitude);
        this.getCurrentAddress(longitude, latitude);
      });
    } else {
      console.log('No support for geolocation');
    }
  }


   getCurrentAddress(longitude: number, latitude: number) {
    this.technicalService.getGeoSubject.subscribe(
        // la réponse est un objet GeoJSON de type FeatureCollection
        // il respecte la norme RFC 7946
        (response:
            {
          type: string,
          version: string,
          features: [
            {
              type: string
              // , geometry: {
              //   type: string,
              //   coordinates: [number]
              // }
              , properties: {
                label: string
                // , score: number,
                // housenumber: string,
                // id: string,
                // type: string,
                // x: number,
                // y: number,
                // importance: number,
                // name: string,
                // postcode: string,
                // citycode: string,
                // city: string,
                // context: string,
                // street: string,
                // distance: number
              }
            }
          ]
          //     , attribution: string,
          // licence: string,
          // limit: number
       }
        ) => {
            this.isCurrentAddressAvailable = true;
            console.log('response', response);
          // récupération de l'adresse
            this.currentAddress = response.features[0].properties.label;
            this.toFormatLinkMapGoogle();
        }
    );
    this.technicalService.getCurrentPosition(longitude, latitude);
  }

    toFormatLinkMapGoogle() {
        if (this.isCurrentAddressAvailable) {
            this.linkLocate = this.urlMapGoogleDir + this.currentAddress + '&destination=' + this.localisation;
            console.log('lien vers google', this.linkLocate);
        }else {
            this.linkLocate = this.urlMapGoogleSearch + this.localisation;
        }
    }
}

