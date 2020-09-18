import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription, Subject } from 'rxjs';
import { ProfilFromList } from 'src/app/models/profil-to-show';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  currentUserType;

  constructor() { }


  ngOnInit(): void {
  }

}
