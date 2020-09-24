import {Collaborater} from './collaborater';

export class UserResult extends Collaborater {
    roles: string[];
    constructor(collaboraterId: string,
                lastName: string,
                firstName: string,
                deskPhoneNumber: string,
                mobilePhoneNumber: string,
                mailAdress: string,
                orgaUnitCode: string,
                orgaUnitType: string,
                orgaUnitShortLabel: string,
                siteCode: string,
                siteName: string,
                siteAddress: string,
                sitePostalCode: string,
                siteCity: string,
                roles: string[]) {
        super(collaboraterId,
            lastName,
            firstName,
            deskPhoneNumber,
            mobilePhoneNumber,
            mailAdress,
            orgaUnitCode,
            orgaUnitType,
            orgaUnitShortLabel,
            siteCode,
            siteName,
            siteAddress,
            sitePostalCode,
            siteCity);
        this.roles = roles;
    }
}
