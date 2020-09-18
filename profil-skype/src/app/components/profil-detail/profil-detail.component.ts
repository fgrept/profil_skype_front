import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfilsService } from 'src/app/services/profils.service';
import { ProfilFromList } from 'src/app/models/profil-to-show';
import { FormBuilder, FormControl, FormGroup, FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { from } from 'rxjs';
import { ProfilRaw } from 'src/app/models/profil-raw';

@Component({
  selector: 'app-profil-detail',
  templateUrl: './profil-detail.component.html',
  styleUrls: ['./profil-detail.component.css']
})
export class ProfilDetailComponent implements OnInit {

  idProfil:number;
  profilToShow:ProfilFromList;
  profilForm:FormGroup;
  currentUserType;
  changedNotAuthorized:Boolean;
  voiceEnabled:Boolean;


  constructor(private route:ActivatedRoute,
              private profilService:ProfilsService,
              private formBuilder:FormBuilder,
              private userService:UserService) { }

  ngOnInit(): void {
    this.idProfil = this.route.snapshot.params['idProfil'];
    this.profilToShow = this.profilService.getProfilById(this.idProfil);
    this.currentUserType = this.userService.getCurrentRole();
    
    this.currentUserType == 1 ? this.changedNotAuthorized = true : this.changedNotAuthorized = false;
    this.profilToShow.enterpriseVoiceEnabled == 'true' ? this.voiceEnabled = true : this.voiceEnabled = false;

    this.profilForm = this.formBuilder.group({
      sip: [{value : this.profilToShow.sip, disabled : this.changedNotAuthorized},
            Validators.required],
      voice: [{value : this.profilToShow.enterpriseVoiceEnabled, disabled : this.changedNotAuthorized},
            Validators.required],
      voicepolicy: [{value : this.profilToShow.voicePolicy, disabled : this.changedNotAuthorized},
              Validators.required],
      //voiceoui : [{disabled : this.changedNotAuthorized}],
      //voicenon : [{disabled : this.changedNotAuthorized}],
      //utiliser les validators ???
      dialPlan: [{value : this.profilToShow.dialPlan, disabled : this.changedNotAuthorized},
            Validators.required],
      samAccount: [{value : this.profilToShow.samAccountName, disabled : this.changedNotAuthorized},
            Validators.required],
      exUm: [{value : this.profilToShow.exUmEnabled, disabled : this.changedNotAuthorized},
            Validators.required],
      exchUser: [{value : this.profilToShow.exchUser, disabled : this.changedNotAuthorized},
            Validators.required],
      objectClass: [{value : this.profilToShow.objectClass, disabled : this.changedNotAuthorized},
            Validators.required],
      status: [{value : this.profilToShow.statusProfile, disabled : this.changedNotAuthorized},
            Validators.required]
        });
    }

  validateForm() {   
    const profilChanged = new ProfilRaw (
                          this.profilForm.value['sip'],
                          this.profilForm.value['voice'],
                          this.profilForm.value['voicepolicy'],
                          this.profilForm.value['dialPlan'],
                          this.profilForm.value['samAccount'],
                          this.profilForm.value['exUm'],
                          this.profilForm.value['exchUser'],
                          this.profilForm.value['objectClass'],
                          this.profilForm.value['statusProfile']);

    this.profilService.updateProfilToServer(profilChanged,this.profilToShow.collaboraterId,"300000","commentaire GF");
  }

  deleteProfil() { 
      this.profilService.deleteProfilToServer(this.profilForm.value['sip']);
    }

}
