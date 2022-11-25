import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbilityDialogComponent } from './add-ability-dialog.component';

describe('AddAbilityDialogComponent', () => {
  let component: AddAbilityDialogComponent;
  let fixture: ComponentFixture<AddAbilityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAbilityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAbilityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
