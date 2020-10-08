/* tslint:disable:whitespace */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthentComponent } from './components/authent/authent.component';
import { ProfilListComponent } from './components/profil-list/profil-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { Routes, RouterModule } from '@angular/router';
import { ProfilListItemComponent } from './components/profil-list-item/profil-list-item.component';
import { UserService} from './services/user.service';
import { ProfilsService} from './services/profils.service';
import { AuthentGuardService } from './services/authent-guard.service';
import { UrlNotFoundComponent } from './components/url-not-found/url-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfilDetailComponent } from './components/profil-detail/profil-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilDetailEventsComponent } from './components/profil-detail-events/profil-detail-events.component';
import { UserListItemComponent } from './components/user-list-item/user-list-item.component';
import {UserDetailComponent} from './components/user-detail/user-detail.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { CollaboraterSearchComponent } from './components/collaborater-search/collaborater-search.component';
import { UserCreateRoleComponent } from './components/user-create-role/user-create-role.component';
import { FilterProfilPipe } from './pipes/filter-profil.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogModalComponent } from './components/dialog-modal/dialog-modal.component';
import { CollaboraterSearchItemComponent } from './components/collaborater-search-item/collaborater-search-item.component';
import { DialogModalFormComponent } from './components/dialog-modal-form/dialog-modal-form.component';
import { ProfilCreateComponent } from './components/profil-create/profil-create.component';
import { ProfilCreateFormComponent } from './components/profil-create-form/profil-create-form.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const appRoutes: Routes = [
  {path: 'profils', canActivate:[AuthentGuardService],component : ProfilListComponent},
  {path: 'profils/create',component:ProfilCreateComponent},
  {path: 'profils/create/:idUser',component:ProfilCreateFormComponent},
  {path: 'users', canActivate:[AuthentGuardService],component:UserListComponent},
  {path: 'auth', component:AuthentComponent},
  {path: 'profils/:idProfil',component:ProfilDetailComponent},
  {path: 'profils/:idProfil/events',component:ProfilDetailEventsComponent},
  {path: 'users/create',component:UserCreateComponent},
  {path: 'users/create/:idUser',component:UserCreateRoleComponent},
  {path: 'users/:idUser',component:UserDetailComponent},
  {path: 'account',component:UserAccountComponent},
  {path: '', component:ProfilListComponent,},
  {path: 'not-found', component:UrlNotFoundComponent},
  {path: '**', redirectTo: 'not-found'}
];

@NgModule({
  declarations: [
    AppComponent,
    AuthentComponent,
    ProfilListComponent,
    UserListComponent,
    ProfilListItemComponent,
    UrlNotFoundComponent,
    ProfilDetailComponent,
    ProfilDetailEventsComponent,
    UserListItemComponent,
    UserDetailComponent,
    UserCreateComponent,
    CollaboraterSearchComponent,
    UserCreateRoleComponent,
    FilterProfilPipe,
    DialogModalComponent,
    CollaboraterSearchItemComponent,
    DialogModalFormComponent,
    ProfilCreateComponent,
    ProfilCreateFormComponent,
    UserAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbModule,
    FontAwesomeModule
  ],
  providers: [AuthentGuardService,
              UserService,
              ProfilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
