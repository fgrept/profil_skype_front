import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlNotFoundComponent } from './url-not-found.component';

describe('UrlNotFoundComponent', () => {
  let component: UrlNotFoundComponent;
  let fixture: ComponentFixture<UrlNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
