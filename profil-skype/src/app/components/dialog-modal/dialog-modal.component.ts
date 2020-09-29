import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css']
})
export class DialogModalComponent implements OnInit {

@Input() title;
@Input() message;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
