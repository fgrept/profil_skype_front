import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ProfilsService} from "../../services/profils.service";

@Component({
  selector: 'app-collaborater-search-item',
  templateUrl: './collaborater-search-item.component.html',
  styleUrls: ['./collaborater-search-item.component.css']
})
export class CollaboraterSearchItemComponent implements OnInit {

  @Input() collaborater;
  @Input() idUser: string;
  @Input() type: string;

  isAvailable: boolean;
  constructor(private userService: UserService,
              private profilService: ProfilsService) { }

  ngOnInit(): void {
    console.log('Entrée id User : ', this.idUser);
    console.log('Entrée collaborater : ', this.collaborater);
    console.log('Entrée type : ', this.type);
    this.isAvailable = true;
  }

  // verifyUser() {
  //   if (this.userService.getUserFromListByCollaboraterId(this.idUser) === null) {
  //     console.log('User inexistant');
  //     this.router.navigate(['/users/create/' + this.idUser]);
  //   }else {
  //     console.log('User existe déjà !');
  //   }
  // }
  isExists(): boolean {

    if (this.type === 'user') {
      return this.isExistsUser();
    }
    if (this.type === 'profil') {
      return this.isExistsProfil();
    }
    console.log('type inconnu');
    return false;

  }

  private isExistsUser(): boolean {
    if (this.userService.getUserFromListByCollaboraterId(this.idUser) === null) {
      console.log('User inexistant, création possible');
      return true;
    } else {
      console.log('User existe déjà, pas de création !');
      return false;
    }
  }

  private isExistsProfil(): boolean {
    if (this.profilService.getProfilFromListByCollaboraterId(this.idUser) === null ) {
      console.log('Profil inexistant, création possible');
      return true;
    } else {
      return false;
    }
  }
}
