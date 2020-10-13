import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/operators';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DialogModalFormComponent } from '../../partagé/dialog-modal-form/dialog-modal-form.component';
import { ProfilFromList } from 'src/app/models/profil/profil-to-show';
import { CheckItem } from 'src/app/models/tech/check-item';
import { ProfilsService } from 'src/app/services/profils.service';
import { userMsg } from 'src/app/models/tech/user-msg';
import { ProfilRaw } from 'src/app/models/profil/profil-raw';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-expiredbis',
  templateUrl: './profil-expiredbis.component.html',
  styleUrls: ['./profil-expiredbis.component.css']
})
export class ProfilExpiredbisComponent implements OnInit, OnDestroy {

  profilList2: ProfilFromList[];
  page: number = 1;
  @Output() reloadEvent = new EventEmitter<string>();

  // tab for control of the (n) calls to the back
  itemChecked = new Array<Boolean>();
  totalItemChecked:number = 0;
  totalItemControlled:number = 0;

  private profilSubscription: Subscription;
  private successSubscription: Subscription;
  private updateSubscription: Subscription;
  
  // pour les messages utilisateurs
  successMessage: string;
  availableMessage = false;
  typeMessage = 'success';
  successSubject = new Subject<string>();
  modalOptions: NgbModalOptions = {};

  constructor(private profilsService: ProfilsService,
              private modalService: NgbModal,
              private router: Router) { }

  ngOnDestroy(): void {
    if (this.profilSubscription) {this.profilSubscription.unsubscribe(); }
    if (this.successSubscription) {this.successSubscription.unsubscribe(); }
    if (this.updateSubscription) {this.updateSubscription.unsubscribe();}
    console.log('destroy expiredbis');
  }

  ngOnInit(): void {
    
    this.profilSubscription = this.profilsService.profilsSubject.subscribe(
      (profils: ProfilFromList[]) => {

          this.profilList2 = profils.sort(
            (a,b) => a.expirationDate.localeCompare(b.expirationDate)
          );
          for (const iterator of this.profilList2) {this.itemChecked.push(false); };

          // in case of partial results :            
          if (profils.length === 10) {
            console.log("partiel");
            this.successMessage = 'Résultats partiels (' + profils.length + '). Affiner votre recherche.';
            this.typeMessage = 'warning';
            this.availableMessage = true;
            this.successSubject.next('partial');
          }
      }
    );

    this.successSubscription = this.successSubject.pipe(debounceTime(2000)).subscribe(
      (action:string) => {
          this.successMessage = '';
          this.availableMessage = false;
          if (action === 'false' || action === 'true') {
            console.log('action 2 :', action);
            // ici commence un nouveau PB
            //this.reloadEvent.emit(action); // solution 1 : ne marche pas
            // this.router.navigate(['/profils']); // solution 2 (idem)
            // il doit falloir mettre un ngOnChanged
            // en attendant, on recharge la liste, et l'utilisateur devra cliquer sur Reinitialiser
            
          }
      }
    );

    this.updateSubscription = this.profilsService.updateSubject.subscribe(
      (response: userMsg) => {
        if (response.success) {
          this.totalItemControlled ++;
          if (this.totalItemChecked === this.totalItemControlled) {
            // all items are done
            console.log('tout est fait');
            // all update server are done : display confirm box then routing
            this.emitAlertAndRouting('Mise à jour effectuée',response);
          } else {
            // send the next
            let cpt:number = 0;
            let nextWanted:number = this.totalItemControlled + 1;
            for (let index = 0; index < this.itemChecked.length; index++) {
              const itemIsChecked = this.itemChecked[index];
              if (itemIsChecked) {cpt ++;}
              if (cpt === nextWanted) {break;}
            }
            console.log('nextWanted :' , nextWanted);
            this.sendProfilToUpdate(nextWanted);
          }

        } else {
          console.log('pb lors de la maj : partiel');
          this.emitAlertAndRouting('Mise à jour effectuée',response);
        }
      }
    );

    
  }

  checkProfilToActivate(event:CheckItem) {
    this.itemChecked[event.index] = event.checked;
    (event.checked === true) ? this.totalItemChecked ++ : this.totalItemChecked --;
  }

  reactivateProfils() {
    if (this.totalItemChecked !== 0) {
      console.log('nb à emettre : ' , this.totalItemChecked, 'demandé : ', this.itemChecked,
      'nb attendu : ', this.totalItemControlled);
    
      const modalForm =  this.openModalForm();
      modalForm.result.then(
          confirm => {
              console.log('retour modal', confirm);
              if (confirm['result'] === 'Confirm') {
                  let first:number;
                  for (let index = 0; index < this.itemChecked.length; index++) {
                    const itemIsChecked = this.itemChecked[index];
                    if (itemIsChecked) {first = index; break;};
                  }
                  this.sendProfilToUpdate(first);
              }
            }, dismiss => {
              console.log('retour modal', dismiss);
            }
      );
    }
  }

  sendProfilToUpdate (id:number) {
    const profilChanged = new ProfilRaw (
      this.profilList2[id].sip,
      this.profilList2[id].enterpriseVoiceEnabled,
      this.profilList2[id].voicePolicy,
      this.profilList2[id].dialPlan,
      this.profilList2[id].samAccountName,
      this.profilList2[id].exUmEnabled,
      this.profilList2[id].exchUser,
      this.profilList2[id].objectClass,
      'ENABLED'
      //'EXPIRED' à garder pour le test Ko (dès le 1er)
    );
    
    this.profilsService.updateProfilToServer(
      profilChanged,
      this.profilList2[id].collaboraterId, 
      localStorage.getItem('userId'),
      confirm['comment']
    );

  }

  /**
    * Paramétrage de la fenêtre modale de mise à jour
    */
   openModalForm(): NgbModalRef {
        
    this.modalOptions.backdrop = 'static';
    this.modalOptions.keyboard = false;
    this.modalOptions.centered = true;
    const modalDiag = this.modalService.open(DialogModalFormComponent, this.modalOptions);
    modalDiag.componentInstance.message = 'Confirmez-vous la réactivation de ' + this.totalItemChecked + ' profil(s) ?';
    modalDiag.componentInstance.title = 'Demande de mise à jour';
    return modalDiag;
  }

  emitAlertAndRouting(message:string, response:userMsg) {   
    if (response.success) {
        this.successMessage = message;
        this.typeMessage = 'success';
        this.availableMessage = true;
        this.successSubject.next('true');
    } else {
        this.successMessage = response.msg;
        this.typeMessage = 'danger';
        this.availableMessage = true;
        this.successSubject.next('false');
    };
}

}
