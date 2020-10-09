import {Component, OnDestroy, OnInit} from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subscription, Subject } from 'rxjs';
import {UserResult} from '../../../models/user/user-result';
import {debounceTime} from 'rxjs/operators';

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
    private successSubscription:Subscription;
    private getUserDeleteSubscription:Subscription;
    successSubject = new Subject<string>();
    successMessage: string;
    availableMessage = false;

  constructor(private userService: UserService) { }
    ngOnDestroy(): void {
        if (this.getUserDeleteSubscription) {this.getUserDeleteSubscription.unsubscribe()};
        if (this.userSubscription) {this.userSubscription.unsubscribe()};
        if (this.successSubscription) {this.successSubscription.unsubscribe()};
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
      this.initAlert();
      this.isDeletedUser();
  }

    initAlert() {
        this.successSubscription = this.successSubject.subscribe(message => this.successMessage = message);
        this.successSubject.pipe(
            debounceTime(2000)
        ).subscribe(() => {
            this.successMessage = '';
            this.availableMessage = false;
        });
    }

    isDeletedUser() {
      this.getUserDeleteSubscription = this.userService.getUserDeleteSubject().subscribe(
          (response) => {
              console.log(response);
              this.changeSuccessMessage('Suppression effectuée');
          }
      );
    }

    changeSuccessMessage(message: string) {
        this.availableMessage = true;
        this.successSubject.next(message);
    }

}
