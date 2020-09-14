import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { UserService } from './services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, OnDestroy {
  
  currentUserType;
  userSuscribe: Subscription;

  constructor(private userService:UserService) { }

  ngOnDestroy(): void {
    this.userSuscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.userSuscribe = this.userService.userSubject.subscribe(
      (user) => {
        this.currentUserType= user;
      }
    );
    if (!this.currentUserType) {
        this.currentUserType = 0;      
    }
  }

}


