import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { DynamicInputComponent } from './dynamic input/dynamic-input.component';
import { HomeComponent } from './home/home.component';
import { InflateUrlComponent } from './inflate-url/inflate-url.component';
import { ShortenUrlComponent } from './shorten-url/shorten-url.component';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'inflate', component: InflateUrlComponent},
  {path: 'inflate/:type', component: DynamicInputComponent},
  {path: 'shorten', component: ShortenUrlComponent},
  {path: 'shorten/:type', component: DynamicInputComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
