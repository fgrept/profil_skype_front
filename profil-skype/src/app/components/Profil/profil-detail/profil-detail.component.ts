import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilsService } from 'src/app/services/profils.service';
import { ProfilFromList } from 'src/app/models/profil/profil-to-show';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ProfilRaw } from 'src/app/models/profil/profil-raw';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DialogModalComponent } from '../../partagé/dialog-modal/dialog-modal.component';
import { DialogModalFormComponent } from '../../partagé/dialog-modal-form/dialog-modal-form.component';
import {debounceTime} from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { userMsg } from 'src/app/models/tech/user-msg';

@Component({
    selector: 'app-profil-detail',
    templateUrl: './profil-detail.component.html',
    styleUrls: ['./profil-detail.component.css']
})
export class ProfilDetailComponent implements OnInit, OnDestroy {

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
    exchUser = [{name : 'Non renseigné', value : '', checked : false},
        {name : 'Linked Mailbox', value: 'Linked Mailbox', checked : false}];

    currentUserType;
    changedNotAuthorized: boolean;
    profilDesactivated = false;
    profilInputDesactivated = false;
    private updateSubscription: Subscription;
    private deleteSubscription: Subscription;
    private buttonFilterSubscription:Subscription;
    private successSubscription:Subscription;
    private valueChangesFormSubscription:Subscription;
    private valueChangesStatusSubscription:Subscription;
    private valueChangesVoiceEnabledSubscription:Subscription;
    updateAuthorized: boolean;

    // options pour la fenêtre modale
    modalOptions: NgbModalOptions = {};
    successSubject = new Subject<string>();
    successMessage: string;
    availableMessage:boolean = false;
    typeMessage = 'success';

    constructor(private route: ActivatedRoute,
                private profilService: ProfilsService,
                private formBuilder: FormBuilder,
                private userService: UserService,
                private router: Router,
                private modalService: NgbModal
                ) { }

    ngOnDestroy(): void {
        if (this.updateSubscription) {this.updateSubscription.unsubscribe();}
        if (this.deleteSubscription) {this.deleteSubscription.unsubscribe();}
        if (this.buttonFilterSubscription) {this.buttonFilterSubscription.unsubscribe();}
        if (this.successSubscription) {this.successSubscription.unsubscribe();}
        if (this.valueChangesFormSubscription) {this.valueChangesFormSubscription.unsubscribe()};
        if (this.valueChangesStatusSubscription) {this.valueChangesStatusSubscription.unsubscribe()};
        if (this.valueChangesVoiceEnabledSubscription) {this.valueChangesVoiceEnabledSubscription.unsubscribe()};
    }

    ngOnInit(): void {
        this.idProfil = this.route.snapshot.params.idProfil;
        this.profilToShow = this.profilService.getProfilById(this.idProfil);
        this.currentUserType = this.userService.getCurrentRole();

        this.currentUserType === 1 ? this.changedNotAuthorized = true : this.changedNotAuthorized = false;
        this.profilToShow.statusProfile === 'EXPIRED' ? this.profilInputDesactivated = true : this.profilInputDesactivated = false;
        this.profilInputDesactivated = this.changedNotAuthorized || this.profilInputDesactivated;
        this.updateAuthorized = false;
        this.profilToShow.enterpriseVoiceEnabled === 'true' ? this.voiceEnabled[0].checked = true : this.voiceEnabled[1].checked = true;
        this.profilToShow.exUmEnabled === 'true' ? this.exUmEnabled[0].checked = true : this.exUmEnabled[1].checked = true;
        this.profilToShow.exchUser === '' ? this.exchUser[0].checked = true : this.exchUser[1].checked = true;

        

        this.profilForm = this.formBuilder.group({
            sip: [{value : this.profilToShow.sip, disabled : this.profilInputDesactivated},
                [Validators.required/* ,
                    Validators.pattern('^sip:.*$') */
                ]],
            voiceEnabled: [{value : this.profilToShow.enterpriseVoiceEnabled, disabled : this.profilInputDesactivated},
                Validators.required],
            voicePolicy: [{value : this.profilToShow.voicePolicy, disabled : this.profilInputDesactivated},
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
            expirationDate: [{value : this.profilToShow.expirationDate.slice(0,10), disabled : true},
                    Validators.required],
            status: [{value : this.profilToShow.statusProfile, disabled : this.changedNotAuthorized},
                Validators.required]
        });

        if (this.profilToShow.statusProfile === 'ENABLED') {
            this.statusProfile[0].checked = true;
        }
        if (this.profilToShow.statusProfile === 'DISABLED') {
            this.statusProfile[1].checked = true;
        }
        if (this.profilToShow.statusProfile === 'EXPIRED') {
            // ne fonctionne plus ...
            this.statusProfile[1].disabled = true;
            this.statusProfile[2].checked = true;
        }

        this.valueChangesFormSubscription = this.profilForm.valueChanges.subscribe
                                            (form => this.checkUpdateAuthorized(form));
        this.valueChangesStatusSubscription = this.profilForm.get('status').valueChanges.subscribe
                                            (form => this.checkActiveInput2(form));
        this.valueChangesVoiceEnabledSubscription = this.profilForm.get('voiceEnabled').valueChanges.subscribe
                                            (form => this.checkVoicePolicy(form));
        if (this.profilForm.get('voiceEnabled').value === 'false') {
            this.profilForm.controls['voicePolicy'].disable();
        }
    }

    /**
     * method pour check the voice Policy when the VoiceEnbaled has changed
     * @param valueOfVoiceEnabled 
     */
    checkVoicePolicy(valueOfVoiceEnabled) {
        if (valueOfVoiceEnabled === 'false') {
            this.profilForm.controls['voicePolicy'].disable();
            this.profilForm.get('voicePolicy').setValue('');
        } else {
            this.profilForm.controls['voicePolicy'].enable();
            if (this.profilForm.get('voiceEnabled').value === this.profilToShow.enterpriseVoiceEnabled) {
                // we reset to the initial value
                this.profilForm.get('voicePolicy').setValue(this.profilToShow.voicePolicy)
            }
        }
    }

    /**
     * method for reset the value to their initial value when the user want to desactivate
     * the profil, and also prevent other change of param of the profil skype
     * 
     * @param value 
     */
    checkActiveInput2(value) {
        if (value === 'DISABLED') {
            // we reset to initial value the input form
            this.profilForm.get('sip').setValue(this.profilToShow.sip);
            this.profilForm.get('voiceEnabled').setValue(this.profilToShow.enterpriseVoiceEnabled);
            this.profilForm.get('voicePolicy').setValue(this.profilToShow.voicePolicy);
            this.profilForm.get('dialPlan').setValue(this.profilToShow.dialPlan);
            this.profilForm.get('samAccount').setValue(this.profilToShow.samAccountName);
            this.profilForm.get('exUmEnabled').setValue(this.profilToShow.exUmEnabled);
            this.profilForm.get('exchUser').setValue(this.profilToShow.exchUser);
            this.profilForm.get('objectClass').setValue(this.profilToShow.objectClass);

            this.profilInputDesactivated = true;
        } else {
            this.profilInputDesactivated = false;
        }

    }

    /**
     * method for detect if one input has been modified and therefore authorized
     * the user to clickon the update button
     * 
     * @param form 
     */
    checkUpdateAuthorized(form) {
        let changedDetected = false;

        (form.sip !== this.profilToShow.sip) ? changedDetected = true : null;
        (form.voiceEnabled !== this.profilToShow.enterpriseVoiceEnabled) ? changedDetected = true : null;
        (form.voicePolicy !== this.profilToShow.voicePolicy) ? changedDetected = true : null;
        (form.dialPlan !== this.profilToShow.dialPlan) ? changedDetected = true : null;
        (form.samAccount !== this.profilToShow.samAccountName) ? changedDetected = true : null;
        (form.exUmEnabled !== this.profilToShow.exUmEnabled) ? changedDetected = true : null;
        (form.exchUser !== this.profilToShow.exchUser) ? changedDetected = true : null;
        (form.objectClass !== this.profilToShow.objectClass) ? changedDetected = true : null;
        (form.status !== this.profilToShow.statusProfile) ? changedDetected = true : null;

        changedDetected === true ? this.updateAuthorized = true : this.updateAuthorized = false;
        // the property binding don't work all the times ...
        (changedDetected) ?
            $("#updateButton").removeAttr('disabled') : $("#updateButton").attr('disabled','true');  

        /* console.log("changedDetected : " , changedDetected);
        console.log("updateAuthorized : " , this.updateAuthorized); */
        
        // set the status in case of change
        if (changedDetected && this.profilForm.value['status'] === 'EXPIRED') {
            this.profilForm.get('status').setValue('ENABLED');
        }

    }

    /**
     * method for updating the skype profil, either some fields change,
     * or change of the status (desactivation)
     */
    updateProfil() {

        const profilChanged = new ProfilRaw (
            this.profilForm.get('sip').value,
            this.profilForm.get('voiceEnabled').value,
            this.profilForm.get('voicePolicy').value,
            this.profilForm.get('dialPlan').value,
            this.profilForm.get('samAccount').value,
            this.profilForm.get('exUmEnabled').value,
            this.profilForm.get('exchUser').value,
            this.profilForm.get('objectClass').value,
            this.profilForm.get('status').value);

        this.updateSubscription = this.profilService.updateSubject.subscribe(
            (response: userMsg) => {
                // update server done : display confirm box then routing
                this.emitAlertAndRouting('Mise à jour effectuée',response);
            }
        );
        
        const modalForm =  this.openModalForm();
        modalForm.result.then(
            confirm => {
                console.log('retour modal', confirm);
                if (confirm['result'] === 'Confirm') {
                    this.profilService.updateProfilToServer(
                        profilChanged,
                        this.profilToShow.collaboraterId, 
                        localStorage.getItem('userId'),
                        confirm['comment']);
                }
              }, dismiss => {
                console.log('retour modal', dismiss);
              }
        );

    }

    /**
     * method for delete the Skype Profil in the server with a confirmation box
     */
    deleteProfil() {
        this.deleteSubscription = this.profilService.deleteSubject.subscribe(
            (response: userMsg) => {
                // update server done : display confirm box then routing
                this.emitAlertAndRouting('Suppression effectuée', response);
            }
        );
        
        const modalRef = this.openModal();
        modalRef.result.then(
            confirm => {
                console.log('retour modal', confirm);
                if (confirm.toString() === 'Confirm') {
                    if (this.profilForm.value.status === 'DISABLED') {
                        this.profilService.deleteProfilToServer(this.profilToShow.sip);
                    } else {
                        this.profilService.deleteProfilToServer(this.profilForm.value.sip);
                    }
                }
              }, dismiss => {
                console.log('retour modal', dismiss);
              }
        );        
    }

    /**
     * method for return to the list and demand to the service not to callback server
     */
    returnToList() {
        this.profilService.profilListToReload = false;
        this.buttonFilterSubscription = this.profilService.buttonFilterSubject.subscribe(
            () => this.router.navigate(['/profils'])
        );
        this.profilService.buttonFilterSubject.next(true);  
    }

    /**
    * Paramétrage de la fenêtre modale de suppression
    */

    openModal(): NgbModalRef {

        this.modalOptions.backdrop = 'static';
        this.modalOptions.keyboard = false;
        this.modalOptions.centered = true;
        const modalDiag = this.modalService.open(DialogModalComponent, this.modalOptions);
        modalDiag.componentInstance.message = 'Confirmez-vous la suppression du profil Skype ' + this.profilForm.get('sip').value + '?';
        modalDiag.componentInstance.title = 'Demande de suppression';
        return modalDiag;
  }

    /**
    * Paramétrage de la fenêtre modale de mise à jour
    */
    openModalForm(): NgbModalRef {
        
        this.modalOptions.backdrop = 'static';
        this.modalOptions.keyboard = false;
        this.modalOptions.centered = true;
        const modalDiag = this.modalService.open(DialogModalFormComponent, this.modalOptions);
        modalDiag.componentInstance.message = 'Confirmez-vous la mise à jour du profil Skype ' + this.profilForm.get('sip').value + '?';
        modalDiag.componentInstance.title = 'Demande de mise à jour';
        return modalDiag;
    }

    emitAlertAndRouting(message:string, response:userMsg) {
        
        if (response.success) {
            this.successMessage = message;
            this.typeMessage = 'success';
            this.availableMessage = true;
            this.successSubscription = this.successSubject.pipe(debounceTime(2000)).subscribe(
                () => {
                    this.successMessage = '';
                    this.availableMessage = false;
                    this.router.navigate(['/profils'])
                }
            );
            this.successSubject.next();
        } else {
            this.successMessage = response.msg;
            this.typeMessage = 'danger';
            this.availableMessage = true;
        }  
    }

}
