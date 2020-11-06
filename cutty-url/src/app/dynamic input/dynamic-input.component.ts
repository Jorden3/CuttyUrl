import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { DataStorageService } from '../shared/data-storage.service';
import { DbURL } from '../shared/database-url.model';
import { PlaceHolderDirective } from '../shared/place-holder.directive';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.css']
})
export class DynamicInputComponent implements OnInit {
  @Input() type: string;
  url: FormGroup;
  inputUrl: string;
  convertedUrl: string;
  dbSub: Observable<DbURL>;
  sub: Subscription;
  @ViewChild(PlaceHolderDirective, {static: true}) alertHost: PlaceHolderDirective;
  longUrl: string;

  constructor(private httpService: DataStorageService,
              private compFact: ComponentFactoryResolver,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  urlSent(): void {
    this.inputUrl = this.url.value.urlInput;
    this.convertedUrl = null;
    let token = '';
    // console.log(this.longUrl);
    // send url to server to shorten
    if (this.authService.user.value){
        // tslint:disable-next-line: no-var-keyword
        token = this.authService.user.value.token;
    }

    if (this.type === 'Shrink'){
      this.dbSub = this.httpService.shortenUrl({longUrl: this.inputUrl, token});
      this.dbSub.subscribe((shorten) => {
          this.inputUrl = shorten.longUrl;
          this.convertedUrl = shorten.shortUrl;
          this.longUrl = shorten.longUrl;
      },
      (err) => {
        this.showErrorAlert(err.error.text);
      }); }
      else if (this.type === 'Inflate') {
        const short = this.inputUrl.slice(this.inputUrl.lastIndexOf('/') + 1, this.inputUrl.length);
        // send url to server to inflate
        this.dbSub = this.httpService.inflateUrl(short);
        this.dbSub.subscribe((inflated) => {
            this.convertedUrl = inflated.longUrl;
            this.inputUrl = inflated.shortUrl;
            this.longUrl = inflated.longUrl;
        },
        (err) => {
          this.showErrorAlert(err.error.text);
        });
      }
    this.url.reset();
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
    });
  }

  initForm(): void{
    const pattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.url = new FormGroup({
      urlInput: new FormControl('', [Validators.required, Validators.pattern(pattern)])
    });
  }

}
