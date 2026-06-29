import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUsername } from './create-username';

describe('CreateUsername', () => {
  let component: CreateUsername;
  let fixture: ComponentFixture<CreateUsername>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUsername],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUsername);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
