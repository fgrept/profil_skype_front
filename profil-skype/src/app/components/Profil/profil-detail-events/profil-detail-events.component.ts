import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { ActivatedRoute } from '@angular/router';
import { ProfilsService } from 'src/app/services/profils.service';
import { Subscription } from 'rxjs';
import { EventModel } from 'src/app/models/profil/eventModel';
import { ProfilFromList } from 'src/app/models/profil/profil-to-show';
import { EventToShow } from 'src/app/models/profil/event-to-show';


@Component({
  selector: 'app-profil-detail-events',
  templateUrl: './profil-detail-events.component.html',
  styleUrls: ['./profil-detail-events.component.css']
})
export class ProfilDetailEventsComponent implements OnInit, OnDestroy {

  eventsList : EventToShow[];
  idProfil: number;
  profil:ProfilFromList;
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

    this.eventSubscription = this.eventsService.eventsSubject.subscribe(
      (events: EventModel[]) => {
        console.log(events);
        this.eventsList = this.analyseComment(events);
        console.log(this.eventsList);
      }
    );

    this.eventsService.getEventsOfProfilFromServer(this.profil.sip);

  }

  /**
   * method for analyse the comment set in the back-end because we are only interested if
   * the user has written a comment, or if the system has catch change fields.
   * we also ordering the events with date ascending.
   * 
   * @param eventsIn 
   */
  analyseComment(eventsIn:EventModel[]):EventToShow[] {
    
    let eventsOut:EventToShow[] = new Array<EventToShow>();

    for (const eventIn of eventsIn) {
      let eventOut:EventToShow = new EventToShow(null,null,null,null,null,null,null);
      eventOut.dateEvent = eventIn.dateEvent;
      eventOut.typeEvent = eventIn.typeEvent;
      eventOut.itCorrespondantId = eventIn.itCorrespondantId;
      eventOut.itCorrespondantFirstName = eventIn.itCorrespondantFirstName;
      eventOut.itCorrespondantLastName = eventIn.itCorrespondantLastName;
      eventOut.commentEvent = eventIn.commentEvent;
      
      if (eventIn.commentEvent.substr(0,28) === 'Commentaire utilisateur : <<') {
        if (eventIn.commentEvent.substr(28,2) === '>>') {
          if (eventIn.commentEvent.length === 30) {
            eventOut.commentToShow = false;
          } else {
            eventOut.commentToShow = true;
            eventOut.commentEvent = eventIn.commentEvent.substr(33);
          }
        } else {
          eventOut.commentToShow = true;
          eventOut.commentEvent = eventIn.commentEvent.substr(0);
        }
      } else {
        eventOut.commentToShow = false;
      }
      eventsOut.push(eventOut);
    }

    eventsOut.sort(
      (e,f) => (e.dateEvent.localeCompare(f.dateEvent)
    ));

    return eventsOut;
  }

}
