import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css']
})
/**
 * classe fille qui permet l'affichage de l'utilisateur sélectionné
 */
export class UserListItemComponent implements OnInit {

  @Input() user;
  @Input() idUser: number;
  currentUserType;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();
  }

}
