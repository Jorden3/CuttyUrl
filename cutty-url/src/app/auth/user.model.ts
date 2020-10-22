import { DbURL } from '../shared/database-url.model';

export class User{
    // tslint:disable-next-line: variable-name
    constructor(public email: string, private _token: string, public createdUrls: Array<DbURL>){
    }

    get token(): string{
        return this._token;
    }
}
