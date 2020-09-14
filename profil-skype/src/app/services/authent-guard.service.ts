import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentGuardService implements CanActivate {
  currentUserType;
  userSuscribe: Subscription;
  
  constructor(private userService: UserService,
              private router: Router) { 
                this.userSuscribe = this.userService.userSubject.subscribe(
                  (user) => {
                    this.currentUserType= user;
                  }
                );
              }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.currentUserType != 0) {
      return true;
    } else {
      this.router.navigate(['/auth']);
    }
  }
}
