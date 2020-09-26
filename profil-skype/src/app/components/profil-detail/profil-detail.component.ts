import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilsService } from 'src/app/services/profils.service';
import { ProfilFromList } from 'src/app/models/profil-to-show';
import { AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
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
  statusProfile = [{name : 'actif', value : 'ENABLED', checked : false, disabled: false},
                  {name : 'désactivé', value: 'DISABLED', checked : false, disabled: false},
                  {name : 'expiré', value: 'EXPIRED', checked: false, disabled: true}];

  currentUserType;
  changedNotAuthorized: boolean;
  profilDesactivated = false;
  profilInputDesactivated = false;
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
    this.profilToShow.statusProfile === 'DISABLED' ? this.profilInputDesactivated = true : this.profilInputDesactivated = false;
    this.profilInputDesactivated = this.changedNotAuthorized || this.profilInputDesactivated;

    this.profilToShow.enterpriseVoiceEnabled === 'true' ? this.voiceEnabled[0].checked = true : this.voiceEnabled[1].checked = true;
    this.profilToShow.exUmEnabled === 'true' ? this.exUmEnabled[0].checked = true : this.exUmEnabled[1].checked = true;

    if (this.profilToShow.statusProfile === 'ENABLED') {
        this.statusProfile[0].checked = true;
    }
    if (this.profilToShow.statusProfile === 'DISABLED') {
        this.statusProfile[1].checked = true;
    }
    if (this.profilToShow.statusProfile === 'EXPIRED') {
        this.statusProfile[2].checked = true;
    }

    this.profilForm = this.formBuilder.group({
      sip: [{value : this.profilToShow.sip, disabled : this.profilInputDesactivated},
            [Validators.required,
            Validators.pattern('^sip:.*$')]],
      voiceEnabled: [{value : this.profilToShow.enterpriseVoiceEnabled, disabled : this.profilInputDesactivated},
            Validators.required],
      voicepolicy: [{value : this.profilToShow.voicePolicy, disabled : this.profilInputDesactivated},
            Validators.required],
      dialPlan: [{value : this.profilToShow.dialPlan, disabled : this.profilInputDesactivated},
            Validators.required],
      samAccount: [{value : this.profilToShow.samAccountName, disabled : this.profilInputDesactivated},
            Validators.required],
      exUmEnabled: [{value : this.profilToShow.exUmEnabled, disabled : this.profilInputDesactivated},
            Validators.required],
      exchUser: [{value : this.profilToShow.exchUser, disabled : this.profilInputDesactivated},
            Validators.required],
      objectClass: [{value : this.profilToShow.objectClass, disabled : this.profilInputDesactivated},
            Validators.required],
      status: [{value : this.profilToShow.statusProfile, disabled : this.changedNotAuthorized},
            Validators.required]
        });
    }

    updateProfil() {

      profilChanged: ProfilRaw;

      if (this.profilForm.value.status === 'DISABLED') {
            const profilChanged = new ProfilRaw (
                  this.profilToShow.sip,
                  this.profilToShow.enterpriseVoiceEnabled,
                  this.profilToShow.voicePolicy,
                  this.profilToShow.dialPlan,
                  this.profilToShow.samAccountName,
                  this.profilToShow.exUmEnabled,
                  this.profilToShow.exchUser,
                  this.profilToShow.objectClass,
                  this.profilForm.value.status);
            this.profilService.updateSubject.subscribe(
                        (response: Object) => {
                              console.log(response);
                              this.router.navigate(['/profils']);
                        }
                  );
            this.profilService.updateProfilToServer(profilChanged,this.profilToShow.collaboraterId,'000000','commentaire GF');

      } else { // ENABLED
          const profilChanged = new ProfilRaw (
            this.profilForm.value.sip,
            this.profilForm.value.voiceEnabled,
            this.profilForm.value.voicepolicy,
            this.profilForm.value.dialPlan,
            this.profilForm.value.samAccount,
            this.profilForm.value.exUmEnabled,
            this.profilForm.value.exchUser,
            this.profilForm.value.objectClass,
            this.profilForm.value.status);

            this.profilService.updateSubject.subscribe(
                  (response: Object) => {
                        console.log(response);
                        this.router.navigate(['/profils']);
                  }
            );
          this.profilService.updateProfilToServer(profilChanged, this.profilToShow.collaboraterId, '000000', 'commentaire GF');

      }
    }

    deleteProfil() {
      this.profilService.deleteSubject.subscribe(
            (response: Object) => {
                  console.log(response);
                  this.router.navigate(['/profils']);
            }
      );
      if (this.profilForm.value.status === 'DISABLED') {
            this.profilService.deleteProfilToServer(this.profilToShow.sip);
      } else {
            this.profilService.deleteProfilToServer(this.profilForm.value.sip);
      }
      ;
    }

    checkActiveInput(statusSelected: string) {
          console.log(statusSelected);
          if (statusSelected === 'DISABLED') {
            /* not possible to refresh the config dynamically
            this.profilDesactivated = true;
            this.profilInputDesactivated = this.changedNotAuthorized || this.profilInputDesactivated;*/

            /* HOW TO :
            // - use this if you want just to update the value-field of control
            this.profilForm.patchValue({sip : 'TOTO'})
            // - use this if you want set an existing control
            this.profilForm.setControl('sip', this.formBuilder.control({value : this.profilToShow.sip, disabled : true}));
            */

            // we set the profil before reconstruction of the form
            /*this.profilToShow.sip = this.profilForm.value.sip;
            this.profilToShow.enterpriseVoiceEnabled = this.profilForm.value.voiceEnabled;
            this.profilToShow.voicePolicy = this.profilForm.value.voicepolicy;
            this.profilToShow.dialPlan = this.profilForm.value.dialPlan;
            this.profilToShow.samAccountName = this.profilForm.value.samAccount;
            this.profilToShow.exUmEnabled = this.profilForm.value.exUmEnabled;
            this.profilToShow.exchUser = this.profilForm.value.exchUser;
            this.profilToShow.objectClass = this.profilForm.value.objectClass;*/

            // form re-build
            this.profilForm.setControl('sip', this.formBuilder.control({value : this.profilToShow.sip, disabled : true},
                                    [Validators.required,
                                    Validators.pattern('^sip:.*$')]));
            this.profilForm.setControl('voiceEnabled',
                this.formBuilder.control({value : this.profilToShow.enterpriseVoiceEnabled, disabled : true}));
            this.profilForm.setControl('voicepolicy',
                this.formBuilder.control({value : this.profilToShow.voicePolicy, disabled : true}));
            this.profilForm.setControl('dialPlan',
                this.formBuilder.control({value : this.profilToShow.dialPlan, disabled : true}));
            this.profilForm.setControl('samAccount',
                this.formBuilder.control({value : this.profilToShow.samAccountName, disabled : true}));
            this.profilForm.setControl('exUmEnabled',
                this.formBuilder.control({value :
                    this.profilToShow.exUmEnabled, disabled : true}));
            this.profilForm.setControl('exchUser',
                this.formBuilder.control({value : this.profilToShow.exchUser, disabled : true}));
            this.profilForm.setControl('objectClass',
                this.formBuilder.control({value : this.profilToShow.objectClass, disabled : true}));
          } else {
            /* not possible to refresh the config dynamically
            this.profilDesactivated = false;
            this.profilInputDesactivated = this.changedNotAuthorized || this.profilInputDesactivated;*/

            this.profilForm.setControl('sip', this.formBuilder.control({value : this.profilToShow.sip, disabled : false},
                  [Validators.required,
                  Validators.pattern('^sip:.*$')]));
            this.profilForm.setControl('voiceEnabled', this.formBuilder.control(
                {value : this.profilToShow.enterpriseVoiceEnabled, disabled : false}));
            this.profilForm.setControl('voicepolicy', this.formBuilder.control(
                {value : this.profilToShow.voicePolicy, disabled : false}));
            this.profilForm.setControl('dialPlan', this.formBuilder.control(
                {value : this.profilToShow.dialPlan, disabled : false}));
            this.profilForm.setControl('samAccount', this.formBuilder.control(
                {value : this.profilToShow.samAccountName, disabled : false}));
            this.profilForm.setControl('exUmEnabled', this.formBuilder.control(
                {value : this.profilToShow.exUmEnabled, disabled : false}));
            this.profilForm.setControl('exchUser', this.formBuilder.control(
                {value : this.profilToShow.exchUser, disabled : false}));
            this.profilForm.setControl('objectClass', this.formBuilder.control(
                {value : this.profilToShow.objectClass, disabled : false}));
          }
    }
}
