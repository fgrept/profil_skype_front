import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ComparePassword} from '../../../Validators/confirm-password-validator';
import {CustomPasswordValidator} from '../../../Validators/custom-password-validator';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {HttpResponseBase} from "@angular/common/http";

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit, OnDestroy {

  userId: string;
  formAccount: FormGroup;
  // activation de la mise à jour du mot de passe
  updateAvailable: boolean;

  // variables pour l'affichage d'une popup
  successSubject = new Subject<string>();
  successMessage: string;
  availableMessage = false;
  type = 'success';

  constructor(private formBuilderUser: FormBuilder,
              private userService: UserService) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    console.log('userId', this.userId);
    this.updateAvailable = false;
    this.initForm();
    this.initAlert();
  }

  updatePassword() {
    this.userService.getUpdatePasswordSubject().subscribe(
        (response: any) => {
          console.log(response.status);
          if (response.status.toString() === '200') {
            this.type = 'success';
            this.changeSuccessMessage('Mise à jour effectuée');
          } else {
            this.type = 'danger';
            this.changeSuccessMessage('Erreur lors de la mise à jour du mot de passe: ' + response.error.message);
          }
        },
        (error) => {
          console.log('erreur back end ', error);
        }
    );
    this.userService.updatePasswordToServer(this.userId,
        this.formAccount.get('actualPassword').value,
        this.formAccount.get('newPassword').value);
  }

  initForm() {
    this.formAccount = this.formBuilderUser.group( {
      collaboraterId: localStorage.getItem('userId'),
      lastName: localStorage.getItem('lastName'),
      firstName: localStorage.getItem('firstName'),
      userRoles: localStorage.getItem('userRoles'),
      actualPassword: ['', Validators.required],
      newPassword: ['', Validators.compose([
          Validators.required,
          // doit être compris entre 8 et 12 caractères (12 car pour limiter le risque d'injection de code)
          Validators.minLength(8),
          Validators.maxLength(12),
          // doit contenir un caractère numérique
          CustomPasswordValidator.patternValidator(/\d/, {isContainsNumber: true}),
          // doit contenir une lettre majuscule
          CustomPasswordValidator.patternValidator(/[A-Z]/, {isContainsUpperCase: true}),
          // doit contenir une lettre minuscule
          CustomPasswordValidator.patternValidator(/[a-z]/, {isContainsLowerCase: true}),
          // doit contenir un caractère spécial
          CustomPasswordValidator.patternValidator(/[ \\\[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\};\'\:\"\|\,\.\<\>\/\?°\~\£]/,
              {isContainsSpecialCharacter: true})
      ])],
      newPasswordConfirmed: ''
        },
        {
          validator: ComparePassword('newPassword', 'newPasswordConfirmed')
        }
    );
  }

  /**
   * Active la possibilité de changer le mot de passe
   */
  activeChangePassword() {
    this.updateAvailable = true;
  }

  /**
   * Désactive la possibilité de changer le mot de passe
   */
  desactiveChangePassword() {
    this.updateAvailable = false;
  }

  /**
   * initialisation de la popup
   */
  initAlert() {
    this.successSubject.subscribe(message => this.successMessage = message);
    this.successSubject.pipe(
        debounceTime(2000)
    ).subscribe(() => {
      this.successMessage = '';
      this.availableMessage = false;
    });
  }

  /**
   * activation de la popup
   * @param message
   */
  changeSuccessMessage(message: string) {
    this.availableMessage = true;
    this.successSubject.next(message);
  }

  ngOnDestroy(): void {
  }
}
