import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Observable, Subscription } from 'rxjs';
import { ProfilFromList } from 'src/app/models/profil/profil-to-show';
import { ProfilsService } from 'src/app/services/profils.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { faArrowsAltV, faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import {TechnicalService} from '../../../services/technical.service';
import {userMsg} from '../../../models/tech/user-msg';
import { LoaderService } from 'src/app/services/loader.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-profil-list',
  templateUrl: './profil-list.component.html',
  styleUrls: ['./profil-list.component.css']
})
export class ProfilListComponent implements OnInit, OnDestroy {


  currentUserType;
  profilList2: ProfilFromList[];
  private profilSubscription: Subscription;
  private profilNumberSubscription: Subscription;
  private search2Subscription: Subscription;
  private errorGetSubscription: Subscription;
  private successSubscription: Subscription;
  private reloadProfilsSubject: Subscription;
  searchText: string;
  page: number;
  numberOfProfil: number;
  filterForm: FormGroup;
  searchForm: FormGroup;
  showSidebar = false;
  smartphone = false;
  // for search filter:
  voiceChecked = false;
  voiceEnabled = false;
  searchFilter: boolean;
  searchExpiredActivate = false;
  isAuthorizedToActive = false;
  profilSearchSave: ProfilFromList;

  // for column filter
  sortColum = Array<number>();
  faArrowsAltV = faArrowsAltV;
  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;

  // pour les messages utilisateurs
  successMessage: string;
  availableMessage = false;
  typeMessage = 'success';
  successSubject = new Subject<string>();

  // pour la barre de chargement
  loaderSubject = new Subject();
  isLoading: boolean;

  constructor(private userService: UserService,
              private profilsService: ProfilsService,
              private formBuilder: FormBuilder,
              private router: Router,
              private technicalService: TechnicalService,
              private loaderService: LoaderService) {
  }

  ngOnDestroy(): void {
    if (this.search2Subscription) {
      this.search2Subscription.unsubscribe();
    }
    if (this.profilSubscription) {
      this.profilSubscription.unsubscribe();
    }
    if (this.profilNumberSubscription) {
      this.profilNumberSubscription.unsubscribe();
    }
    if (this.errorGetSubscription) {
      this.errorGetSubscription.unsubscribe();
    }
    if (this.successSubscription) {
      this.successSubscription.unsubscribe();
    }
    if (this.reloadProfilsSubject) {
      this.reloadProfilsSubject.unsubscribe();
    }

  }

  ngOnInit(): void {

    this.isLoading = this.loaderService.isLoading;
    console.log('isLoading from loaderService', this.isLoading);
    // Désactivation de l'animation de chargement à l'arrivée de la réponse
    this.loaderService.loaderSubject.subscribe(
        (response: boolean) => {
          this.isLoading = response;
          console.log('loading désactivé', response);
        }
    );

    this.searchFilter = false;
    this.currentUserType = this.userService.getCurrentRole();
    if (this.currentUserType === 2 || this.currentUserType === 3) {
      this.isAuthorizedToActive = true;
    }

    this.profilNumberSubscription = this.profilsService.numberProfilSubject.subscribe(
        (total: number) => {
          this.numberOfProfil = total;
        }
    );
    this.profilsService.getNumberOfProfilFromServer();

    this.profilSubscription = this.profilsService.profilsSubject.subscribe(
        (profils: ProfilFromList[]) => {
          // do nothing in case of expiration profils list
          if (!this.searchExpiredActivate) {
            this.profilList2 = profils;

            // in case of criteria :
            // if (this.searchFilter) {
            //   this.numberOfProfil = profils.length;
            // }
            // if (this.searchFilter && profils.length === 10) {
            //   console.log('partiel');
            //   this.successMessage = 'Résultats partiels (' + profils.length + '). Affiner votre recherche.';
            //   this.typeMessage = 'warning';
            //   this.availableMessage = true;
            //   this.successSubscription = this.successSubject.pipe(debounceTime(2000)).subscribe(
            //       () => {
            //         this.successMessage = '';
            //         this.availableMessage = false;
            //       }
            //   );
            //   this.successSubject.next();
            // }

          }
        }
    );

    this.errorGetSubscription = this.technicalService.getErrorSubject.subscribe(
        (response: userMsg) => {
          this.emitAlertAndRouting('Impossible de récupérer les profils skype, code erreur : ', response);
        }
    );

    this.page = 1;
    this.profilsService.getProfilsFromServer(1);

    this.filterForm = this.formBuilder.group(
        {
          searchId: new FormControl(),
          searchFirstName: new FormControl(),
          searchLastName: new FormControl(),
          searchUo: new FormControl(),
          searchSite: new FormControl(),
          searchSamAccount: new FormControl(),
          searchVoiceActivate: new FormControl(),
          searchVoiceEnabled: new FormControl(),
          searchVoicePolicy: new FormControl(),
          searchExpirationDate: new FormControl(),
        }
    );
    this.filterForm.controls['searchVoicePolicy'].setValue(false);
    this.filterForm.controls['searchVoiceEnabled'].disable();
    this.filterForm.controls['searchVoicePolicy'].disable();


    this.sortColum = [0, 0, 0, 0, 0, 0, 0];

    // for the search text in the page
    this.searchForm = this.formBuilder.group(
        {search: new FormControl()}
    );
    this.search2Subscription = this.searchForm.valueChanges.subscribe(
        () => this.searchText = this.searchForm.get('search').value
    );

    // for reload the page when profil expired update is done
    this.profilsService.reloadProfilsSubject.subscribe(
        () => {
          this.searchExpiredActivate = false;
          this.onResetForm();
          console.log('victoire');
        }
    );



    this.detectSmartphone();

  }

  /**
   * method for reload the list profils from server when another page is demanded
   *
   * @param pageDemand
   */
  onPageChanged(pageDemand: number) {

    this.page = pageDemand;
    if (this.searchFilter) {
      this.profilsService.getProfilsFromServerWithCriteria(this.page, this.profilSearchSave);
    }
    this.profilsService.getProfilsFromServer(pageDemand);
  }

  /**
   * method for moving sidebar
   */
  collapseSideBar() {
    this.showSidebar = !this.showSidebar;
    // use jquery for the slideshow effect, waiting of other best UI components
    this.showSidebar ? $('#sidebar').slideDown(300) : $('#sidebar').slideUp(300);
  }

  /**
   * method for reload the list profils form server with some criteria filters to applied
   */
  onSearchFilterClick() {

    let profilSearch = new ProfilFromList(
        null,
        this.filterForm.get('searchVoiceEnabled').value,
        this.filterForm.get('searchVoicePolicy').value,
        null,
        this.filterForm.get('searchSamAccount').value,
        null,
        null,
        null,
        ((this.searchExpiredActivate) ? 'EXPIRED' : null),
        this.filterForm.get('searchId').value, // collaboraterId
        this.filterForm.get('searchExpirationDate').value,
        this.filterForm.get('searchFirstName').value,
        this.filterForm.get('searchLastName').value,
        this.filterForm.get('searchUo').value,
        this.filterForm.get('searchSite').value
    );

    // the filtrer on boolean must not be "" but null
    if (profilSearch.statusProfile === '') {
      profilSearch.statusProfile = null
    }
    // filter on users having international option
    if (profilSearch.voicePolicy.toString() === 'true') { // the value has a boolean type !
      profilSearch.voicePolicy = 'EMEA-VP-FR_BDDF_InternationalAuthorized';
    } else {
      profilSearch.voicePolicy = null;
    }
    this.searchFilter = true;
    this.page = 1;
    this.profilSearchSave = profilSearch;
    this.profilsService.getProfilsFromServerWithCriteria(this.page, profilSearch);

  }

  switchToExpirated() {
    this.filterForm.disable();
    this.searchExpiredActivate = true;
    this.onSearchFilterClick();
  }

  routingTo(route: string) {
    this.router.navigate([route]);
  }

  onResetForm(): void {
    this.filterForm.enable();
    this.filterForm.reset({value: ''});
    this.filterForm.controls['searchVoicePolicy'].setValue(false);
    this.filterForm.controls['searchVoiceEnabled'].disable();
    this.filterForm.controls['searchVoicePolicy'].disable();
    this.searchFilter = false;
    this.profilsService.getNumberOfProfilFromServer();
    this.page = 1;
    this.profilsService.getProfilsFromServer(this.page);
    // subcomponent Expired
    this.searchExpiredActivate = false;
  }

  onVoiceClick() {
    // internal boolean because of problem for catching the value of the control
    this.voiceChecked = !this.voiceChecked;
    if (this.voiceChecked) {
      this.filterForm.get('searchVoiceEnabled').enable();
      this.filterForm.controls['searchVoiceEnabled'].setValue(false);
    } else {
      this.filterForm.get('searchVoiceEnabled').disable();
      this.filterForm.get('searchVoicePolicy').disable();
    }
  }

  onVoiceEnabledClick() {
    // internal boolean because of problem for catching the value of the control
    this.voiceEnabled = !this.voiceEnabled;
    if (this.voiceEnabled) {
      this.filterForm.get('searchVoicePolicy').enable();
    } else {
      this.filterForm.get('searchVoicePolicy').disable();
    }
  }

  /**
   * method for filtering the column of the list
   * @param col
   */
  onSortClick(col: number) {
    this.sortColum[col] === 0 ? this.sortColum[col] = 1 : this.sortColum[col] = -this.sortColum[col];

    switch (col) {
      case 0:
        if (this.sortColum[col] === 1) {
          this.profilList2.sort((a, b) => ('' + a.sip).localeCompare(b.sip));
        } else {
          this.profilList2.sort((a, b) => ('' + b.sip).localeCompare(a.sip));
        }
        break;
      case 1:
        if (this.sortColum[col] === 1) {
          this.profilList2.sort((a, b) => ('' + a.collaboraterId).localeCompare(b.collaboraterId));
        } else {
          this.profilList2.sort((a, b) => ('' + b.collaboraterId).localeCompare(a.collaboraterId));
        }

        break;
      case 2:
        if (this.sortColum[col] === 1) {
          this.profilList2.sort((a, b) => ('' + a.firstName).localeCompare(b.firstName));
        } else {
          this.profilList2.sort((a, b) => ('' + b.firstName).localeCompare(a.firstName));
        }
        break;
      case 3:
        if (this.sortColum[col] === 1) {
          this.profilList2.sort((a, b) => ('' + a.lastName).localeCompare(b.lastName));
        } else {
          this.profilList2.sort((a, b) => ('' + b.lastName).localeCompare(a.lastName));
        }
        break;
      case 4:
        if (this.sortColum[col] === 1) {
          this.profilList2.sort((a, b) => ('' + a.orgaUnityCode).localeCompare(b.orgaUnityCode));
        } else {
          this.profilList2.sort((a, b) => ('' + b.orgaUnityCode).localeCompare(a.orgaUnityCode));
        }
        break;
      case 5:
        if (this.sortColum[col] === 1) {
          this.profilList2.sort((a, b) => ('' + a.siteCode).localeCompare(b.siteCode));
        } else {
          this.profilList2.sort((a, b) => ('' + b.siteCode).localeCompare(a.siteCode));
        }
        break;
      case 6:
        if (this.sortColum[col] === 1) {
          this.profilList2.sort((a, b) => ('' + a.statusProfile).localeCompare(b.statusProfile));
        } else {
          this.profilList2.sort((a, b) => ('' + b.statusProfile).localeCompare(a.statusProfile));
        }
        break;
      default:
        break;
    }
    // reset the others
    for (let index = 0; index < this.sortColum.length; index++) {
      if (index !== col) {
        this.sortColum[index] = 0;
      }
    }
  }

  emitAlertAndRouting(message: string, response: userMsg) {
    this.successMessage = message.concat(response.msg);
    this.typeMessage = 'danger';
    this.availableMessage = true;
  }

  getColorHeader(index:number) {
    if (this.sortColum[index] === 1) return 'rgb(168, 226, 168)';
    if (this.sortColum[index] === -1) return 'rgb(211, 115, 115)';
    return 'initial';
  }

  /**
   * method for hiding element when the boostrap hiding properties break the style
   */
  detectSmartphone () {
    let size = document.body.offsetWidth;
    if (size < 576) {this.smartphone = true; }
  }
}
