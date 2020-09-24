import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription, Subject } from 'rxjs';
import { ProfilFromList } from 'src/app/models/profil-to-show';
import {UserResult} from '../../models/user-result';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  currentUserType;
  userListResult: UserResult[];
  userSubscribe: Subscription;

  constructor(private userService: UserService) { }


  ngOnInit(): void {
      this.currentUserType = this.userService.getCurrentRole();
      this.userService.getUsersFromServer();
      this.userSubscribe = this.userService.usersSubject.subscribe(
        (users: UserResult[]) => {
          this.userListResult = users;
          console.log(this.userListResult);
        }
    );
  }

}
