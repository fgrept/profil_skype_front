import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilsService } from 'src/app/services/profils.service';
import { ProfilFromList } from 'src/app/models/profil-to-show';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ProfilRaw } from 'src/app/models/profil-raw';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profil-detail',
  templateUrl: './profil-detail.component.html',
  styleUrls: ['./profil-detail.component.css']
})
export class ProfilDetailComponent implements OnInit {

  idProfil: number;
  profilToShow: ProfilFromList;
  profilForm: FormGroup;
  voiceEnabled = [{name : 'oui', value : 'true', checked : false},
                  {name : 'non', value: 'false', checked : false}];
  exUmEnabled = [{name : 'oui', value : 'true', checked : false},
                  {name : 'non', value: 'false', checked : false}];
  currentUserType;
  changedNotAuthorized: boolean;
  updateSuscribe: Subscription;


  constructor(private route: ActivatedRoute,
              private profilService: ProfilsService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.idProfil = this.route.snapshot.params.idProfil;
    this.profilToShow = this.profilService.getProfilById(this.idProfil);
    this.currentUserType = this.userService.getCurrentRole();
    this.currentUserType === 1 ? this.changedNotAuthorized = true : this.changedNotAuthorized = false;
    if (this.profilToShow.enterpriseVoiceEnabled === 'true') {
          this.voiceEnabled[0].checked = true;
          this.voiceEnabled[1].checked = false;
    } else {
      this.voiceEnabled[0].checked = false;
      this.voiceEnabled[1].checked = true;
    }

    if (this.profilToShow.exUmEnabled === 'true') {
      this.exUmEnabled[0].checked = true;
      this.exUmEnabled[1].checked = false;
    } else {
      this.exUmEnabled[0].checked = false;
      this.exUmEnabled[1].checked = true;
    }

    this.profilForm = this.formBuilder.group({
      sip: [{value : this.profilToShow.sip, disabled : this.changedNotAuthorized},
            [Validators.required,
            Validators.pattern('^sip:.*$')]],
      voiceEnabled: [{value : this.profilToShow.enterpriseVoiceEnabled, disabled : this.changedNotAuthorized},
            Validators.required],
      voicepolicy: [{value : this.profilToShow.voicePolicy, disabled : this.changedNotAuthorized},
            Validators.required],
      dialPlan: [{value : this.profilToShow.dialPlan, disabled : this.changedNotAuthorized},
            Validators.required],
      samAccount: [{value : this.profilToShow.samAccountName, disabled : this.changedNotAuthorized},
            Validators.required],
      exUmEnabled: [{value : this.profilToShow.exUmEnabled, disabled : this.changedNotAuthorized},
            Validators.required],
      exchUser: [{value : this.profilToShow.exchUser, disabled : this.changedNotAuthorized},
            Validators.required],
      objectClass: [{value : this.profilToShow.objectClass, disabled : this.changedNotAuthorized},
            Validators.required],
      status: [{value : this.profilToShow.statusProfile, disabled : this.changedNotAuthorized},
            Validators.required]
        });
    }

  updateProfil() {
    const profilChanged = new ProfilRaw (
                          this.profilForm.value.sip,
                          this.profilForm.value.voiceEnabled,
                          this.profilForm.value.voicepolicy,
                          this.profilForm.value.dialPlan,
                          this.profilForm.value.samAccount,
                          this.profilForm.value.exUmEnabled,
                          this.profilForm.value.exchUser,
                          this.profilForm.value.objectClass,
                          this.profilForm.value.statusProfile);

    this.profilService.updateProfilToServer(profilChanged, this.profilToShow.collaboraterId, '300000', 'commentaire GF');
    // problem of refresh, even the server is callback (next call is good)
    this.profilService.updateSubject.subscribe(
          () => {
            this.router.navigate(['/profils']);
          }
    );
  }

  deleteProfil() {
      this.profilService.deleteProfilToServer(this.profilForm.value.sip);
      this.router.navigate(['/profils']);
    }

}
