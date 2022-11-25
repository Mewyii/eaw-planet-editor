import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationRowComponent } from './configuration-row.component';

describe('ConfigurationRowComponent', () => {
  let component: ConfigurationRowComponent;
  let fixture: ComponentFixture<ConfigurationRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
