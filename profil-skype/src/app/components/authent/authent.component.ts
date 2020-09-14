import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-authent',
  templateUrl: './authent.component.html',
  styleUrls: ['./authent.component.css']
})
export class AuthentComponent implements OnInit {

  currentUserType;
  userSuscribe: Subscription;

  constructor(private userService:UserService) {
    
   }

  ngOnInit(): void {
    this.userSuscribe = this.userService.userSubject.subscribe(
      (user) => {
        this.currentUserType= user;
      }
    );
  }

  updateUserRole (roleChosen) {
    this.userService.updateRole(roleChosen);
  }
}
