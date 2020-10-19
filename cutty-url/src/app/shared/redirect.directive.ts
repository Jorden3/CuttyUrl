import { Directive, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appRedirect]'
})
export class RedirectDirective {

  constructor(private elRef: ElementRef, private router: Router){}

  @HostListener('click', ['$event']) clicked(event: Event){
      const url = this.elRef.nativeElement.innerHTML;
      window.open(url, '_blank');
  };
}
