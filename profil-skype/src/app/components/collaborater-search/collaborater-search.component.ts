import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CollaboraterService} from '../../services/collaborater.service';
import {Collaborater} from '../../models/collaborater';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-collaborater-search',
  templateUrl: './collaborater-search.component.html',
  styleUrls: ['./collaborater-search.component.css']
})
export class CollaboraterSearchComponent implements OnInit {

  collaboraterForm: FormGroup;
  collaboraterSearch: Collaborater;
  isSearched: boolean;
  collaboraterListResult: Collaborater[];
  collaboraterSubcribe: Subscription;

  constructor(private formBuilderCollaborater: FormBuilder,
              private collaboraterService: CollaboraterService) { }

  ngOnInit(): void {

      this.isSearched = false;
      this.initializeForm();

  }

    onResetForm(): void {
        this.isSearched = false;
        this.initializeForm();
    }

  onSearch() {
      this.initCollaboraterSearch();
      this.collaboraterService.getCollaboratersFromServer(this.collaboraterSearch);
      this.collaboraterSubcribe = this.collaboraterService.collaboraterGetSubject.subscribe(
          (collaboraters: Collaborater[]) => {
              this.collaboraterListResult = collaboraters;
              console.log('liste collaborateurs', this.collaboraterListResult);
          }
      );
      this.isSearched = true;
  }

    initCollaboraterSearch() {
        this.collaboraterSearch = new Collaborater(
            this.collaboraterForm.value.collaboraterId,
            this.collaboraterForm.value.lastName,
            this.collaboraterForm.value.firstName,
            this.collaboraterForm.value.deskPhoneNumber,
            this.collaboraterForm.value.mobilePhoneNumber,
            this.collaboraterForm.value.mailAdress,
            this.collaboraterForm.value.orgaUnitCode,
            '',
            '',
            '',
            '',
            '',
            '',
            ''
        );
    }

    initializeForm() {
        this.collaboraterForm = this.formBuilderCollaborater.group({
                collaboraterId: '',
                lastName: '',
                firstName: '',
                deskPhoneNumber: '',
                mobilePhoneNumber: '',
                mailAdress: '',
                orgaUnitCode: ''
            }
        );
    }
}
