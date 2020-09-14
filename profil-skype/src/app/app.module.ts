import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthentComponent } from './components/authent/authent.component';
import { ProfilListComponent } from './components/profil-list/profil-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { Routes, RouterModule } from '@angular/router';
import { ProfilListItemComponent } from './components/profil-list-item/profil-list-item.component';
import { ProfilConsultComponent } from './components/profil-consult/profil-consult.component';
import { UserService} from './services/user.service'
import { AuthentGuardService } from './services/authent-guard.service';
import { UrlNotFoundComponent } from './components/url-not-found/url-not-found.component';

const appRoutes: Routes = [
  {path:'profils', canActivate:[AuthentGuardService],component : ProfilListComponent},
  {path:'users', canActivate:[AuthentGuardService],component:UserListComponent},
  {path:'auth',component:AuthentComponent},
  {path:'', component:ProfilListComponent,},
  {path:'not-found', component:UrlNotFoundComponent},
  {path:'**', redirectTo:'not-found'}
]

@NgModule({
  declarations: [
    AppComponent,
    AuthentComponent,
    ProfilListComponent,
    UserListComponent,
    ProfilListItemComponent,
    ProfilConsultComponent,
    UrlNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthentGuardService,
              UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
