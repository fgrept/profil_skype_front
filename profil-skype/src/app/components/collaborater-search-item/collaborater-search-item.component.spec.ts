import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboraterSearchItemComponent } from './collaborater-search-item.component';

describe('CollaboraterSearchItemComponent', () => {
  let component: CollaboraterSearchItemComponent;
  let fixture: ComponentFixture<CollaboraterSearchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboraterSearchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboraterSearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
