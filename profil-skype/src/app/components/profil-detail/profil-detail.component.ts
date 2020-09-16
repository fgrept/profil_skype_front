import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfilsService } from 'src/app/services/profils.service';
import { ProfilShort } from 'src/app/models/profil-short';
import { FormBuilder, FormGroup, FormsModule,ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profil-detail',
  templateUrl: './profil-detail.component.html',
  styleUrls: ['./profil-detail.component.css']
})
export class ProfilDetailComponent implements OnInit {

  idProfil:number;
  profilToShow:ProfilShort;
  profilForm:FormGroup;
  currentUserType;
  changedNotAuthorized:Boolean;


  constructor(private route:ActivatedRoute,
              private profilService:ProfilsService,
              private formBuilder:FormBuilder,
              private userService:UserService) { }

  ngOnInit(): void {
    this.idProfil = this.route.snapshot.params['idProfil'];
    this.profilToShow = this.profilService.getProfilById(this.idProfil);
    this.currentUserType = this.userService.getCurrentRole();
    if (this.currentUserType == 1) {
        this.changedNotAuthorized = true;
      } else {
        this.changedNotAuthorized = false;
    }
    this.profilForm = this.formBuilder.group({
      sip: [{value : this.profilToShow.sip, disabled : this.changedNotAuthorized}],
      voice: [{value: this.profilToShow.voicePolicy, disabled : this.changedNotAuthorized}] ,
      dialPlan: [{value : this.profilToShow.dialPlan, disabled : this.changedNotAuthorized}],
      samAccount: [{value : this.profilToShow.samAccountName, disabled : this.changedNotAuthorized}],
      exUm: [{value : this.profilToShow.exUmEnabled, disabled : this.changedNotAuthorized}],
      exchUser: [{value : this.profilToShow.exchUser, disabled : this.changedNotAuthorized}],
      objectClass: [{value : this.profilToShow.objectClass, disabled : this.changedNotAuthorized}],
      status: [{value : this.profilToShow.statusProfile, disabled : this.changedNotAuthorized}]});
    }

  validateForm() {

  }

}
