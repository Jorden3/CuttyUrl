import { Action } from '@ngrx/store';
import { DbURL } from '../database-url.model';

export const INFLATE_URL = '[URL] Inflate Url';
export const SHORTEN_URL = '[URL] Shorten Url';
export const SET_URL = '[URL] Set Url';
export const CONVERSION_FAILED = '[URL] Conversion Failed';
export const CLEAR_ERROR = '[URL] Clear Error';

export class InflateUrl implements Action{
    readonly type = INFLATE_URL;

    constructor(public payload: string){}
}

export class ShortenUrl implements Action{
    readonly type = SHORTEN_URL;

    constructor(public payload: {url: string, token: string}){}
}

export class SetUrl implements Action{
    readonly type = SET_URL;

    constructor(public payload: DbURL){}
}

export class ConversionFailed implements Action{
    readonly type = CONVERSION_FAILED;

    constructor(public payload: string){}
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export type UrlActions =
    | InflateUrl
    | ShortenUrl
    | SetUrl
    | ConversionFailed
    | ClearError;
