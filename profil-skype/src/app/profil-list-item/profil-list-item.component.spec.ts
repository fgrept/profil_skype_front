import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilListItemComponent } from './profil-list-item.component';

describe('ProfilListItemComponent', () => {
  let component: ProfilListItemComponent;
  let fixture: ComponentFixture<ProfilListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
