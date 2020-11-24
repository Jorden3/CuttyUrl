import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUrlsComponent } from './account-urls.component';

describe('AccountUrlsComponent', () => {
  let component: AccountUrlsComponent;
  let fixture: ComponentFixture<AccountUrlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountUrlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUrlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
