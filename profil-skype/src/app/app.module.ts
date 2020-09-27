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
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserCreateComponent } from './components/user-create/user-create.component';

const appRoutes: Routes = [
  {path: 'profils', canActivate:[AuthentGuardService],component : ProfilListComponent},
  {path: 'users', canActivate:[AuthentGuardService],component:UserListComponent},
  {path: 'auth', component:AuthentComponent},
  {path: 'profils/:idProfil',component:ProfilDetailComponent},
  {path: 'profils/:idProfil/events',component:ProfilDetailEventsComponent},
  {path: 'users/:idUser',component:UserDetailComponent},
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
    UserCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [AuthentGuardService,
              UserService,
              ProfilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
