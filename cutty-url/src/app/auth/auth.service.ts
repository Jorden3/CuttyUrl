import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, pipe, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DbURL } from '../shared/database-url.model';
import { User } from './user.model';

export interface AuthResData{
  email: string;
  token: string;
  isValid: boolean;
  createdUrls: Array<DbURL>;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user = new BehaviorSubject<User>(null);
  private serverUrl = 'http://localhost:4103/auth';

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string): Observable<AuthResData>{
    return this.http.post<AuthResData>(this.serverUrl + '/signup', {
      email,
      password
    }).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuth(
          resData.email,
          resData.token,
          resData.createdUrls
        );
      })
    );
  }

  login(email: string, password: string): Observable<AuthResData>{
    return this.http.post<AuthResData>(this.serverUrl + '/login', {
      email,
      password
    }).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuth(
          resData.email,
          resData.token,
          resData.createdUrls
        );
      })
    );
  }

  autoLogin = () => {
    const userData: {
      email: string;
      _token: string;
      createdUrls: DbURL[];
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    //TODO: hit autologin endpoint
    this.http.get<AuthResData>(this.serverUrl + '/autologin',{
      headers: {
        Authorization: 'Bearer ' + userData._token
      }
    }).pipe(
      catchError(this.handleError)
    ).subscribe((resData)=>this.handleAuth(
      resData.email,
      resData.token,
      resData.createdUrls
    ))
  }

  logout = () => {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }

  handleAuth(email: string, token: string, createUrls: Array<DbURL>): void{
    const user = new User(email, token, createUrls || []);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  handleError(errorRes: HttpErrorResponse): Observable<never>{
    return throwError(errorRes.error.message);
  }
}


