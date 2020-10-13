import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilExpiredComponent } from './profil-expired.component';

describe('ProfilExpiredComponent', () => {
  let component: ProfilExpiredComponent;
  let fixture: ComponentFixture<ProfilExpiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilExpiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
