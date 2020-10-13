import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { ProfilFromList } from 'src/app/models/profil/profil-to-show';
import { ProfilsService } from 'src/app/services/profils.service';
import { FilterProfilPipe } from '../../../pipes/filter-profil.pipe';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { faArrowsAltV, faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import {TechnicalService} from "../../../services/technical.service";
import {userMsg} from "../../../models/tech/user-msg";

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
  searchText: string;
  page: number;
  numberOfProfil: number;
  filterForm: FormGroup;
  searchForm:FormGroup;
  showSidebar:boolean=false;
  // for search filter:
  voiceChecked:boolean=false;
  voiceEnabled:boolean=false;
  // for column filter
  sortColum = Array<number>();
  faArrowsAltV = faArrowsAltV;
  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;

  // pour le message d'erreur
  successMessage: string;
  availableMessage = false;
  typeMessage = 'success';

  constructor(private userService: UserService,
              private profilsService: ProfilsService,
              private formBuilder:FormBuilder,
              private router: Router, 
              private technicalService: TechnicalService) {
   }

  ngOnDestroy(): void {
    if (this.search2Subscription) {this.search2Subscription.unsubscribe(); }
    if (this.profilSubscription) {this.profilSubscription.unsubscribe(); }
    if (this.profilNumberSubscription) {this.profilNumberSubscription.unsubscribe(); }
    if (this.errorGetSubscription) {this.errorGetSubscription.unsubscribe(); }
  }
  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();

    this.profilNumberSubscription = this.profilsService.numberProfilSubject.subscribe(
          (total: number) => {
            this.numberOfProfil = total;
          }
        );
    this.profilsService.getNumberOfProfilFromServer();

    this.profilSubscription = this.profilsService.profilsSubject.subscribe(
        (profils: ProfilFromList[]) => {
          this.profilList2 = profils;
        }
      );
    this.errorGetSubscription = this.technicalService.getErrorSubject.subscribe(
        (response: userMsg) => {

          this.emitAlertAndRouting('Impossible de récupérer les profils skype, code erreur : ', response);
        }
    );

    this.page = this.profilsService.pageListToShow;
    this.profilsService.getProfilsFromServer(this.profilsService.pageListToShow);
    
    this.filterForm = this.formBuilder.group(
      {searchId : new FormControl(),
      searchFirstName : new FormControl(),
      searchLastName : new FormControl(),
      searchUo : new FormControl(),
      searchSite : new FormControl(),
      searchSamAccount: new FormControl(),
      searchVoiceActivate: new FormControl(),
      searchVoiceEnabled : new FormControl(),
      searchVoicePolicy : new FormControl(),
      searchExpirationDate : new FormControl(),
      }
    );
    this.filterForm.controls['searchVoicePolicy'].setValue(false);
    this.filterForm.controls['searchVoiceEnabled'].disable();
    this.filterForm.controls['searchVoicePolicy'].disable();

    this.sortColum=[0,0,0,0,0,0,0];

    // for the search text in the page
    this.searchForm = this.formBuilder.group(
      {search: new FormControl()}
      );
    this.search2Subscription = this.searchForm.valueChanges.subscribe(
      () => this.searchText = this.searchForm.get('search').value
    );

      /* var el = document.getElementById('tata');
      document.addEventListener('scroll', (e) => {
        console.log('scroll : ' , document.documentElement.scrollHeight,
        ' - ' , document.documentElement.scrollTop, ' -' ,
        document.documentElement.scrollHeight);
        let pos:number = document.documentElement.scrollHeight - document.documentElement.scrollTop;
         el.style.top = pos.toString();
      }) */

  }

  /**
   * method for reload the list profils from server when another page is demanded
   * 
   * @param pageDemand 
   */
  onPageChanged(pageDemand:number) {
    this.page = pageDemand;
    this.profilsService.getProfilsFromServer(pageDemand);
  }

  /**
   * method for moving sidebar
   */
  collapseSideBar() {
    this.showSidebar = ! this.showSidebar;
    // use jquery for the slideshow effect, waiting of other best UI components   
    this.showSidebar ? $('#sidebar').slideDown(300): $('#sidebar').slideUp(300);
  }

  /**
   * method for reload the list profils form server with some criteria filters to applied
   */
  onSearchFilterClick() {

    let profilSearch = new ProfilFromList (
      null,
      this.filterForm.get('searchVoiceEnabled').value,
      this.filterForm.get('searchVoicePolicy').value,
      null,
      this.filterForm.get('searchSamAccount').value,
      null,
      null,
      null,
      null,
      this.filterForm.get('searchId').value, // collaboraterId
      this.filterForm.get('searchExpirationDate').value,
      this.filterForm.get('searchFirstName').value,
      this.filterForm.get('searchLastName').value,
      this.filterForm.get('searchUo').value,
      this.filterForm.get('searchSite').value
    );

    // in case of activation criteria, we reset the list at the first page => 1
    let p = 1;
    // the filtrer on boolean must not be "" but null
    if (profilSearch.statusProfile === '') {profilSearch.statusProfile = null}
    // filter on users having international option 
    if (profilSearch.voicePolicy.toString() === 'true') { //the value has a boolean type !
      profilSearch.voicePolicy = 'EMEA-VP-FR_BDDF_InternationalAuthorized'
    } else {
      profilSearch.voicePolicy = null;
    }

    this.profilsService.getProfilsFromServerWithCriteria(p, profilSearch );

  }

  onFilterExpired() {
    let profilSearch = new ProfilFromList (
      null,
      this.filterForm.get('searchVoiceEnabled').value,
      this.filterForm.get('searchVoicePolicy').value,
      null,
      this.filterForm.get('searchSamAccount').value,
      null,
      null,
      null,
      'ENABLED',
      this.filterForm.get('searchId').value, // collaboraterId
      this.filterForm.get('searchExpirationDate').value,
      this.filterForm.get('searchFirstName').value,
      this.filterForm.get('searchLastName').value,
      this.filterForm.get('searchUo').value,
      this.filterForm.get('searchSite').value
    );

    // in case of activation criteria, we reset the list at the first page => 1
    let p = 1;
    // the filtrer on boolean must not be "" but null
    if (profilSearch.statusProfile === '') {profilSearch.statusProfile = null}
    // filter on users having international option 
    if (profilSearch.voicePolicy.toString() === 'true') { //the value has a boolean type !
      profilSearch.voicePolicy = 'EMEA-VP-FR_BDDF_InternationalAuthorized'
    } else {
      profilSearch.voicePolicy = null;
    }

    this.profilsService.getProfilsFromServerWithCriteria(p, profilSearch );
    
    this.profilSubscription = this.profilsService.profilsSubject.subscribe(
      (profils: ProfilFromList[]) => {
        this.profilList2 = profils;
      }
    );


  } 

  routingTo(route:string) {
    //    this.cd.detectChanges();
    console.log("method_RoutingTo-Route =  :", route)
        // this.profilsService.buttonFilterSubject.subscribe(
        //   () => this.router.navigate([route])
        // );
        this.router.navigate([route]) 
    } 

  onResetForm(): void {
    this.filterForm.reset({value : ''});
    this.filterForm.controls['searchVoicePolicy'].setValue(false);
    this.filterForm.controls['searchVoiceEnabled'].disable();
    this.filterForm.controls['searchVoicePolicy'].disable();
    this.profilsService.getProfilsFromServer(this.page);
  }

  onVoiceClick() {
    // internal boolean because of problem for catching the value of the control
    this.voiceChecked = ! this.voiceChecked;
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
    this.voiceEnabled = ! this.voiceEnabled;
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
  onSortClick(col:number) {
    this.sortColum[col] == 0 ? this.sortColum[col] = 1 : this.sortColum[col]=-this.sortColum[col];
    
    switch (col) {
      case 0:
        if (this.sortColum[col]==1) {
          this.profilList2.sort((a,b) => ('' + a.sip).localeCompare(b.sip));
        } else {
          this.profilList2.sort((a,b) => ('' + b.sip).localeCompare(a.sip));
        }
        break;
      case 1:
        if (this.sortColum[col]==1) {
          this.profilList2.sort((a,b) => ('' + a.collaboraterId).localeCompare(b.collaboraterId));
        } else {
          this.profilList2.sort((a,b) => ('' + b.collaboraterId).localeCompare(a.collaboraterId));
        }
        
        break;
      case 2:
        if (this.sortColum[col]==1) {
          this.profilList2.sort((a,b) => ('' + a.firstName).localeCompare(b.firstName));
        } else {
          this.profilList2.sort((a,b) => ('' + b.firstName).localeCompare(a.firstName));
        }
        break;
      case 3:
        if (this.sortColum[col]==1) {
          this.profilList2.sort((a,b) => ('' + a.lastName).localeCompare(b.lastName));
        } else {
          this.profilList2.sort((a,b) => ('' + b.lastName).localeCompare(a.lastName));
        }
        break;
      case 4:
        if (this.sortColum[col]==1) {
          this.profilList2.sort((a,b) => ('' + a.orgaUnityCode).localeCompare(b.orgaUnityCode));
        } else {
          this.profilList2.sort((a,b) => ('' + b.orgaUnityCode).localeCompare(a.orgaUnityCode));
        }
        break;
      case 5:
        if (this.sortColum[col]==1) {
          this.profilList2.sort((a,b) => ('' + a.siteCode).localeCompare(b.siteCode));
        } else {
          this.profilList2.sort((a,b) => ('' + b.siteCode).localeCompare(a.siteCode));
        }
        break;
      case 6:
        if (this.sortColum[col]==1) {
          this.profilList2.sort((a,b) => ('' + a.statusProfile).localeCompare(b.statusProfile));
        } else {
          this.profilList2.sort((a,b) => ('' + b.statusProfile).localeCompare(a.statusProfile));
        }
        break;
      default:
        break;
    }
    //reset the others
    for (let index = 0; index < this.sortColum.length; index++) {
      if (index !== col) {this.sortColum[index]=0;}
    }
  }

   emitAlertAndRouting(message: string, response: userMsg) {
     this.successMessage = message.concat(response.msg);
     this.typeMessage = 'danger';
     this.availableMessage = true;
  }
}
