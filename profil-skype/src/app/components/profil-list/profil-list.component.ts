import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Profil} from '../../profil';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profil-list',
  templateUrl: './profil-list.component.html',
  styleUrls: ['./profil-list.component.css']
})
export class ProfilListComponent implements OnInit {

  currentUserType;
  userSuscribe: Subscription;

  profilList = Array<{}>();
  profil1:Profil = {adresseSip : "titi@gmail.com", firstName:"james", lastName:"bond", orgaUnityCode:"8802", siteCode:"12594", statusProfile:"ENABLED"};
  profil2:Profil = {adresseSip : "tata@gmail.com", firstName:"albert", lastName:"einstein", orgaUnityCode:"8812", siteCode:"12584", statusProfile:"DISABLED"};
  profil3:Profil = {adresseSip : "tutu@gmail.com", firstName:"roger", lastName:"federer", orgaUnityCode:"8825", siteCode:"12574", statusProfile:"EXPIRED"};
  profil4:Profil = {adresseSip : "toto@gmail.com", firstName:"steve", lastName:"austin", orgaUnityCode:"8833", siteCode:"12544", statusProfile:"ENABLED"};
  profil5:Profil = {adresseSip : "tete@gmail.com", firstName:"mr", lastName:"bean", orgaUnityCode:"8874", siteCode:"12514", statusProfile:"ENABLED"};

  constructor(private userService:UserService) {
    this.profilList.push(this.profil1);
    this.profilList.push(this.profil2);
    this.profilList.push(this.profil3);
    this.profilList.push(this.profil4);
    this.profilList.push(this.profil5);
    
  }

  ngOnInit(): void {
    this.userSuscribe = this.userService.userSubject.subscribe(
      (user) => {
        this.currentUserType= user;
      }
    );
  }

}
