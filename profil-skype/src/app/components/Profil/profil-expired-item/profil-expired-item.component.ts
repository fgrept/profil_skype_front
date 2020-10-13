import { Component, Input, OnInit } from '@angular/core';
import { ProfilForChange } from 'src/app/models/profil/profil-for-change';
import { ProfilFromList } from 'src/app/models/profil/profil-to-show';
import { ProfilsService } from 'src/app/services/profils.service';

@Component({
  selector: 'app-profil-expired-item',
  templateUrl: './profil-expired-item.component.html',
  styleUrls: ['./profil-expired-item.component.css']
})
export class ProfilExpiredItemComponent implements OnInit {
  @Input() profil:ProfilFromList;
  @Input() idProfil: number;
  @Input() profilList: ProfilFromList[];


  constructor(private profilService: ProfilsService) { }

  ngOnInit(): void {

  }


  activateProfils() {

    console.log(" IdProfil :",this.idProfil )
    console.log(" IdProfil :",this.profil )
   
    console.log("List Profils avant",this.profilList) ;
     
    // Vérifeir le status du profil

    //!!!!!! A MODIFIER POUR GERER LE STATUS EXPIRED
    if (this.profilList[this.idProfil].statusProfile=="ENABLED") {
        
        this.profilList[this.idProfil].statusProfile="DISABLED"
    //
    } else if (this.profilList[this.idProfil].statusProfile=="DISABLED") {
       
       this.profilList[this.idProfil].statusProfile="ENABLED"
    }
    
    console.log("Status profil après check/uncheck",this.profilList) ;
    
}

}
