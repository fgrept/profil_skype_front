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
  page:number = 1;
  numberOfProfil:number;
  searchForm:FormGroup;

  constructor(private userService: UserService,
              private profilsService: ProfilsService,
              private searchService: SearchService,
              private formBuilder:FormBuilder) {
  }

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();

    this.profilsService.getNumberOfProfilFromServer();
    this.profilNumbersuscribe = this.profilsService.numberProfilSubject.subscribe(
      (total:number) => {
        this.numberOfProfil = total;
      }
    );

    this.profilsService.getProfilsFromServer(this.page);
    this.profilSuscribe = this.profilsService.profilsSubject.subscribe(
        (profils: ProfilFromList[]) => {
          this.profilList2 = profils;
        }
      );

    this.searchSuscribe = this.searchService.searchSubject.subscribe(
        (inputText:string) => {
          this.searchText = inputText;
        }
      );

    this.searchForm = this.formBuilder.group(
        {searchSip : new FormControl(),
        searchFirstname : new FormControl(),
        searchLastname : new FormControl(),
        searchUo : new FormControl(),
        searchSite : new FormControl(),
        searchDialPlan : new FormControl(),
        searchStatus : new FormControl()
      }
      );
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
      this.searchForm.get('searchSip').value,
      null,
      null,
      this.searchForm.get('searchDialPlan').value,
      null,
      null,
      null,
      null,
      this.searchForm.get('searchStatus').value,
      null,
      null,
      this.searchForm.get('searchFirstname').value,
      this.searchForm.get('searchLastname').value,
      this.searchForm.get('searchUo').value,
      this.searchForm.get('searchSite').value
    );

    // in case of activation criteria, we reset the list at the first page => 1
    let p = 1;
    // the filtrer on boolean must not be "" but null
    
    if (profilSearch.statusProfile === '') {profilSearch.statusProfile = null}

    // actually, the back don't work if status is not set => ENABLED by default
    //if (profilSearch.statusProfile === '') {profilSearch.statusProfile = 'ENABLED'};

    this.profilsService.getProfilsFromServerWithCriteria(p, profilSearch );
    
    this.profilSuscribe = this.profilsService.profilsSubject.subscribe(
      (profils: ProfilFromList[]) => {
        this.profilList2 = profils;
      }
    );

  }

}
