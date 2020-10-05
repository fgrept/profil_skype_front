import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilCreateComponent } from './profil-create.component';

describe('ProfilCreateComponent', () => {
  let component: ProfilCreateComponent;
  let fixture: ComponentFixture<ProfilCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
