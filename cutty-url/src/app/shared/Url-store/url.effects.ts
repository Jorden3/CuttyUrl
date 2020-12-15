import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { DbURL } from '../database-url.model';
import * as UrlActions from './url.actions';

// tslint:disable-next-line: typedef
function handleError(errorRes) {
    return of(new UrlActions.ConversionFailed(errorRes.message));
}

@Injectable({providedIn: 'root'})
export class UrlEffects {
    private serverUrl = 'http://localhost:4103';

    @Effect()
    shortenUrl = this.actions$.pipe(
        ofType(UrlActions.SHORTEN_URL),
        switchMap((url: UrlActions.ShortenUrl) => {
            return this.http.post<DbURL>(this.serverUrl + '/url/shorten', {
                url: url.payload.url, token: url.payload.token
              });
        }),
        map((url) => {
            return new UrlActions.SetUrl(url);
        }),
        catchError(err => {
            return handleError(err);
        })
    );

    @Effect()
    inflateUrl = this.actions$.pipe(
        ofType(UrlActions.INFLATE_URL),
        switchMap((url: UrlActions.InflateUrl) => {
            return this.http.get<DbURL>(this.serverUrl + '/url/inflate', {
                params: {url: url.payload}
              });
        }),
        map((url) => {
            return new UrlActions.SetUrl(url);
        }),
        catchError(err =>{
            return handleError(err);
        })
    );

    constructor(private actions$: Actions, private http: HttpClient){}
}