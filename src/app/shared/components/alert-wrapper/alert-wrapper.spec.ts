import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertWrapper } from './alert-wrapper';

describe('AlertWrapper', () => {
  let component: AlertWrapper;
  let fixture: ComponentFixture<AlertWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
