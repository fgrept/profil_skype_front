import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilsService } from 'src/app/services/profils.service';
import { ProfilFromList } from 'src/app/models/profil-to-show';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
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
  updateAuthorized:boolean;

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
            [Validators.required]],
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

      this.profilForm.valueChanges.subscribe(form => this.checkUpdateAuthorized(form));
      this.profilForm.get('status').valueChanges.subscribe(form => this.checkActiveInput2(form))
    }

    checkActiveInput2(value) {
      if (value === 'DISABLED') {
            // TODO : reset the value at their origin, or set the status of the control
            //this.profilForm.value['sip'] = this.profilToShow.sip;
            this.profilInputDesactivated = true;
      } else {
            this.profilInputDesactivated = false;
      }
      
    }

    checkUpdateAuthorized(form) {
      let changedDetected:boolean = false;

      (form.sip !== this.profilToShow.sip) ? changedDetected = true : null;
      (form.voiceEnabled !== this.profilToShow.enterpriseVoiceEnabled) ? changedDetected = true : null;
      (form.voicepolicy !== this.profilToShow.voicePolicy) ? changedDetected = true : null;
      (form.dialPlan !== this.profilToShow.dialPlan) ? changedDetected = true : null;
      (form.samAccount !== this.profilToShow.samAccountName) ? changedDetected = true : null;
      (form.exUmEnabled !== this.profilToShow.exUmEnabled) ? changedDetected = true : null;
      (form.exchUser !== this.profilToShow.exchUser) ? changedDetected = true : null;
      (form.objectClass !== this.profilToShow.objectClass) ? changedDetected = true : null;

      changedDetected === true ? this.updateAuthorized = true : this.updateAuthorized = false;
    }

    updateProfil() {

      profilChanged:ProfilRaw;

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
            this.profilService.updateProfilToServer(profilChanged,this.profilToShow.collaboraterId,'300000','commentaire GF');

      } else { //ENABLED
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
            this.profilService.updateProfilToServer(profilChanged,this.profilToShow.collaboraterId,'300000','commentaire GF');  

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

}
