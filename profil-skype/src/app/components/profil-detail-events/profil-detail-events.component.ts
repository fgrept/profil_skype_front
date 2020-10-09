import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class ProfilDetailEventsComponent implements OnInit, OnDestroy {

  //events ;
  eventsList :EventModel[];
  idProfil: number;
  profil;
  private eventSubscription: Subscription;
  page: number = 1;

  constructor(private eventsService: EventsService,
              private profilsService :ProfilsService,
              private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    if (this.eventSubscription) {this.eventSubscription.unsubscribe()};
  }

  ngOnInit() {
    //Recuperer l'ID du profil depuis la liste des profils
    this.idProfil=this.route.snapshot.params.idProfil; 

    //Récupérer le profil en vue d'utiliser le SIP pour récupérer les événements.
    this.profil = this.profilsService.getProfilById(this.idProfil);
    
    this.eventsService.getEventsOfProfilFromServer(this.profil.sip)

    this.eventSubscription = this.eventsService.events$.subscribe(
      (events: EventModel[]) => {
        this.eventsList = events;
        console.log("eventList :" ,this.eventsList)
      }
    );
  }

}
