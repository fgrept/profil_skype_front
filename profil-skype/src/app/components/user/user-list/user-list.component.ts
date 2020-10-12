import {Component, OnDestroy, OnInit} from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subscription, Subject } from 'rxjs';
import {UserResult} from '../../../models/user/user-result';
import {debounceTime} from 'rxjs/operators';
import {userMsg} from "../../../models/tech/user-msg";
import {TechnicalService} from "../../../services/technical.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
/**
 * Classe parente pour l'affichage de la liste des utilisateurs
 */
export class UserListComponent implements OnInit, OnDestroy {

    currentUserType;
    userListResult: UserResult[];
    private userSubscription: Subscription;
    private errorGetSubscription: Subscription;

    // pour le message d'erreur
    successMessage: string;
    availableMessage = false;
    typeMessage = 'success';

  constructor(private userService: UserService,
              private technicalService: TechnicalService) { }
    ngOnDestroy(): void {

        if (this.userSubscription) {this.userSubscription.unsubscribe(); }
        if (this.errorGetSubscription) {this.errorGetSubscription.unsubscribe(); }
    }


    /**
     * Récupération à l'initialisation de la liste des utilisateurs et du rôle courant
     */
  ngOnInit(): void {
      this.userListResult = this.userService.getUsers();
      this.currentUserType = this.userService.getCurrentRole();
      console.log('users en cours', this.userService.getUsers());
      if (this.userListResult === null) {
          this.userService.getUsersFromServer();
          this.userSubscription = this.userService.getusersSubject().subscribe(
              (users: UserResult[]) => {
                  this.userListResult = users;
                  console.log(this.userListResult);
              }
          );
      } else {
          console.log('liste en cours', this.userService.getUsers());
      }
      this.errorGetSubscription = this.technicalService.getErrorSubject.subscribe(
            (response: userMsg) => {

                this.emitAlertAndRouting('Impossible de récupérer la liste des utilisateurs, code erreur : ', response);
            }
        );
      /* this.initAlert();
      this.isDeletedUser(); */
  }
  // Normalement ce code ne sert plus car la suppression est effectuée dans le détail et le message s'affiche
  // avant d'effectuer le routing

    emitAlertAndRouting(message: string, response: userMsg) {
        this.successMessage = message.concat(response.msg);
        this.typeMessage = 'danger';
        this.availableMessage = true;
    }
}
