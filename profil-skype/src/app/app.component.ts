import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy, AfterContentChecked, ChangeDetectorRef} from '@angular/core';
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
  // properties for the additional actions button in the navbar
  button2Name:string;

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
      (status) => {
        (status) ? this.showFilterButton = true : this.showFilterButton = false;
        this.button2Name = "Creer"
      }
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
    this.profilService.buttonFilterSubject.subscribe(
      () => this.router.navigate([route])
    );

    if (route === 'profils') {
      this.profilService.buttonFilterSubject.next(true);
    } else {
      this.showSidebar = false;
      $('#sidebar').hide();
      this.profilService.buttonFilterSubject.next(false);
    }
    
  }

  /**
   * method for moving sidebar
   */
  collapseSideBar() {
    this.showSidebar = ! this.showSidebar;
    // use jquery for the slideshow effect, waiting of other best UI components   
    this.showSidebar ? $('#sidebar').slideDown(300): $('#sidebar').slideUp(300);
    
  }

  actionButtonTwo() {
    this.profilService.buttonFilterSubject.next(false);
    this.router.navigate(['/profils/create']);
  }

}


