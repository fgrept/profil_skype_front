import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboraterSearchComponent } from './collaborater-search.component';

describe('CollaboraterSearchComponent', () => {
  let component: CollaboraterSearchComponent;
  let fixture: ComponentFixture<CollaboraterSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboraterSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboraterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
