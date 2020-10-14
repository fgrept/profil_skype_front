import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfilFromList } from 'src/app/models/profil/profil-to-show';
import { CheckItem } from 'src/app/models/tech/check-item';
import { ProfilsService } from 'src/app/services/profils.service';

@Component({
  selector: 'app-profil-expiredbis-item',
  templateUrl: './profil-expiredbis-item.component.html',
  styleUrls: ['./profil-expiredbis-item.component.css']
})
export class ProfilExpiredbisItemComponent implements OnInit {

  @Input() profil:ProfilFromList;
  @Input() idProfil: number;
  selectForm:FormGroup;
  @Output() itemToCheckEvent = new EventEmitter<CheckItem>();
  private item:CheckItem = {index : 0, checked : false};

  constructor(private profilService: ProfilsService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.selectForm = this.formBuilder.group(
      {select: new FormControl()}
    );

    this.selectForm.valueChanges.subscribe(
      () => {
        this.item.checked = this.selectForm.get('select').value;
        this.item.index = this.idProfil;
        this.itemToCheckEvent.emit(this.item);
      }
    );

  }

}
