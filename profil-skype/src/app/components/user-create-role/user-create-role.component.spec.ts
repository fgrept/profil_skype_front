import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateRoleComponent } from './user-create-role.component';

describe('UserCreateRoleComponent', () => {
  let component: UserCreateRoleComponent;
  let fixture: ComponentFixture<UserCreateRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreateRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreateRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
