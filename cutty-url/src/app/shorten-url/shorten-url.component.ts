import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-shorten-url',
  templateUrl: './shorten-url.component.html',
  styleUrls: ['./shorten-url.component.css']
})
export class ShortenUrlComponent implements OnInit {
  url: FormGroup;
  shrotenedUrl: string;
  longUrl: string;

  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  urlSent(): void {
    this.longUrl = this.url.value.urlInput;
    console.log(this.longUrl);
    // send url to server to shorten
  }

  initForm(): void{
    const pattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.url = new FormGroup({
      urlInput: new FormControl('', [Validators.required, Validators.pattern(pattern)])
    });
  }

}
