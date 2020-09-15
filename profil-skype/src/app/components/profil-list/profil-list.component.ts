import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { ProfilShort } from 'src/app/models/profil-short';
import { ProfilsService } from 'src/app/services/profils.service';

@Component({
  selector: 'app-profil-list',
  templateUrl: './profil-list.component.html',
  styleUrls: ['./profil-list.component.css']
})
export class ProfilListComponent implements OnInit {

  currentUserType;
  profilList2: ProfilShort[];
  profilSuscribe: Subscription;

  constructor(private userService:UserService, private profilsService:ProfilsService) {
  }

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();
    
    this.profilsService.getProfilsFromServer();
    this.profilSuscribe = this.profilsService.profilsSubject.subscribe(
        (profils: ProfilShort[]) => {
          this.profilList2 = profils;
          console.log(this.profilList2);
        }
      );
    
  }

}
