import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { ProfilFromList } from 'src/app/models/profil-to-show';
import { ProfilsService } from 'src/app/services/profils.service';
import { SearchService } from 'src/app/services/search.service';
import { FilterProfilPipe } from '../../pipes/filter-profil.pipe';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profil-list',
  templateUrl: './profil-list.component.html',
  styleUrls: ['./profil-list.component.css']
})
export class ProfilListComponent implements OnInit {

  currentUserType;
  profilList2: ProfilFromList[];
  profilSuscribe: Subscription;
  profilNumbersuscribe: Subscription;
  searchSuscribe: Subscription;
  searchText:string;
  page:number;
  numberOfProfil:number;
  filterForm:FormGroup;
  navDisplayed:boolean=false;
  //for search filter:
  voiceChecked:boolean=false;
  voiceEnabled:boolean=false;

  constructor(private userService: UserService,
              private profilsService: ProfilsService,
              private searchService: SearchService,
              private formBuilder:FormBuilder) {
  }

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();

    this.profilNumbersuscribe = this.profilsService.numberProfilSubject.subscribe(
          (total:number) => {
            this.numberOfProfil = total;
          }
        );
    this.profilsService.getNumberOfProfilFromServer();

    this.profilSuscribe = this.profilsService.profilsSubject.subscribe(
        (profils: ProfilFromList[]) => {
          this.profilList2 = profils;
        }
      );

    this.page = this.profilsService.pageListToShow;
    this.profilsService.getProfilsFromServer(this.profilsService.pageListToShow);

    this.searchSuscribe = this.searchService.searchSubject.subscribe(
        (inputText:string) => {
          this.searchText = inputText;
        }
      );
    
    this.profilsService.buttonFilterSubject.next(true);
    this.profilsService.buttonFilterSubject.subscribe(
      (value) => (value) ? this.navDisplayed = true : this.navDisplayed = false
    );
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
    this.filterForm.controls['searchVoiceEnabled'].setValue(false);
    this.filterForm.controls['searchVoicePolicy'].setValue(false);
    this.filterForm.controls['searchVoiceEnabled'].disable();
    this.filterForm.controls['searchVoicePolicy'].disable();

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
    this.profilSuscribe = this.profilsService.profilsSubject.subscribe(
      (profils: ProfilFromList[]) => {
        this.profilList2 = profils;
      }
    );
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
    
    this.profilSuscribe = this.profilsService.profilsSubject.subscribe(
      (profils: ProfilFromList[]) => {
        this.profilList2 = profils;
      }
    );

  }

  onResetForm(): void {
    this.filterForm.reset();
    this.voiceChecked = false;
    this.voiceEnabled = false;
    this.profilsService.getProfilsFromServer(this.page);
    this.profilSuscribe = this.profilsService.profilsSubject.subscribe(
      (profils: ProfilFromList[]) => {
        this.profilList2 = profils;
      }
    );
  }

  onVoiceClick() {
    // internal boolean because of problem for catching the value of the control
    this.voiceChecked = ! this.voiceChecked;
    if (this.voiceChecked) {
      this.filterForm.get('searchVoiceEnabled').enable();
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

}
