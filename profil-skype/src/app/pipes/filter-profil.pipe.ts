import { Pipe, PipeTransform } from '@angular/core';
import { ProfilFromList } from '../models/profil/profil-to-show';

@Pipe({
  name: 'filterProfil'
})
export class FilterProfilPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;

    searchText = searchText.toLowerCase();
    return items.filter( (profil) => {  
        if (profil.sip.includes(searchText)) {return true};
        if (profil.samAccountName.toLowerCase().includes(searchText)) {return true};
        if (profil.firstName.toLowerCase().includes(searchText)) {return true};
        if (profil.lastName.toLowerCase().includes(searchText)) {return true};
        return false;
        });
  }

}
