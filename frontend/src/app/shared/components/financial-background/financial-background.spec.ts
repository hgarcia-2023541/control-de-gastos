import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialBackground } from './financial-background';

describe('FinancialBackground', () => {
  let component: FinancialBackground;
  let fixture: ComponentFixture<FinancialBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialBackground]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialBackground);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
