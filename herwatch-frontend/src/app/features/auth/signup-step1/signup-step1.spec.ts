import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupStep1 } from './signup-step1';

describe('SignupStep1', () => {
  let component: SignupStep1;
  let fixture: ComponentFixture<SignupStep1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupStep1],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupStep1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
