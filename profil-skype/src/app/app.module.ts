import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthentComponent } from './authent/authent.component';
import { ProfilListComponent } from './profil-list/profil-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { Routes, RouterModule } from '@angular/router';
import { ProfilListItemComponent } from './profil-list-item/profil-list-item.component';
import { ProfilConsultComponent } from './profil-consult/profil-consult.component';

const appRoutes: Routes = [
  {path:'profils', component : ProfilListComponent},
  {path:'users', component:UserListComponent},
  {path:'auth', component:AuthentComponent},
  {path:'', component:ProfilListComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    AuthentComponent,
    ProfilListComponent,
    UserListComponent,
    ProfilListItemComponent,
    ProfilConsultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
