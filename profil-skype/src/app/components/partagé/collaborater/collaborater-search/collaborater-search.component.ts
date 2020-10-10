import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CollaboraterService} from '../../../../services/collaborater.service';
import {Collaborater} from '../../../../models/collaborater/collaborater';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from "rxjs/operators";
import {UserService} from "../../../../services/user.service";
import {ProfilsService} from "../../../../services/profils.service";

@Component({
  selector: 'app-collaborater-search',
  templateUrl: './collaborater-search.component.html',
  styleUrls: ['./collaborater-search.component.css']
})
export class CollaboraterSearchComponent implements OnInit, OnDestroy {

    @Input() type: string;
  collaboraterForm: FormGroup;
  collaboraterSearch: Collaborater;
  isSearched: boolean;
  collaboraterListResult: Collaborater[];
  private collaboraterSubscription: Subscription;
  idUser: string;
  page:number;

    // variables pour l'affichage d'une popup
    errorSubject = new Subject<string>();
    errorMessage: string;
    availableMessage = false;
    private errorSubscription: Subscription;

  constructor(private formBuilderCollaborater: FormBuilder,
              private collaboraterService: CollaboraterService,
              private userService: UserService,
              private profilService: ProfilsService) { }

    ngOnDestroy () {
        if (this.collaboraterSubscription !== null && this.collaboraterSubscription!== undefined) {
            this.collaboraterSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.isSearched = false;
        this.initializeForm();
        console.log(this.collaboraterSubscription);
        this.page = 1;
        // Emission d'un message à la création dès que le collaborateur sélectionné est déjà un utilisateur
        this.userService.userExistSubject.subscribe(
            user => {
                this.emitAlertAndRouting('L\'utilisateur ' + user + ' existe déjà');
            }
        );
        // Emission d'un message à la création dès que l'utilisateur sélectionné a déjà un profil
        this.profilService.profilExistSubject.subscribe(
            user => {
                this.emitAlertAndRouting('L\'utilisateur ' + user + ' a déjà un profil skype');
            }
        );
    }

    onResetForm(): void {
        this.isSearched = false;
        this.initializeForm();
    }

    /**
     * Méthode appelée sur clic du bouton Rechercher
     */
  onSearch() {
      this.initCollaboraterSearch();
      this.collaboraterService.getCollaboratersFromServer(this.collaboraterSearch);
      this.collaboraterSubscription = this.collaboraterService.getCollaboraterGetSubject().subscribe(
          (collaboraters: Collaborater[]) => {
              this.collaboraterListResult = collaboraters;
              console.log('liste collaborateurs', this.collaboraterListResult);
              console.log(this.collaboraterSubscription);
              // Pas d'affichage du tableau si aucun résultat trouvé
              if (this.collaboraterService.countApi > 0) {
                  this.isSearched = true;
              }
          }
      );
  }

    /**
     * Récupération des données de recherche issues du formulaire
     */
    initCollaboraterSearch() {
        this.collaboraterSearch = new Collaborater(
            this.collaboraterForm.value.collaboraterId,
            this.collaboraterForm.value.lastName,
            this.collaboraterForm.value.firstName,
            this.collaboraterForm.value.deskPhoneNumber,
            this.collaboraterForm.value.mobilePhoneNumber,
            this.collaboraterForm.value.mailAdress,
            this.collaboraterForm.value.orgaUnitCode,
            '',
            '',
            '',
            '',
            '',
            '',
            ''
        );
    }

    /**
     * Initialisation des données du formulaire
     */
    initializeForm() {
        this.collaboraterForm = this.formBuilderCollaborater.group({
                collaboraterId: '',
                lastName: '',
                firstName: '',
                deskPhoneNumber: '',
                mobilePhoneNumber: '',
                mailAdress: '',
                orgaUnitCode: ''
            }
        );
    }

    /**
     * Emission d'un message de type popup en cas de problème de connexion
     * @param message
     */
    emitAlertAndRouting(message: string) {
        this.errorMessage = message;
        this.availableMessage = true;
        this.errorSubscription = this.errorSubject.pipe(debounceTime(5000)).subscribe(
            () => {
                this.errorMessage = '';
                this.availableMessage = false;
            }
        );
        this.errorSubject.next();
    }
}
