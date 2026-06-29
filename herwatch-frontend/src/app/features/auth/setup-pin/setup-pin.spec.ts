import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPin } from './setup-pin';

describe('SetupPin', () => {
  let component: SetupPin;
  let fixture: ComponentFixture<SetupPin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupPin],
    }).compileComponents();

    fixture = TestBed.createComponent(SetupPin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
