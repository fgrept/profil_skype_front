import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ProfilsService} from '../../services/profils.service';
import {ProfilFromList} from '../../models/profil-to-show';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-collaborater-search-item',
  templateUrl: './collaborater-search-item.component.html',
  styleUrls: ['./collaborater-search-item.component.css']
})
export class CollaboraterSearchItemComponent implements OnInit, OnDestroy {

  @Input() collaborater;
  @Input() idUser: string;
  @Input() type: string;

  profilFromServer: ProfilFromList;
  profilSuscribe: Subscription;
  isAvailable: boolean;
  userIdRoute: string;

  constructor(private userService: UserService,
              private profilService: ProfilsService,
              private router: Router) { }

  ngOnDestroy(): void {
        console.log('Destruction de la fenêtre');
        if (this.profilSuscribe !== null && this.profilSuscribe !== undefined) {
          this.profilSuscribe.unsubscribe();
        }
    }

  ngOnInit(): void {
    console.log('Entrée id User : ', this.idUser);
    console.log('Entrée collaborater : ', this.collaborater);
    console.log('Entrée type : ', this.type);
    this.isAvailable = false;
    this.userIdRoute = this.idUser;
  }

  private isExistsUser(): boolean {
    if (this.userService.getUserFromListByCollaboraterId(this.idUser) === null) {
      console.log('User inexistant, création possible');
      return false;
    } else {
      console.log('User existe déjà, pas de création !');
      return true;
    }
  }

  private verifyExistsProfil(): void{
    this.profilService.getProfilFromServerByCollaboraterId(this.idUser);
  }

  getRoute(collaboraterId: string) {
    if (this.type === 'user') {
      if (this.isExistsUser()) {
        alert('user existe déjà');
      } else {
        this.router.navigate(['users/create/' + this.userIdRoute]);
      }
    }
    if (this.type === 'profil') {
      this.OnCreateProfil();
      this.verifyExistsProfil();
    }
  }

  private OnCreateProfil() {
    this.profilSuscribe = this.profilService.getProfilSubject.subscribe(
        (profil: ProfilFromList) => {
          this.profilFromServer = profil;
          if (profil !== null && profil !== undefined){
            console.log('le profil n\'existe pas');
            this.router.navigate(['profils/create/' + this.userIdRoute]);
          }else {
            console.log('le profil existe déjà !');
          }
        },
        (error) => {
          console.log('error code : ', error.status);
          if (error.status === '404') {
            console.log('erreur 404 suite appel backend');
            this.router.navigate(['profils/create/' + this.userIdRoute]);
//            this.router.navigate(['profils/create/' + this.idUser]);
          } else {
            console.log('Erreur bloquante', error.status);
            alert('Erreur bloquante' + error.status);
          }
        }
    );
  }
}
