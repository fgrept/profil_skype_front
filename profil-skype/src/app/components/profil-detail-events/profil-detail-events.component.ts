import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { ActivatedRoute } from '@angular/router';
import { ProfilsService } from 'src/app/services/profils.service';
import { Subscription } from 'rxjs';
import { EventModel } from 'src/app/models/eventModel';





@Component({
  selector: 'app-profil-detail-events',
  templateUrl: './profil-detail-events.component.html',
  styleUrls: ['./profil-detail-events.component.css']
})
export class ProfilDetailEventsComponent implements OnInit {

  //events ;
  eventsList :EventModel[];
  idProfil: number;
  profil;
  eventSuscribe: Subscription;
  page: number = 1;

  constructor(private eventsService: EventsService,
              private profilsService :ProfilsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    
    //1-->SANS SUBSCRIBE

    //Recuperer l'ID du profil depuis la liste des profils
    this.idProfil=this.route.snapshot.params.idProfil; 

    //Récupérer le profil en vue d'utiliser le SIP pour récupérer les événements.
    this.profil = this.profilsService.getProfilById(this.idProfil);
    
    this.eventsService.getEventsOfProfilFromServer(this.profil.sip)

    //this.events=this.eventsService.events$;

    //2-->AVEC SUBSCRIBE
    this.eventSuscribe = this.eventsService.events$.subscribe(
      (events: EventModel[]) => {
        this.eventsList = events;

        console.log("eventList :" ,this.eventsList)
      }
    );


  }

  // onPageChanged(pageDemand:number) {
  //   this.page = pageDemand;
  //   this.profilsService.getProfilsFromServer(pageDemand);
  //   this.profilSuscribe = this.profilsService.profilsSubject.subscribe(
  //     (profils: ProfilFromList[]) => {
  //       this.profilList2 = profils;
  //     }
  //   );
  // }
  nextPage(actualPage:number) {

    this.page=actualPage +1
    
  }
  previousPage(actualPage:number) {

    if((actualPage == 1)) {
      //Aucun traitement
    }
    else {
      this.page=actualPage-1
    }
     
  } 
}
