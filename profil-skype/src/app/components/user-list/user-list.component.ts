import {Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription, Subject } from 'rxjs';
import {UserResult} from '../../models/user-result';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
/**
 * Classe parente pour l'affichage de la liste des utilisateurs
 */
export class UserListComponent implements OnInit {

  currentUserType;
  userListResult: UserResult[];
  userSubscribe: Subscription;

  constructor(private userService: UserService) { }


    /**
     * Récupération à l'initialisation de la liste des utilisateurs et du rôle courant
     */
  ngOnInit(): void {
      this.userListResult = this.userService.getUsers();
      this.currentUserType = this.userService.getCurrentRole();
      console.log('users en cours', this.userService.getUsers());
      if (this.userListResult === null) {
          this.userService.getUsersFromServer();
          this.userSubscribe = this.userService.getusersSubject().subscribe(
              (users: UserResult[]) => {
                  this.userListResult = users;
                  console.log(this.userListResult);
              }
          );
      } else {
          console.log('liste en cours', this.userService.getUsers());
      }
  }

}
