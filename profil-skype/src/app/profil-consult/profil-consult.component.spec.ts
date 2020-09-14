import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilConsultComponent } from './profil-consult.component';

describe('ProfilConsultComponent', () => {
  let component: ProfilConsultComponent;
  let fixture: ComponentFixture<ProfilConsultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilConsultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
