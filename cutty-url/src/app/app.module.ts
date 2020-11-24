import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { InflateUrlComponent } from './inflate-url/inflate-url.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ShortenUrlComponent } from './shorten-url/shorten-url.component';
import { RedirectDirective } from './shared/redirect.directive';
import { UrlNamePipe } from './shared/url-name.pipe';
import { AlertComponent } from './shared/alert/alert.component';
import { PlaceHolderDirective } from './shared/place-holder.directive';
import { DynamicInputComponent } from './dynamic input/dynamic-input.component';
import { AuthComponent } from './auth/auth.component';
import { CommonModule } from '@angular/common';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AccountComponent } from './account/account.component';
import { AccountUrlsComponent } from './account-urls/account-urls.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    InflateUrlComponent,
    ShortenUrlComponent,
    RedirectDirective,
    UrlNamePipe,
    AlertComponent,
    PlaceHolderDirective,
    DynamicInputComponent,
    AuthComponent,
    AccountComponent,
    AccountUrlsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
