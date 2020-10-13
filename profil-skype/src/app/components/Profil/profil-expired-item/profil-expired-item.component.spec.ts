import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilExpiredItemComponent } from './profil-expired-item.component';

describe('ProfilExpiredItemComponent', () => {
  let component: ProfilExpiredItemComponent;
  let fixture: ComponentFixture<ProfilExpiredItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilExpiredItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilExpiredItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
