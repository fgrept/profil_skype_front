import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilListFilterComponent } from './profil-list-filter.component';

describe('ProfilListFilterComponent', () => {
  let component: ProfilListFilterComponent;
  let fixture: ComponentFixture<ProfilListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
