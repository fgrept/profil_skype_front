import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { ProfilsService } from 'src/app/services/profils.service';

@Component({
  selector: 'app-authent',
  templateUrl: './authent.component.html',
  styleUrls: ['./authent.component.css']
})
export class AuthentComponent implements OnInit {

  currentUserType;
  userSuscribe: Subscription;

  constructor(private userService: UserService,
              private profilService: ProfilsService) {}

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();
    this.profilService.buttonFilterSubject.next(false);
    // méthode inutile à part ajouter une couche d'abstraction et de la complexité
    /*this.userSuscribe = this.userService.userSubject.subscribe(
      (user) => {
        this.currentUserType= user;
      }
    );*/
  }

  updateUserRole(roleChosen) {
    this.userService.updateRole(roleChosen);
  }
}
