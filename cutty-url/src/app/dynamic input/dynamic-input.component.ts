import { Component, ComponentFactoryResolver, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { DataStorageService } from '../shared/data-storage.service';
import { DbURL } from '../shared/database-url.model';
import { PlaceHolderDirective } from '../shared/place-holder.directive';
import { UrlNamePipe } from '../shared/url-name.pipe';
import * as fromApp from '../store/app.reducer';
import * as UrlActions from '../shared/Url-store/url.actions';
import * as UrlReducer from '../shared/Url-store/url.reducer';
import { Actions, ofType } from '@ngrx/effects';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.css']
})
export class DynamicInputComponent implements OnInit, OnDestroy {
  @Input() type: string;
  url: FormGroup;
  inputUrl: string;
  convertedUrl: string;
  dbSub: Observable<DbURL>;
  sub: Subscription;
  @ViewChild(PlaceHolderDirective, {static: true}) alertHost: PlaceHolderDirective;
  @ViewChild('urlInput', {static: false}) urlInput: ElementRef;
  longUrl: string;
  error: string;
  storeSub: Subscription;

  constructor(private httpService: DataStorageService,
              private compFact: ComponentFactoryResolver,
              private authService: AuthService,
              private activeRouter: ActivatedRoute,
              private store: Store<fromApp.AppState>,
              private actions$: Actions) { }

  ngOnInit(): void {
    this.initForm();
    const tempType = this.activeRouter.snapshot.params.type;
    if (tempType){
      this.type = tempType;
    }

    this.store.select('urls').subscribe(urlState =>{
      this.error = urlState.error;
      if(this.error){
        this.showErrorAlert(this.error);
      }
    })
  }

  // urlSent(): void {
  //   const urlPipe: UrlNamePipe = new UrlNamePipe();
  //   this.inputUrl = this.url.value.urlInput;
  //   this.convertedUrl = null;
  //   let token = '';
  //   // console.log(this.longUrl);
  //   // send url to server to shorten
  //   if (this.authService.user.value){
  //       // tslint:disable-next-line: no-var-keyword
  //       token = this.authService.user.value.token;
  //   }

  //   if (this.type === 'Shrink'){
  //     this.dbSub = this.httpService.shortenUrl({longUrl: this.inputUrl, token});
  //     this.dbSub.subscribe((shorten) => {
  //         this.inputUrl = shorten.longUrl;
  //         this.convertedUrl = shorten.shortUrl;
  //         this.longUrl = shorten.longUrl;
  //         const user = this.authService.user.value;
  //         user.createdUrls.push(shorten);
  //         this.authService.user.next(user);
  //         const temp = urlPipe.transform(shorten, 'short');
  //         this.url.setValue({urlInput: temp});
  //     },
  //     (err) => {
  //       this.showErrorAlert(err.error.text);
  //     }); }
  //     else if (this.type === 'Inflate') {
  //       const short = this.inputUrl.slice(this.inputUrl.lastIndexOf('/') + 1, this.inputUrl.length);
  //       // send url to server to inflate
  //       this.dbSub = this.httpService.inflateUrl(short);
  //       this.dbSub.subscribe((inflated) => {
  //           this.convertedUrl = inflated.longUrl;
  //           this.inputUrl = inflated.shortUrl;
  //           this.longUrl = inflated.longUrl;
  //           const temp = urlPipe.transform(inflated, 'long');
  //           this.url.setValue({urlInput: temp});
  //       },
  //       (err) => {
  //         this.showErrorAlert(err.error.text);
  //       });
  //     }
  // }

  urlSent(): void {
    this.inputUrl = this.url.value.urlInput;
    let token = '';
    const urlPipe: UrlNamePipe = new UrlNamePipe();
    this.convertedUrl = null;
    // console.log(this.longUrl);
    // send url to server to shorten
    if (this.authService.user.value){
        // tslint:disable-next-line: no-var-keyword
        token = this.authService.user.value.token;
    }
    if (this.type === 'Shrink'){
      this.store.dispatch(new UrlActions.ShortenUrl({url: this.inputUrl, token}));
      this.storeSub = this.actions$.pipe(
        ofType(UrlActions.SET_URL),
        take(1)
      ).subscribe((url: {payload: DbURL, type: string}) => {
        this.inputUrl = url.payload.longUrl;
        this.convertedUrl = url.payload.shortUrl;
        this.longUrl = url.payload.longUrl;
        const user = this.authService.user.value;
        if (user){
          user.createdUrls.push(url.payload);
          this.authService.user.next(user);
        }
        const temp = urlPipe.transform(url.payload, 'short');
        this.url.setValue({urlInput: temp});
      });
    }else if (this.type === 'Inflate'){
      const short = this.inputUrl.slice(this.inputUrl.lastIndexOf('/') + 1, this.inputUrl.length);
      this.store.dispatch(new UrlActions.InflateUrl(short));
      this.storeSub = this.actions$.pipe(
        ofType(UrlActions.SET_URL),
        take(1)
      ).subscribe((url: {payload: DbURL, type: string}) => {
        this.convertedUrl = url.payload.longUrl;
        this.inputUrl = url.payload.shortUrl;
        this.longUrl = url.payload.longUrl;
        const temp = urlPipe.transform(url.payload, 'long');
        this.url.setValue({urlInput: temp});
      });
    }
  }

  private showErrorAlert = (error: string) => {
    const alertComponentFactory = this.compFact.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    componentRef.instance.message = error;
    this.sub = componentRef.instance.closeAlert.subscribe( () => {
        this.sub.unsubscribe();
        hostViewContainerRef.clear();
        this.store.dispatch(new UrlActions.ClearError());
    });
  }

  clear(): void{
    this.url.reset();
    this.convertedUrl = null;
    this.storeSub.unsubscribe();
  }

  initForm(): void{
    const pattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.url = new FormGroup({
      urlInput: new FormControl('', [Validators.required, Validators.pattern(pattern)])
    });
  }

  ngOnDestroy() {
    if (this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

}
