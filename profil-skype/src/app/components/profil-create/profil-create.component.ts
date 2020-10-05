import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profil-create',
  templateUrl: './profil-create.component.html',
  styleUrls: ['./profil-create.component.css']
})
export class ProfilCreateComponent implements OnInit {

  type: string;
  constructor() { }

  ngOnInit(): void {
    this.type = 'profil';
  }
}
