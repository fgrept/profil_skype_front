import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ProfilsService } from 'src/app/services/profils.service';

@Component({
  selector: 'app-profil-list-item',
  templateUrl: './profil-list-item.component.html',
  styleUrls: ['./profil-list-item.component.css']
})
/**
 * Classe enfant qui récupère le profil sélectionné et l'affiche
 */
export class ProfilListItemComponent implements OnInit {

  @Input() profil;
  @Input() idProfil: number;
  currentUserType;
  constructor(private userService: UserService,
              private router: Router,
              private profilService: ProfilsService) {
  }

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();
  }

  routingTo() {
    let url = '/profils/' + this.idProfil;
    this.profilService.buttonFilterSubject.next(false);
    this.router.navigate([url]);
  }

}
