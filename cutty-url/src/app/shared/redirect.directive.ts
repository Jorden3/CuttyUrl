import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appRedirect]'
})
export class RedirectDirective {
  @Input() url: string;
  @HostListener('click', ['$event']) clicked(event: Event){
    window.open(this.url, '_blank');
  };
  constructor(private elRef: ElementRef, private router: Router){}
}
