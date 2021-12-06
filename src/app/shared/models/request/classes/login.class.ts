import { ILogin } from '@shared/models/request/interfaces';

export class Login implements ILogin {
    grant_type: string;
    client_id: string;
    type: number;
    subtype: string;
    document: string;
    username: string;
    password: string;

    constructor(grant_type: string,
        client_id: string,
        type: number,
        subtype: string,
        document: string,
        username: string,
        password: string) {

        this.grant_type = grant_type;
        this.client_id = client_id;
        this.type = type;
        this.subtype = subtype;
        this.document = document;
        this.username = username;
        this.password = password;
    }
}
