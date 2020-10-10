import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserService} from './services/user.service';
import {Subscription} from 'rxjs';
import {SearchService} from './services/search.service';
import {ProfilsService} from './services/profils.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DialogModalComponent} from "./components/partagé/dialog-modal/dialog-modal.component";

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
  searchForm:FormGroup;
  private showSidebar:boolean=false;
  showFilterButton: boolean=false;
  // properties for the additional actions button in the navbar
  button2Name: string;
  // options pour la fenêtre modale
  modalOptions: NgbModalOptions = {};

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private searchService: SearchService,
              private profilService: ProfilsService,
              private modalService: NgbModal,
              private router: Router
              // ,
              // private cd: ChangeDetectorRef
  )
  {
  }
  //
  // ngOnDestroy(): void {
  //
  //   this.userSuscribe.unsubscribe();
  //   this.profilService.buttonFilterSubject.unsubscribe();
  //   this.userService.userSubject.unsubscribe();
  // }

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


    this.searchForm = this.formBuilder.group(
      {search: new FormControl()}
      );

    this.searchForm.valueChanges.subscribe(form => this.onSearchInput(form));

    this.profilService.buttonFilterSubject.subscribe(
      (status) => {
        (status) ? this.showFilterButton = true : this.showFilterButton = false;
        this.button2Name = "Creer"
      }
    );
  }

  onSearchInput(form) {
    this.searchService.searchSubject.next(form.search);
  }

  /**
   * method for routing to other component and actualize the conditionnal items of the navbar
   * @param route 
   */
  routingTo(route:string) {
//    this.cd.detectChanges();
    this.profilService.buttonFilterSubject.subscribe(
      () => this.router.navigate([route])
    );

    if (route === 'profils') {
      this.profilService.buttonFilterSubject.next(true);
    } else {
      this.showSidebar = false;
      $('#sidebar').hide();
      this.profilService.buttonFilterSubject.next(false);
    }
  }

  /**
   * method for moving sidebar
   */
  collapseSideBar() {
    this.showSidebar = ! this.showSidebar;
    // use jquery for the slideshow effect, waiting of other best UI components   
    this.showSidebar ? $('#sidebar').slideDown(300): $('#sidebar').slideUp(300);
    
  }

  actionButtonTwo() {
    this.profilService.buttonFilterSubject.next(false);
    this.router.navigate(['/profils/create']);
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


