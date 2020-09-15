import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfilsService } from 'src/app/services/profils.service';
import { ProfilShort } from 'src/app/models/profil-short';

@Component({
  selector: 'app-profil-detail',
  templateUrl: './profil-detail.component.html',
  styleUrls: ['./profil-detail.component.css']
})
export class ProfilDetailComponent implements OnInit {

  idProfil:number;
  profilToShow:ProfilShort;

  constructor(private route:ActivatedRoute, private profilService:ProfilsService) { }

  ngOnInit(): void {
    this.idProfil = this.route.snapshot.params['idProfil'];
    this.profilToShow = this.profilService.getProfilById(this.idProfil);
  }

}
