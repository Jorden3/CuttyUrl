import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inflate-url',
  templateUrl: './inflate-url.component.html',
  styleUrls: ['./inflate-url.component.css']
})
export class InflateUrlComponent implements OnInit {
  url: FormGroup;
  shrotenedUrl: string;
  longUrl: string;

  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  urlSent(): void {
    this.shrotenedUrl = this.url.value.urlInput;
    this.longUrl = 'https://angular.io/guide/attribute-directives';
    console.log(this.shrotenedUrl);
    // send url to server to inflate
  }

  initForm(): void{
    this.url = new FormGroup({
      urlInput: new FormControl('', [Validators.required])
    });
  }
}
