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
    
    this.filterForm = this.formBuilder.group(
      {searchSip : new FormControl(),
      searchFirstname : new FormControl(),
      searchLastname : new FormControl(),
      searchUo : new FormControl(),
      searchSite : new FormControl(),
      searchDialPlan : new FormControl(),
      searchStatus : new FormControl(),
      searchSamAccount: new FormControl(),
      searchVoiceEnabled : new FormControl(),
      searchVoicePolicy : new FormControl(),
      searchExUm : new FormControl(),
      searchExchUser : new FormControl(),
      searchObjectClass : new FormControl()
      }
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

    // TODO :
    // - activate the other filters according to the available template fields
    // - count the new number of profil with the criteria
    // TESTS : filtre ne marche pas sur dialplan
    let profilSearch = new ProfilFromList (
      this.filterForm.get('searchSip').value,
      this.filterForm.get('searchVoiceEnabled').value,
      this.filterForm.get('searchVoicePolicy').value,
      this.filterForm.get('searchDialPlan').value,
      this.filterForm.get('searchSamAccount').value, // +
      this.filterForm.get('searchExUm').value,
      this.filterForm.get('searchExchUser').value,
      this.filterForm.get('searchObjectClass').value,
      this.filterForm.get('searchStatus').value,
      null, // collaboraterId
      null, // expirationDate
      this.filterForm.get('searchFirstname').value,
      this.filterForm.get('searchLastname').value,
      this.filterForm.get('searchUo').value,
      this.filterForm.get('searchSite').value
    );

    // in case of activation criteria, we reset the list at the first page => 1
    let p = 1;
    // the filtrer on boolean must not be "" but null
    if (profilSearch.statusProfile === '') {profilSearch.statusProfile = null}

    this.profilsService.getProfilsFromServerWithCriteria(p, profilSearch );
    
    this.profilSuscribe = this.profilsService.profilsSubject.subscribe(
      (profils: ProfilFromList[]) => {
        this.profilList2 = profils;
      }
    );

  }

}
