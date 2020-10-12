import { Component, Input, OnInit } from '@angular/core';
import { EventToShow } from 'src/app/models/profil/event-to-show';

@Component({
  selector: 'app-profil-detail-events-item',
  templateUrl: './profil-detail-events-item.component.html',
  styleUrls: ['./profil-detail-events-item.component.css']
})
export class ProfilDetailEventsItemComponent implements OnInit {

  @Input() event:EventToShow;
  displayComment:Boolean=false;

  constructor() { }

  ngOnInit(): void {
  }

}
