import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ProfilsService} from '../../../../services/profils.service';
import {ProfilFromList} from '../../../../models/profil/profil-to-show';
import {Subscription} from 'rxjs';
import {HttpResponse} from "@angular/common/http";

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
  profilSubscription: Subscription;
  isAvailable: boolean;
  userIdRoute: string;

  constructor(private userService: UserService,
              private profilService: ProfilsService,
              private router: Router) { }

  ngOnDestroy(): void {
        console.log('Destruction de la fenêtre');
        if (this.profilSubscription !== null && this.profilSubscription !== undefined) {
          this.profilSubscription.unsubscribe();
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
        this.userService.userExist(this.idUser);
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
    this.profilSubscription = this.profilService.getProfilSubject.subscribe(
        (response: HttpResponse<ProfilFromList>) => {
          console.log('collaborater - onCreateProfil, response get: ', response);
          this.profilFromServer = response.body;
          if (response.status === 200) {
            console.log('le profil existe déjà');
            this.profilService.profilExist(this.idUser);
          }
          if (response.status === 404 || response.status === 204) {
              console.log('le profil n\'existe pas');
              this.router.navigate(['profils/create/' + this.userIdRoute]);
          }
        },
        (error) => {
          console.log('error code : ', error.status);
        }
    );
  }
}
