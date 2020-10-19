import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InflateUrlComponent } from './inflate-url.component';

describe('InflateUrlComponent', () => {
  let component: InflateUrlComponent;
  let fixture: ComponentFixture<InflateUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InflateUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InflateUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
