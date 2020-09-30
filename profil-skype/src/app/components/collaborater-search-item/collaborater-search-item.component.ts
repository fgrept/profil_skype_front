import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-collaborater-search-item',
  templateUrl: './collaborater-search-item.component.html',
  styleUrls: ['./collaborater-search-item.component.css']
})
export class CollaboraterSearchItemComponent implements OnInit {

  @Input() collaborater;
  @Input() idUser: string;

  isAvailable: boolean;
  constructor() { }

  ngOnInit(): void {
    this.isAvailable = true;
  }

}
