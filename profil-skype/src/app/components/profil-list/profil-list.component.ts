import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { ProfilFromList } from 'src/app/models/profil-to-show';
import { ProfilsService } from 'src/app/services/profils.service';
import { SearchService } from 'src/app/services/search.service';
import { FilterProfilPipe } from '../../pipes/filter-profil.pipe';

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

  constructor(private userService: UserService,
              private profilsService: ProfilsService,
              private searchService: SearchService) {
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
      )
  }

  onPageChanged(pageDemand:number) {
    this.page = pageDemand;
    this.profilsService.getProfilsFromServer(pageDemand);
    this.profilSuscribe = this.profilsService.profilsSubject.subscribe(
      (profils: ProfilFromList[]) => {
        this.profilList2 = profils;
      }
    );
  }

}
