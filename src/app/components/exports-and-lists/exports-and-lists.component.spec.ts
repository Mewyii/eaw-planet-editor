import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportsAndListsComponent } from './exports-and-lists.component';

describe('ExportsAndListsComponent', () => {
  let component: ExportsAndListsComponent;
  let fixture: ComponentFixture<ExportsAndListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportsAndListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportsAndListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
