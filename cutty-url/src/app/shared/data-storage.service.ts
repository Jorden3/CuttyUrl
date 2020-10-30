import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DbURL } from './database-url.model';



@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private serverUrl = 'http://localhost:4103';

  constructor(private http: HttpClient) { }

  inflateUrl(shortURL: string): Observable<DbURL> {
    return this.http.get<DbURL>(this.serverUrl + '/url/inflate', {
      params: {url: shortURL}
    });
  }

  shortenUrl(longURL: {longUrl: any, token: any}): Observable<DbURL> {
   const token = longURL.token || '';
   return this.http.post<DbURL>(this.serverUrl + '/url/shorten', {url: longURL.longUrl, token});
  }
}
