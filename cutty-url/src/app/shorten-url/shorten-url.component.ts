import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { DataStorageService } from '../shared/data-storage.service';
import { DbURL } from '../shared/database-url.model';
import { PlaceHolderDirective } from '../shared/place-holder.directive';

@Component({
  selector: 'app-shorten-url',
  templateUrl: './shorten-url.component.html',
  styleUrls: ['./shorten-url.component.css']
})
export class ShortenUrlComponent implements OnInit {
  url: FormGroup;
  shrotenedUrl: string;
  longUrl: string;
  dbSub: Observable<DbURL>;
  sub: Subscription;
  @ViewChild(PlaceHolderDirective, {static: true}) alertHost: PlaceHolderDirective;

  constructor(private httpService: DataStorageService, private compFact: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.initForm();
  }

  urlSent(): void {
    this.longUrl = null;
    this.shrotenedUrl = null;
    this.longUrl = this.url.value.urlInput;
    console.log(this.longUrl);
    // send url to server to shorten
    this.dbSub = this.httpService.shortenUrl(this.url.value.urlInput);
    this.dbSub.subscribe((shorten) => {
        this.longUrl = shorten.longUrl;
        this.shrotenedUrl = shorten.shortUrl;
    },
    (err) => {
      this.showErrorAlert(err.error.text);
    });

    this.url.reset();
  }

  private showErrorAlert(error: string) {
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
