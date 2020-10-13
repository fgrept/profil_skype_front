import { Component, Input, OnInit, ɵConsole } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfilForActivate } from 'src/app/models/profil/profil-for-activate';
import { ProfilForChange } from 'src/app/models/profil/profil-for-change';
import { ProfilFromList } from 'src/app/models/profil/profil-to-show';
import { ProfilsService } from 'src/app/services/profils.service';

@Component({
  selector: 'app-profil-expired',
  templateUrl: './profil-expired.component.html',
  styleUrls: ['./profil-expired.component.css']
})
export class ProfilExpiredComponent implements OnInit {

  
  expiredProfilForm :FormGroup
  
  private profilSubscription : Subscription ;
  profilList: ProfilFromList[];
  page: number = 1;
  
 

   

  constructor( private profilService: ProfilsService,
               private router: Router,
               private formBuilder:FormBuilder) { }

  ngOnInit(): void {
     
    //Initialize array profilListForActiveStatus

    
    //Preparing the Criteria request
    let profilSearch = new ProfilFromList (
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      'DISABLED',
      null,
      null,
      null,
      null,
      null,
      null,
    ); 
    
    this.profilService.getExpiredProfilsFromServer(profilSearch);
    this.profilSubscription =this.profilService.profilsSubject.subscribe(
        (profils: ProfilFromList[]) => {
          this.profilList = profils;
      }
    );
      console.log(this.profilList,"this.profilList")
    /**
     * Control of CheckBox
     *  */  
      // this.expiredProfilForm = this.formBuilder.group(
      //   {checkboxId : new FormControl() } )
      
      
  }




  /**
   * method for return to the list and demand to the service not to callback server
   */
  returnToList() {
   
    this.router.navigate(['/profils'])
  }

 
  activateProfils() {
    
   
    console.log("addProfilForActivating()" )
    console.log("Profil List :",this.profilList)

     for (let index = 0; index < this.profilList.length; index++) {
       
      if (this.profilList[index].statusProfile=="ENABLED") {
        
        //Model profil to active Status
    const profilForActiveStatus = new ProfilForActivate(
      this.profilList[index].sip,
      this.profilList[index].enterpriseVoiceEnabled,
      this.profilList[index].voicePolicy,
      this.profilList[index].dialPlan,
      this.profilList[index].samAccountName,
      this.profilList[index].exUmEnabled,
      this.profilList[index].exchUser,
      this.profilList[index].objectClass,
      this.profilList[index].statusProfile
    ) 
             
        //Call the Update service
        console.log("profilForActiveStatus",profilForActiveStatus)
        this.profilService.updateProfilToServer(profilForActiveStatus,
                                              this.profilList[index].collaboraterId,
                                              localStorage.getItem('userId'),
                                              "Activation du profil par l'administrateur")
                                                                                           

         }

     }

    


  }


}
