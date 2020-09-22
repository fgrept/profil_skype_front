import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profil-list-item',
  templateUrl: './profil-list-item.component.html',
  styleUrls: ['./profil-list-item.component.css']
})
export class ProfilListItemComponent implements OnInit {

  @Input() profil;
  @Input() idProfil: number;
  currentUserType;
  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.currentUserType = this.userService.getCurrentRole();
  }

}
