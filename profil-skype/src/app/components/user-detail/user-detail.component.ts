import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  idUser: number;
  constructor(private routeUser: ActivatedRoute)  {

  }

  ngOnInit(): void {
 //   this.idUser = this.routeUser.snapshot.params.idUSer;
    this.routeUser.paramMap.subscribe((params: ParamMap) => {
      this.idUser = +params.get('idUser');
      console.log('id is : ', this.idUser);
        }
    );

  }

}
