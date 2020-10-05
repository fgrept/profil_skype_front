import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { UserService } from './services/user.service';
import { from, Subscription } from 'rxjs';
import { SearchService } from './services/search.service';
import { ProfilsService } from './services/profils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, OnDestroy {
  currentUserType;
  userSuscribe: Subscription;
  searchForm:FormGroup;
  private showSidebar:boolean=false;
  showFilterButton:boolean=false;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private searchService: SearchService,
              private profilService: ProfilsService,
              private router:Router) { }

  ngOnDestroy(): void {
    this.userSuscribe.unsubscribe();
  }

  ngOnInit(): void {
    this.userSuscribe = this.userService.userSubject.subscribe(
      user => this.currentUserType = user);

    if (!this.currentUserType) {this.currentUserType = 0;}

    this.searchForm = this.formBuilder.group(
      {search: new FormControl()}
      );

    this.searchForm.valueChanges.subscribe(form => this.onSearchInput(form));

    this.profilService.buttonFilterSubject.subscribe(
      (status) => (status) ? this.showFilterButton = true : this.showFilterButton = false
    );
  }

  onSearchInput(form) {
    this.searchService.searchSubject.next(form.search);
  }

  /**
   * method for routing to other component and actualize the conditionnal items of the navbar
   * @param route 
   */
  routingTo(route:string) {
    if (route === 'profils') {
      this.profilService.buttonFilterSubject.next(true);
    } else {
      this.showSidebar = false;
      $('#sidebar').hide();
      this.profilService.buttonFilterSubject.next(false);
    }
    this.router.navigate([route]);
  }

  /**
   * method for moving sidebar
   */
  collapseSideBar() {
    this.showSidebar = ! this.showSidebar;
    // use jquery for the slideshow effect, waiting of other best UI components   
    this.showSidebar ? $('#sidebar').slideDown("slow"): $('#sidebar').slideUp();
    
  }

}


