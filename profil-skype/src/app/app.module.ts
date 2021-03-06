/* tslint:disable:whitespace */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthentComponent } from './components/partagé/authent/authent.component';
import { ProfilListComponent } from './components/Profil/profil-list/profil-list.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { Routes, RouterModule } from '@angular/router';
import { ProfilListItemComponent } from './components/Profil/profil-list-item/profil-list-item.component';
import { UserService} from './services/user.service';
import { ProfilsService} from './services/profils.service';
import { AuthentGuardService } from './services/authent-guard.service';
import { UrlNotFoundComponent } from './components/partagé/url-not-found/url-not-found.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ProfilDetailComponent } from './components/Profil/profil-detail/profil-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilDetailEventsComponent } from './components/Profil/profil-detail-events/profil-detail-events.component';
import { UserListItemComponent } from './components/user/user-list-item/user-list-item.component';
import {UserDetailComponent} from './components/user/user-detail/user-detail.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { UserCreateComponent } from './components/user/user-create/user-create.component';
import { CollaboraterSearchComponent } from './components/partagé/collaborater/collaborater-search/collaborater-search.component';
import { UserCreateRoleComponent } from './components/user/user-create-role/user-create-role.component';
import { FilterProfilPipe } from './pipes/filter-profil.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogModalComponent } from './components/partagé/dialog-modal/dialog-modal.component';
import { CollaboraterSearchItemComponent } from './components/partagé/collaborater/collaborater-search-item/collaborater-search-item.component';
import { DialogModalFormComponent } from './components/partagé/dialog-modal-form/dialog-modal-form.component';
import { ProfilCreateComponent } from './components/Profil/profil-create/profil-create.component';
import { ProfilCreateFormComponent } from './components/Profil/profil-create-form/profil-create-form.component';
import { UserAccountComponent } from './components/user/user-account/user-account.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {HttpErrorInterceptor} from './interceptor/http-error.interceptor';
import {TokenInterceptor} from './interceptor/token.interceptor';

// import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';
import { ProfilDetailEventsItemComponent } from './components/Profil/profil-detail-events-item/profil-detail-events-item.component';
import { ProfilExpiredbisComponent } from './components/Profil/profil-expiredbis/profil-expiredbis.component';
import { ProfilExpiredbisItemComponent } from './components/Profil/profil-expiredbis-item/profil-expiredbis-item.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptor/loader.interceptor';
import {NgxLoadingModule} from "ngx-loading";

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
    UserAccountComponent,
    ProfilDetailEventsItemComponent,
    ProfilExpiredbisComponent,
    ProfilExpiredbisItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    NgxLoadingModule,
    /*
        ,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    */
  ],
  providers: [AuthentGuardService,
              UserService,
              ProfilsService,
              LoaderService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi:true}
//    ,{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
