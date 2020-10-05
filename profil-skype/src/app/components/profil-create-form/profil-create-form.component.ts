import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ProfilsService} from '../../services/profils.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap } from '@angular/router';
import {ProfilForChange} from '../../models/profil-for-change';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-profil-create-form',
  templateUrl: './profil-create-form.component.html',
  styleUrls: ['./profil-create-form.component.css']
})
export class ProfilCreateFormComponent implements OnInit, OnDestroy {

  createAuthorized: boolean;
  isCreated = false;
  idCollaborater: string;

  profilFormCreate: FormGroup;
  voiceEnabled = [{name : 'oui', value : 'true', checked : false},
    {name : 'non', value: 'false', checked : true}];
  exUmEnabled = [{name : 'oui', value : 'true', checked : false},
    {name : 'non', value: 'false', checked : true}];
  exchUser = [{name : 'Non renseigné', value : '', checked : false},
    {name : 'Linked Mailbox', value: 'Linked Mailbox', checked : true}];
  isVoiceDisabled = false;
  private profilCreate: ProfilForChange;

  // variables pour le message de confirmation
  successSubject = new Subject<string>();
  successMessage: string;
  availableMessage = false;

  constructor(private userService: UserService,
              private profilService: ProfilsService,
              private formBuilder: FormBuilder,
              private routeProfil: ActivatedRoute) { }

  ngOnInit(): void {
    //   récupération de l'id sélectionnée
    this.routeProfil.paramMap.subscribe((params: ParamMap) => {
          this.idCollaborater = params.get('idUser');
          console.log('id is : ', this.idCollaborater);
        }
    );
    this.initForm();
    this.createAuthorized = false;
    this.isCreated = false;
    this.profilFormCreate.valueChanges.subscribe(form => this.checkCreateAuthorized(form));
    this.initAlert();
  }

  private initForm() {
    this.profilFormCreate = this.formBuilder.group({
      collaboraterId: this.idCollaborater,
      sip: ['sip:', [Validators.required, Validators.pattern('^sip:.*$')]],
      voiceEnabled: 'false',
      voicePolicy: '',
      dialPlan: ['DP-FR', [Validators.required]],
      samAccount: ['M00', [Validators.required]],
      exUmEnabled: 'false',
      exchUser: 'Linked Mailbox',
      objectClass: ['user', [Validators.required]],
    });
    this.isVoiceDisabled = true;
  }

  verifyChange(e) {

    if (this.profilFormCreate.get('voiceEnabled').value === 'false') {
      console.log('Voice Enabled, passage à non');
      this.isVoiceDisabled = true;
    }
    if (this.profilFormCreate.get('voiceEnabled').value === 'true') {
      console.log('Voice Enabled, passage à oui');
      this.isVoiceDisabled = false;
    }
  }

  createProfil() {
    const profilCreate = new ProfilForChange(
        this.profilFormCreate.get('sip').value,
        this.profilFormCreate.get('voiceEnabled').value,
        this.profilFormCreate.get('voicePolicy').value,
        this.profilFormCreate.get('dialPlan').value,
        this.profilFormCreate.get('samAccount').value,
        this.profilFormCreate.get('exUmEnabled').value,
        this.profilFormCreate.get('exchUser').value,
        this.profilFormCreate.get('objectClass').value,
        'ENABLED',
        this.profilFormCreate.get('collaboraterId').value,
        '000000',
        'création du profil'
    );
    this.profilService.createSubject.subscribe(
        (response) => {
          console.log('reponse create ok ', response);
          this.changeSuccessMessage('création du profil effectuée');
          this.disabledForm();

        },
        (error) => {
          console.log('reponse create error ', error);
        }
    );
    this.isCreated = true;
    this.profilService.createProfil(profilCreate);
  }

   checkCreateAuthorized(form: any) {
    if (this.profilFormCreate.valid) {
      console.log('form valide');

      this.createAuthorized = true;
    } else {
      this.createAuthorized = false;
      console.log('form invalide');
    }
    console.log('form.valide ', this.profilFormCreate.valid);
   }

  /**
   * Initialisation de l'alerte qui reste affichée pendant deux secondes
   */
  initAlert() {
    this.successSubject.subscribe(message => this.successMessage = message);
    this.successSubject.pipe(
        debounceTime(2000)
    ).subscribe(() => {
      this.successMessage = '';
      this.availableMessage = false;
    });
  }

  /**
   * activation de l'alerte
   * @param message
   */
  changeSuccessMessage(message: string) {
    this.availableMessage = true;
    this.successSubject.next(message);
  }

  private disabledForm() {
    this.profilFormCreate.controls['sip'].disable();
    this.profilFormCreate.controls['voicePolicy'].disable();
    this.profilFormCreate.controls['voiceEnabled'].disable();
    this.profilFormCreate.controls['samAccount'].disable();
    this.profilFormCreate.controls['dialPlan'].disable();
    this.profilFormCreate.controls['exUmEnabled'].disable();
    this.profilFormCreate.controls['exchUser'].disable();
    this.profilFormCreate.controls['objectClass'].disable();
  }

  ngOnDestroy(): void {

    if (this.successSubject !== null && this.successSubject !== undefined){
      this.successSubject.unsubscribe();
    }
    if (this.profilService.createSubject !== null && this.profilService.createSubject !== undefined){
      this.profilService.createSubject.unsubscribe();
    }
  }
}
