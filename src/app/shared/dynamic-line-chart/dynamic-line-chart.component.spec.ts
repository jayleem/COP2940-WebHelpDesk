import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLineChartComponent } from './dynamic-line-chart.component';

describe('DynamicLineChartComponent', () => {
  let component: DynamicLineChartComponent;
  let fixture: ComponentFixture<DynamicLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
