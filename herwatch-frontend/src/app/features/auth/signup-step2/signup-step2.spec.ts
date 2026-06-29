import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupStep2 } from './signup-step2';

describe('SignupStep2', () => {
  let component: SignupStep2;
  let fixture: ComponentFixture<SignupStep2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupStep2],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupStep2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
