import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { DataStorageService } from '../shared/data-storage.service';
import { DbURL } from '../shared/database-url.model';
import { PlaceHolderDirective } from '../shared/place-holder.directive';
import { RedirectDirective } from '../shared/redirect.directive';

@Component({
  selector: 'app-inflate-url',
  templateUrl: './inflate-url.component.html',
  styleUrls: ['./inflate-url.component.css']
})
export class InflateUrlComponent implements OnInit {
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
    let passedUrl = this.url.value.urlInput;
    let short = passedUrl.slice(passedUrl.lastIndexOf('/')+1, passedUrl.length);
    // send url to server to inflate
    this.dbSub = this.httpService.inflateUrl(short);
    this.dbSub.subscribe((inflated) => {
        this.longUrl = inflated.longUrl;
        this.shrotenedUrl = inflated.shortUrl;
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

  initForm(){
    this.url = new FormGroup({
      urlInput: new FormControl('', [Validators.required])
    });
  }
}
