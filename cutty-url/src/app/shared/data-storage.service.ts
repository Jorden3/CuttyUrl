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

  shortenUrl(longUrl: string): Observable<DbURL> {
    return this.http.post<DbURL>(this.serverUrl + '/url/shorten', {url: longUrl});
  }
}
