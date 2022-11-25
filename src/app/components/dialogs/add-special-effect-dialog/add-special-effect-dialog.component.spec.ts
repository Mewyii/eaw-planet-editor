import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpecialEffectDialogComponent } from './add-special-effect-dialog.component';

describe('AddSpecialEffectDialogComponent', () => {
  let component: AddSpecialEffectDialogComponent;
  let fixture: ComponentFixture<AddSpecialEffectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSpecialEffectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpecialEffectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
