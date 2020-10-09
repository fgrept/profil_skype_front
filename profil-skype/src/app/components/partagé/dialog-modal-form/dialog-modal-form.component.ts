import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog-modal-form',
  templateUrl: './dialog-modal-form.component.html',
  styleUrls: ['./dialog-modal-form.component.css']
})
export class DialogModalFormComponent implements OnInit {
  @Input() title;
  @Input() message;
  formDialog:FormGroup;

  constructor(public activeModal: NgbActiveModal,
              public formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.formDialog = this.formBuilder.group({comment : ""});
  }

  onConfirm() {
      let commentUser = this.formDialog.get('comment').value;
      this.activeModal.close({result : "Confirm", comment : commentUser});
  }

}
