import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-authent',
  templateUrl: './authent.component.html',
  styleUrls: ['./authent.component.css']
})
export class AuthentComponent implements OnInit {

  currentUserType;

  constructor(private userService:UserService) {
    
   }

  ngOnInit(): void {
    this.currentUserType=this.userService.userAuth;
  }

  updateUserRole (roleChosen) {
    this.currentUserType = roleChosen;
    //console.log(this.currentUserType);
    this.userService.updateRole(roleChosen);
  }
}
