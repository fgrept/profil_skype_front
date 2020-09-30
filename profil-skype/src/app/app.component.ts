import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { UserService } from './services/user.service';
import { from, Subscription } from 'rxjs';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit, OnDestroy {
  currentUserType;
  userSuscribe: Subscription;
  searchForm:FormGroup;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private searchService: SearchService) { }

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

    this.searchForm.valueChanges.subscribe(form => this.onSearchInput(form))
  }

  onSearchInput(form) {
    this.searchService.searchSubject.next(form.search);
  }

}


