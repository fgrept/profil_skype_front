import { ProfilRaw } from './profil-raw';

export class ProfilForChange {

    constructor(public sip:string,
                public enterpriseVoiceEnabled:string,
                public voicePolicy:string,
                public dialPlan:string,
                public samAccountName:string,
                public exUmEnabled:string,
                public exchUser:string,
                public objectClass:string,
                public statusProfile:string,
                public collaboraterId:string,
                public itCorrespondantId:string,
                public comment:string
                ) {}
}
