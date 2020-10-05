import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilCreateFormComponent } from './profil-create-form.component';

describe('ProfilCreateFormComponent', () => {
  let component: ProfilCreateFormComponent;
  let fixture: ComponentFixture<ProfilCreateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilCreateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
