import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CollaboraterService} from '../../services/collaborater.service';
import {Collaborater} from '../../models/collaborater';
import {Subscription} from 'rxjs';

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

  constructor(private formBuilderCollaborater: FormBuilder,
              private collaboraterService: CollaboraterService) { }

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
}
