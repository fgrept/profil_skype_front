import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {UserService} from './services/user.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DialogModalComponent} from "./components/partagé/dialog-modal/dialog-modal.component";
import { faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // ,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent  implements OnInit{
  currentUserType;
  userSuscribe: Subscription;
  faSignOutAlt = faSignOutAlt;
  faUser = faUser;
  userLink = 0;
  profilLink = 0;
  authentLink = 0;
  // options pour la fenêtre modale
  modalOptions: NgbModalOptions = {};

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private router: Router
              // ,
              // private cd: ChangeDetectorRef
              ) { }

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();
    console.log('valeur init, currentUserType: ', this.currentUserType);
    this.userSuscribe = this.userService.userSubject.subscribe(
      user => {
        console.log('user reçu: ', user);
        this.currentUserType = user;
        if (this.currentUserType > 0) {
          this.routingTo('profils');
        }
         if (this.currentUserType === 0){
           this.routingTo('auth');
         }
        console.log('user reçu après routage: ', user);
      });
    if (!this.currentUserType) {
      this.currentUserType = 0;
      this.routingTo('auth');
    } else {
      if (this.currentUserType > 0) {
        this.routingTo('profils');
      }
    }
  }

  /**
   * method for routing to other component and actualize the conditionnal items of the navbar
   * @param route 
   */
  routingTo(route:string) {
    this.authentLink = 0;
    this.userLink = 0;
    this.profilLink = 0;
    switch (route) {
      case 'auth':
        this.authentLink = 1;
        break;
      case 'profils':
        this.profilLink = 1;
        break;
      case 'users':
        this.userLink = 1;
        break;
      case 'account':
        this.authentLink = 1;
        break;
      default:
        break;
    }

    this.router.navigate([route]);
  }

  /**
   * Lors d'une déconexion, on supprimer les variables de la localSotrage.
   * On positionne le rôle à 0 pour que le composant parent redirige vers la fenêtre de connexion
   */
  OnDisconnect() {
    const modalRef = this.openModal();
    modalRef.result.then(
        confirm => {
          console.log('retour modal', confirm);
          if (confirm.toString() === 'Confirm') {
            this.userService.updateRole(0);
            localStorage.clear();
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
    modalDiag.componentInstance.message = 'Souhaitez-vous vous déconnecter de l\'application ?';
    modalDiag.componentInstance.title = 'Demande de déconnexion';
    return modalDiag;
  }
}


