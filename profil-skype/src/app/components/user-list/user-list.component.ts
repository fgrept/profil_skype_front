import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  currentUserType;
  userSuscribe: Subscription;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userSuscribe = this.userService.userSubject.subscribe(
      (user) => {
        this.currentUserType= user;
      }
    );
  }

}
