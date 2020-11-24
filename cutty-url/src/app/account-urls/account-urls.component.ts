import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DbURL } from '../shared/database-url.model';

@Component({
  selector: 'app-account-urls',
  templateUrl: './account-urls.component.html',
  styleUrls: ['./account-urls.component.css']
})
export class AccountUrlsComponent implements OnInit {

  @Input()urls: DbURL[];
  @ViewChild('urlOutput', {static: false}) urlOutput: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

}
